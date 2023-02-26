import { readVarInt } from "./util/varint.ts";
import { serialize, serialize as _ } from "./serde/serializer.ts";
import {
  type ClientBoundPayloads,
  type ServerBoundPayloads,
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

  async poll(): Promise<ServerBoundPayloads> {
    if (this.state === State.Disconnected) {
      throw new Error("Connot poll disconnected client");
    }

    const reader = this.#inner.readable.getReader({ mode: "byob" });
    const { value: packetSizeBytes } = await reader.read(new Uint8Array(3));
    if (!packetSizeBytes) {
      throw new Error("Bad poll. Could not get packet size");
    }

    const [packetSize] = readVarInt(packetSizeBytes);
    const { value: packetBuffer } = await reader.read(
      new Uint8Array(packetSize),
    );

    reader.releaseLock();

    if (!packetBuffer) throw new Error("Bad poll. Could not read packet");

    return deserialize(packetBuffer, this.state);
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
