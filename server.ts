import { readVarInt } from "./util/varint.ts";
import { decodePacket } from "./packets/decoder.ts";
import type { Client } from "./client.ts";

interface ServerConfig {
  port: number;
  maxPlayers: number;
  motd: string;
}

export class Server {
  #inner: Deno.Listener;
  clients: Client[];
  constructor(config: ServerConfig) {
    this.clients = new Array(config.maxPlayers);
    this.#inner = Deno.listen({ port: config.port, transport: "tcp" });
  }

  async listen() {
    for await (const conn of this.#inner) {
      this.connectClient(conn);
    }
  }

  async connectClient(conn: Deno.Conn) {
    const packetSizeBytes = new Uint8Array(5);
    await conn.read(packetSizeBytes);

    const [packetSize, bytesRead] = readVarInt(packetSizeBytes);

    const binaryBuffer = new Uint8Array(packetSize);
    binaryBuffer.set(packetSizeBytes.subarray(bytesRead), 0);
    await conn.read(binaryBuffer);

    const packet = decodePacket(binaryBuffer);
  }

  addClient(client: Client) {
    const index = this.clients.findIndex((x) => !x);
    if (!index) {
      // No spot
      return;
    }
    this.clients[index] = client;
  }

  removeClient(index: number) {
    const client = this.clients[index];
    if (!client) return;

    client.drop();
  }

  // toJSON(): string {
  // }
}
