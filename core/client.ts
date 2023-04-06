import { LogEntry, Logger } from "@core/logger.ts";
import { ServerError } from "@core/error.ts";
import { readVarInt } from "@util/varint.ts";
import { deserialize, serialize } from "@serde/mod.ts";
import { type Packet, State } from "@payloads/mod.ts";
import type { ClientBoundPayloads } from "@payloads/client/mod.ts";
import type { ServerBoundPayloads } from "@payloads/server/mod.ts";

export class Client {
  #inner: Deno.Conn;
  #logger: Logger;
  state: State;

  constructor(conn: Deno.Conn, logger: Logger) {
    this.#inner = conn;
    this.#logger = logger;
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
      throw new ServerError("Polling", "Cannot poll disconnected client");
    }

    const reader = this.#inner.readable.getReader({ mode: "byob" });

    const { value: packetSizeBytes } = await reader.read(
      new Uint8Array(3),
    );

    if (!packetSizeBytes) {
      throw new ServerError("Polling", "Bad poll. Could not get packet size");
    }

    // 1.6 server list ping
    if (
      packetSizeBytes[0] === 0xFE &&
      packetSizeBytes[1] === 0x01 &&
      packetSizeBytes[2] === 0xFA
    ) {
      await this.#logger.writeLog(
        new LogEntry("Debug", "Legacy server list ping."),
      );
      return this.poll();
    }

    const [packetSize, bytesRead] = readVarInt(packetSizeBytes);

    const { value: packetBuffer } = await reader.read(
      new Uint8Array(packetSize),
    );

    reader.releaseLock();

    if (!packetBuffer) {
      throw new ServerError("Polling", "Bad poll. Could not read packet");
    }

    // `3 - bytesRead` because `packetSizeBytes` is statically allocated to be 3 bytes
    const packetBytes = new Uint8Array(3 - bytesRead + packetBuffer.length);

    // I hate this double copy
    packetBytes.set(packetSizeBytes.subarray(bytesRead));
    packetBytes.set(packetBuffer, 3 - bytesRead);

    return deserialize<T>(packetBytes, this.state);
  }
}
