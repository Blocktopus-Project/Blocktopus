import { readVarInt } from "@/util/varint.ts";
import { deserialize, serialize } from "@/serde/mod.ts";
import { type Packet, State } from "@/types/mod.ts";
import type { ClientBoundPayloads } from "@client_payloads/mod.ts";
import type { ServerBoundPayloads } from "@server_payloads/mod.ts";

export class Client {
  #inner: Deno.Conn;
  state: State;

  constructor(conn: Deno.Conn) {
    this.#inner = conn;
    this.state = State.HandShaking;
  }

  drop() {
    this.#inner.close();
    this.state = State.Disconnected;
  }

  async send(packet: Packet<ClientBoundPayloads>): Promise<void> {
    const writer = this.#inner.writable.getWriter();

    await writer.write(serialize(packet, this.state));
    writer.releaseLock();
  }

  async poll<T extends ServerBoundPayloads>(): Promise<Packet<T>> {
    if (this.state === State.Disconnected) {
      throw new Error("Cannot poll disconnected client");
    }

    const reader = this.#inner.readable.getReader({ mode: "byob" });
    const { value: packetSizeBytes } = await reader.read(new Uint8Array(3));
    if (!packetSizeBytes) {
      throw new Error("Bad poll. Could not get packet size");
    }

    const [packetSize, bytesRead] = readVarInt(packetSizeBytes);

    const { value: packetBuffer } = await reader.read(
      new Uint8Array(packetSize),
    );

    reader.releaseLock();

    if (!packetBuffer) throw new Error("Bad poll. Could not read packet");

    // 1.6 server list ping
    if (packetBuffer[0] === 0xFE && packetBuffer[1] === 1) {
      throw new Error("Legacy server list ping.");
    }

    // `3 - bytesRead` because `packetSizeBytes` is statically allocated to be 3 bytes
    const packetBytes = new Uint8Array(3 - bytesRead + packetBuffer.length);

    // I hate this double copy
    packetBytes.set(packetSizeBytes.subarray(bytesRead));
    packetBytes.set(packetBuffer, 3 - bytesRead);

    return deserialize<T>(packetBytes, this.state);
  }

  [Symbol.asyncIterator]() {
    if (this.state === State.Disconnected) {
      throw new Error("Cannot poll disconnected client");
    }

    return {
      next: async () => {
        if (this.state === State.Disconnected) {
          return {
            done: true,
            value: null,
          };
        }

        return {
          done: false,
          value: await this.poll(),
        };
      },
    };
  }
}
