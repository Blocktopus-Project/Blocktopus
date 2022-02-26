import { Err, Ok } from "./deps.ts";
import { Client } from "./client.ts";
import { deserialize } from "./serde/deserializer.ts";
import type { ServerBoundPayloads } from "./types/payloads/server_bound/mod.ts";
import type { Result } from "./deps.ts";
import type { Chat } from "./types/chat.ts";

type Icon = `data:image/png;base64,${string}`;

interface PlayerInfo {
  uuid: string;
  name: string;
}

interface QueueEntry {
  clientIndex: number;
  payload: ServerBoundPayloads;
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
  #queue: QueueEntry[] = [];
  #queueLock: Promise<void>;
  #resolveQueueLock!: CallableFunction;
  #rejectQueueLock!: CallableFunction;
  clients: Client[];
  serverInfo: ServerInfo;

  async #process(data: QueueEntry): Promise<void> {
    const _client = this.clients[data.clientIndex];
    await data.payload;
  }

  async #tick() {
    await this.#getLock();
    const queue = this.#queue;
    this.#queue = [];
    this.#resolveQueueLock();
    queue.map((x) => this.#process(x));
  }

  async #getLock() {
    await this.#queueLock;

    this.#queueLock = new Promise((
      res,
      rej,
    ) => (this.#resolveQueueLock = res, this.#rejectQueueLock = rej));
  }

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

    this.#queueLock = new Promise((
      res,
      rej,
    ) => (this.#resolveQueueLock = res, this.#rejectQueueLock = rej));
    this.#resolveQueueLock();

    if (config.favicon) {
      const encodedString = btoa(
        String.fromCharCode(...Deno.readFileSync(config.favicon)),
      );
      this.serverInfo.favicon = `data:image/png;base64,${encodedString}`;
    }
  }

  async listen() {
    for await (const conn of this.#inner) this.connectClient(conn);
  }

  async connectClient(conn: Deno.Conn): Promise<void> {
    const client = new Client(conn);
    const payloadBinary = await client.poll();
    if (payloadBinary[0] === 0xFE) return client.drop();

    // Only wants status
    if (payloadBinary[payloadBinary.length - 1] === 1) {
      // TODO: Send list ping
      return client.drop();
    }

    // TODO: Check if user is banned

    const res = this.addClient(client);

    if (res.isErr()) {
      // TODO: Respond with Login disconnect
      return client.drop();
    }

    this.serverInfo.players.online++;
    const clientIndex = res.unwrap();

    for await (const serializedPayload of client.startPolling()) {
      const payload = deserialize(serializedPayload, client.state);

      await this.#getLock();
      this.#queue.push({ clientIndex, payload });
      this.#resolveQueueLock();
    }

    delete this.clients[clientIndex];
    this.serverInfo.players.online--;
  }

  addClient(client: Client): Result<number, string> {
    const index = this.clients.findIndex((x) => !x);
    if (!index) return Err("No Free space");

    this.clients[index] = client;
    return Ok(index);
  }
}
