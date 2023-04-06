import type { ServerError } from "./error.ts";

type LogKind = "Warning" | "Error" | "Severe Error" | "Info" | "Debug";

const DATE_TIME = Intl.DateTimeFormat("nl-NL", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export class LogEntry {
  readonly kind: LogKind;
  readonly message: string;
  readonly cause?: LogEntry;

  constructor(kind: LogKind, message: string, cause?: LogEntry) {
    this.kind = kind;
    this.message = message;
    this.cause = cause;
  }

  static fromError(error: ServerError): LogEntry {
    const kind = error.isFatal ? "Severe Error" : "Error";
    return new LogEntry(kind, `${error.name}: ${error.message}`);
  }

  fmt(): string {
    // deno-fmt-ignore
    const error = `[${this.kind}: ${DATE_TIME.format(new Date())}] ${this.message}\n`;

    if (this.cause) {
      return `${this.cause.fmt()}\n${error}`;
    }

    return error;
  }
}

export class Logger {
  #transformStreams: TransformStream<LogEntry, string>[];
  #isDebug: boolean;
  #fileHandles: Deno.FsFile[];

  constructor(isDebug = false) {
    this.#transformStreams = [];
    this.#fileHandles = [];
    this.#isDebug = isDebug;
  }

  addStreamOutput(stream: WritableStream<Uint8Array>) {
    const base = new TransformStream<LogEntry, string>({
      transform(data, controller) {
        controller.enqueue(data.fmt());
      },
    });

    base.readable.pipeThrough(new TextEncoderStream()).pipeTo(stream);

    this.#transformStreams.push(base);
  }

  addFileOutput(path: URL) {
    const file = Deno.openSync(path, {
      create: true,
      write: true,
      append: false,
    });
    this.addStreamOutput(file.writable);
    this.#fileHandles.push(file);
  }

  async writeLog(entry: LogEntry) {
    if (entry.kind === "Debug" && !this.#isDebug) return;

    for (let i = 0; i < this.#transformStreams.length; i++) {
      const stream = this.#transformStreams[i];
      const writer = stream.writable.getWriter();
      await writer.write(entry);
      writer.releaseLock();
    }
  }

  async drop() {
    for (let i = 0; i < this.#transformStreams.length; i++) {
      const stream = this.#transformStreams[i];
      await stream.writable.close();
      await stream.readable.cancel();
    }

    for (let i = 0; i < this.#fileHandles.length; i++) {
      const handle = this.#fileHandles[i];
      handle.close();
    }
  }
}
