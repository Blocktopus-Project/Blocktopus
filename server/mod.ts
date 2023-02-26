import { Client } from "../client.ts";
import { LogEntry, Logger } from "../error_handling/log.ts";
import { type HandshakePayload, State } from "../types/mod.ts";

interface PlayerInfo {
  uuid: string;
  name: string;
}

interface ServerInfo {
  version: {
    name: string;
    protocol: number;
  };
  players: {
    max: number;
    online: number;
    sample?: PlayerInfo[];
  };
  description?: unknown;
  favicon?: `data:image/png;base64,${string}`;
}

interface ServerConfig {
  port: number;
  maxPlayers: number;
  motd: string;
  favicon?: string;
  debug: boolean;
}

export class Server {
  #innerListener: Deno.Listener;
  #config: ServerConfig;
  #clients: Array<Client | null>;
  #logger: Logger;

  favicon: null | `data:image/png;base64,${string}`;

  get serverInfo(): ServerInfo {
    const info: ServerInfo = {
      version: {
        name: "1.19.2",
        protocol: 761,
      },
      players: {
        online: this.#clients.filter((x) => x !== null).length,
        max: this.#config.maxPlayers,
      },
      description: {
        text: this.#config.motd,
      },
    };

    if (this.favicon) {
      info.favicon = this.favicon;
    }

    return info;
  }

  constructor(config: ServerConfig) {
    this.#clients = new Array(config.maxPlayers).fill(null);
    this.#config = config;
    this.#logger = new Logger(config.debug);
    this.#logger.addOutput(Deno.stdout.writable);
    this.favicon = null;

    if (config.favicon) {
      const fileData = Deno.readFileSync(config.favicon);
      const base64String = btoa(String.fromCharCode(...fileData));
      this.favicon = `data:image/png;base64,${base64String}`;
    }

    this.#innerListener = Deno.listen({ port: config.port, transport: "tcp" });
  }

  async #connectClient(conn: Deno.Conn) {
    const client = new Client(conn);
    const handshake = await client.poll<HandshakePayload>();
    client.state = handshake.nextState;

    console.log({handshake})

    if (handshake.nextState === State.Login) {
      // Find empty slot
      const clientSlot = this.#clients.findIndex((x) => x === null);
      // Server is full
      if (clientSlot === -1) {
        client.drop();
      }

      this.#clients[clientSlot] = client;
      // TODO: Login Sequence
    }

    // TODO: Send server info
    client.send();

    for await (const packet of client) {
      // Client is already disconnected
      if (packet === null) break;
      console.log(packet);
    }

    client.drop();
  }

  async #startEventLoop() {}

  async #listenConnections() {
    for await (const conn of this.#innerListener) {
      this.#connectClient(conn);
    }
  }

  async listen() {
    this.#logger.write(
      new LogEntry("Info", `Listening on port: ${this.#config.port}`),
    );

    const eventLoopPromise = this.#startEventLoop();
    const connectionLoop = this.#listenConnections();

    await Promise.all([connectionLoop, eventLoopPromise]);
  }
}
