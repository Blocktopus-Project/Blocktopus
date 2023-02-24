import { readVarInt } from "./util/varint.ts";
import { writeAll } from "./deps.ts";
import { serialize as _ } from "./serde/serializer.ts";
import { type ClientBoundPayloads, State } from "./types/mod.ts";

export class Client {
  #inner: Deno.Conn;
  state: State;
  name?: string;
  UUID?: string;

  constructor(connection: Deno.Conn) {
    this.#inner = connection;
    this.state = State.HandShaking;
  }

  drop() {
    this.#inner.close();
    this.state = State.Disconnected;
  }

  async poll(): Promise<Uint8Array> {
    if (this.state === State.Disconnected) {
      throw new Error("Cannot poll disconnected client");
    }

    const packetSizeBytes = new Uint8Array(3);
    await this.#inner.read(packetSizeBytes);
    const [packetSize, bytesRead] = readVarInt(packetSizeBytes);

    // Not more than 3 bytes total. No new poll needed
    // Likely a ping
    if (packetSize + bytesRead - 3 < 1) return packetSizeBytes.subarray(1);

    const readBuffer = new Uint8Array(packetSize + bytesRead - 3);
    await this.#inner.read(readBuffer);
    const payloadBuffer = new Uint8Array(readBuffer.length + 3 - bytesRead);

    payloadBuffer.set(packetSizeBytes.subarray(bytesRead));
    payloadBuffer.set(readBuffer, 3 - bytesRead);

    return payloadBuffer;
  }

  startPolling(): AsyncIterable<Uint8Array> {
    // deno-lint-ignore no-this-alias
    const thisClient = this;
    return {
      [Symbol.asyncIterator]() {
        return {
          next: async () => ({
            value: await thisClient.poll(),
            done: thisClient.state === State.Disconnected,
          }),
        };
      },
    };
  }

  send(payload: ClientBoundPayloads): Promise<void> {
    return writeAll(this.#inner, payload); // serialize(payload));
  }
}
