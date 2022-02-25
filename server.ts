import { Err, Ok } from "./deps.ts";
import type { Result } from "./deps.ts";
import { pollConnection } from "./util/connection.ts";
import type { Client } from "./client.ts";
import type { Chat } from "./types/chat.ts";

type Icon = `data:image/png;base64,${string}`;

interface PlayerInfo {
  uuid: string;
  name: string;
}

interface ServerInfo {
  version: {
    name: "1.18.1";
    protocol: 757;
  };
  players: {
    max: number;
    online: number;
    sample?: PlayerInfo[];
  };
  description?: Chat;
  favicon?: Icon;
}

interface ServerConfig {
  port: number;
  maxPlayers: number;
  motd: string;
  favicon?: string;
}

export class Server {
  #inner: Deno.Listener;
  clients: Client[];
  serverInfo: ServerInfo;

  constructor(config: ServerConfig) {
    this.clients = new Array(config.maxPlayers);
    this.#inner = Deno.listen({ port: config.port, transport: "tcp" });
    this.serverInfo = {
      version: {
        name: "1.18.1",
        protocol: 757,
      },
      players: {
        online: 0,
        max: config.maxPlayers,
      },
      description: {
        text: config.motd,
      },
    };
    if (config.favicon && new URL(config.favicon).protocol === "file:") {
      const encodedString = btoa(
        String.fromCharCode(...Deno.readFileSync(config.favicon)),
      );
      this.serverInfo.favicon = `data:image/png;base64,${encodedString}`;
    }
  }

  async listen() {
    for await (const conn of this.#inner) this.connectClient(conn);
  }

  async connectClient(conn: Deno.Conn) {
    const payloadBinary = await pollConnection(conn);

    if (payloadBinary[payloadBinary.length - 1] === 2) {
      // Wants to connect. Create user
    }
  }

  addClient(client: Client): Result<undefined, string> {
    const index = this.clients.findIndex((x) => !x);
    if (!index) return Err("No Free space");

    this.clients[index] = client;
    return Ok(undefined);
  }

  removeClient(index: number) {
    const client = this.clients[index];
    if (!client) return;

    client.drop();
  }
}
