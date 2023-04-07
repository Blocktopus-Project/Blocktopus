import { LogEntry, Logger } from "@core/logger.ts";
import { ServerError } from "@core/error.ts";
import { readVarInt } from "@util/varint.ts";
import { deserialize, serialize } from "@serde/mod.ts";
import { type Packet, State } from "@payloads/mod.ts";
import type { ClientBoundPayloads } from "@payloads/client/mod.ts";
import type { HandshakePayload, ServerBoundPayloads } from "@payloads/server/mod.ts";
import type { Server } from "@core/server.ts";

export class Client {
  #inner: Deno.Conn;
  #logger: Logger;
  state: State;
  id: number;

  constructor(conn: Deno.Conn, logger: Logger) {
    this.#inner = conn;
    this.#logger = logger;
    this.state = State.HandShaking;
    this.id = conn.rid;
  }

  /**
   * Returns `false` if the client only wants a Server List Ping
   */
  static async establishConnection(conn: Deno.Conn, server: Server): Promise<Client | false> {
    const tempClient = new Client(conn, server);
    const packet = await tempClient.poll<HandshakePayload>();

    // Legacy ping
    if (packet.packetID === 122) {
      tempClient.#logger.writeLog(new LogEntry("Debug", "Legacy Ping"));
      tempClient.drop();
      return false;
    }

    tempClient.state = packet.nextState;
    // Set state to the next one
    await tempClient.send({
      state: State.HandShaking,
      packetID: 0x00,
      jsonResponse: JSON.stringify(server.serverInfo),
    });

    return tempClient;
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

    const packetSizeBytes = (await reader.read(new Uint8Array(3))).value;
    if (!packetSizeBytes) {
      throw new ServerError("Polling", "Bad poll. Could not get packet size");
    }

    const [packetSize, bytesRead] = readVarInt(packetSizeBytes);
    // Check for status ping
    if (packetSize === 0 && this.state === State.Status) {
      reader.releaseLock();
      return deserialize<T>(packetSizeBytes, this.state);
    }

    const packetBuffer = (await reader.read(new Uint8Array(packetSize))).value;
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
