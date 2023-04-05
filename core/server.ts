import { LogEntry, Logger } from "./logger.ts";
import { Client } from "../client.ts";
import { EventLoop } from "./eventloop.ts";
import type { ServerPacket } from "@server_payloads/mod.ts";

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
  },
  players: {
    online: number;
    max: number;
  },
  description: {
    text: string;
  },
  favicon?: `data:image/png;base64${string}`;
}

export class Server extends Logger {
  #innerListener: Deno.Listener;
  #config: ServerConfig;
  #clients: Map<string, Client> = new Map();
  #eventLoop: EventLoop<ServerPacket> = new EventLoop(1000 / 20);

  favicon: null | `data:image/png;base64${string}` = null;

  get serverInfo(): ServerInfo {
    const info: ServerInfo = {
      version: VERSION_INFO,
      players: {
        online: this.#clients.size,
        max: this.#config.maxPlayers,
      },
      description: {
        text: this.#config.motd,
      }
    };

    if (this.favicon) {
      info.favicon = this.favicon;
    }

    return info;
  }

  constructor(config: ServerConfig) {
    super(config.debug);
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

    // Create favicon
    if (this.#config.faviconPath) {
      const fileData = Deno.readFileSync(this.#config.faviconPath);
      const base64 = btoa(String.fromCharCode(...fileData));
      this.favicon = `data:image/png;base64,${base64}`;
    }

    super.writeLog(
      new LogEntry("Info", `Server started on port ${this.#config.port}`),
    );
  }

  async startListening() {}

  async startEventLoop() {}


  async listen() {
    const listenerPromise = this.startListening();
    const eventLoopPromise = this.startEventLoop();

    await super.writeLog(
      new LogEntry("Info", `Listening on port: ${this.#config.port}`),
    );

    await Promise.all([listenerPromise, eventLoopPromise]);
  }
}
