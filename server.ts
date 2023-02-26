import { Client } from "./client.ts";
import type { HandshakePayload } from "./types/mod.ts";

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
}

export class Server {
  #innerListener: Deno.Listener;
  #config: ServerConfig;
  #clients: Array<Client | null>;
  favicon: null | `data:image/png;base64,${string}`;

  get serverInfo(): ServerInfo {
    const info: ServerInfo = {
      version: {
        name: "1.19.2",
        protocol: 759,
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
    this.favicon = null;

    if (config.favicon) {
      const fileData = Deno.readFileSync(config.favicon);
      const base64String = btoa(String.fromCharCode(...fileData));
      this.favicon = `data:image/png;base64,${base64String}`;
    }

    this.#innerListener = Deno.listen({ port: config.port, transport: "tcp" });
  }

  async listen() {
    console.log("Server is now listening on port:", this.#config.port);
    for await (const conn of this.#innerListener) {
      this.connectClient(conn);
    }
  }

  async connectClient(conn: Deno.Conn) {
    const client = new Client(conn);
    const handshake = await client.poll<HandshakePayload>()
      .catch(() => client.drop());

    // Already handled in the catch
    if (!handshake) return;
    console.log(handshake, conn.remoteAddr);
  }
}
