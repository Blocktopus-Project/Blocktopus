import { LogEntry, Logger } from "@core/logger.ts";
import { EventLoop } from "@core/eventloop.ts";
import type { ServerPacket } from "@payloads/server/mod.ts";
import type { ServerError } from "@core/error.ts";
import { Client } from "@core/client.ts";

const VERSION_INFO = {
  name: "1.19.4",
  protocol: 762,
};

interface ServerConfig {
  maxPlayers: number;
  motd: string;
  port: number;
  logDirectory?: string;
  faviconPath?: string;
  debug?: boolean;
}

interface ServerInfo {
  version: {
    name: string;
    protocol: number;
  };
  players: {
    online: number;
    max: number;
    sample?: [],
  };
  description: {
    text: string;
  };
  favicon?: `data:image/png;base64,${string}`;
  enforcesSecureChat: boolean;
}

export class Server extends Logger {
  #clients: Map<string, Client>;
  #abortController: AbortController;
  #eventLoop: EventLoop<ServerPacket>;
  #config: ServerConfig;
  #innerListener: Deno.Listener;

  favicon: null | `data:image/png;base64,${string}`;

  get serverInfo(): ServerInfo {
    const info: ServerInfo = {
      version: VERSION_INFO,
      players: {
        online: this.#clients.size,
        max: this.#config.maxPlayers,
      },
      description: {
        text: this.#config.motd,
      },
      enforcesSecureChat: false,
    };

    if (this.favicon) {
      info.favicon = this.favicon;
    }

    return info;
  }

  constructor(config: ServerConfig) {
    super(config.debug);
    this.#clients = new Map();
    this.#abortController = new AbortController();
    this.#eventLoop = new EventLoop(this.#abortController.signal, 1000 / 20);
    this.#config = config;

    this.#innerListener = Deno.listen({
      port: this.#config.port,
      transport: "tcp",
    });

    // Set up logger
    if (this.#config.logDirectory) {
      const directoryURL = new URL(this.#config.logDirectory, Deno.cwd());
      const fileURL = new URL(`./${new Date().toISOString()}`, directoryURL);
      super.addFileOutput(fileURL);
    }
    super.addStreamOutput(Deno.stdout.writable);

    // Create favicon
    this.favicon = null;
    if (this.#config.faviconPath) {
      const fileData = Deno.readFileSync(this.#config.faviconPath);
      const base64 = btoa(String.fromCharCode(...fileData));
      this.favicon = `data:image/png;base64,${base64}`;
    }
  }

  async #startListening() {
    for await (const conn of this.#innerListener) {
      const client = await Client.establishConnection(conn, this);
      if (!client) continue;
      this.#eventLoop.setEventPoller("client_poll", client.id, client.poll);
    }
  }

  async #startEventLoop() {
    this.#eventLoop.setErrorHandler(createErrorHandler(this.#abortController, this));
    await this.#eventLoop.startLoop();
  }

  async listen() {
    const abortPromise = new Promise((res) => this.#abortController.signal.onabort = res);
    const eventLoopPromise = this.#startEventLoop();
    const listenerPromise = this.#startListening();

    await super.writeLog(
      new LogEntry("Info", `Listening on port: ${this.#config.port}`),
    );

    return Promise.race([listenerPromise, eventLoopPromise, abortPromise]);
  }
}

function createErrorHandler(abortController: AbortController, server: Server) {
  return async function (e: ServerError) {
    await server.writeLog(LogEntry.fromError(e));
    if (e.isFatal) {
      abortController.abort(e);
    }
  };
}
