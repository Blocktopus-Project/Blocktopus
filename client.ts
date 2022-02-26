import { readVarNum } from "./util/varint.ts";
import { writeAll } from "./deps.ts";
import { serialize } from "./serde/serializer.ts";
import type { ClientBoundPayloads } from "./types/payloads/client_bound/mod.ts";
import { State } from "./types/payloads/base.ts";

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
    const packetSizeBytes = new Uint8Array(3);
    await this.#inner.read(packetSizeBytes);

    const [packetSize, bytesRead] = readVarNum(packetSizeBytes, 3).unwrap();

    const readBuffer = new Uint8Array(packetSize - (3 - bytesRead));
    await this.#inner.read(readBuffer);
    const payloadBinary = new Uint8Array(
      readBuffer.length + packetSizeBytes.length - bytesRead,
    );

    payloadBinary.set(packetSizeBytes.subarray(bytesRead));
    payloadBinary.set(readBuffer, packetSizeBytes.length - bytesRead);

    return payloadBinary;
  }

  startPolling(): AsyncIterable<Uint8Array> {
    // deno-lint-ignore no-this-alias
    const thisClient = this;
    return {
      [Symbol.asyncIterator]() {
        return {
          next: async () => {
            return {
              value: await thisClient.poll(),
              done: thisClient.state === State.Disconnected,
            };
          },
        };
      },
    };
  }

  send(payload: ClientBoundPayloads): Promise<void> {
    return writeAll(this.#inner, serialize(payload));
  }
}
