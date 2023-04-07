import { ServerError } from "@core/error.ts";
import type { PingResponse, StatusPayloads, StatusResponse } from "@payloads/client/mod.ts";
import type { Packet } from "@payloads/mod.ts";
import type { Writer } from "@util/writer.ts";

export function serializeStatusPackets(
  writer: Writer,
  packet: Packet<StatusPayloads>,
): void {
  if (packet.packetID < 0 || packet.packetID > 1) {
    throw new ServerError("Redstone Serde", "Unknown Packet ID");
  }

  if (packet.packetID === 0) {
    writer.setString((packet as StatusResponse).jsonResponse);
    return;
  }

  writer.setBigUint64((packet as PingResponse).payload);
}
