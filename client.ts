import { readVarInt } from "./util/varint.ts";
import { serialize } from "./serde/serializer.ts";
import {
  type ClientBoundPayloads,
  type ServerPacket,
  State,
} from "./types/mod.ts";
import { deserialize } from "./serde/deserializer/mod.ts";

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

  async send(payload: ClientBoundPayloads): Promise<void> {
    const writer = this.#inner.writable.getWriter();
    await writer.write(serialize(payload));
    await writer.close();
  }

  async poll(): Promise<ServerPacket> {
    if (this.state === State.Disconnected) {
      throw new Error("Connot poll disconnected client");
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

    return deserialize(packetBytes, this.state);
  }

  [Symbol.asyncIterator]() {
    if (this.state === State.Disconnected) {
      throw new Error("Cannot poll disconnected client");
    }

    return {
      next: async () => {
        if (this.state === State.Disconnected) {
          return {
            value: null,
            done: true,
          };
        }

        return {
          value: await this.poll(),
          done: false,
        };
      },
    };
  }
}
