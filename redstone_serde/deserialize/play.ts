import { ServerError } from "@core/error.ts";

import type {
  PlayPayloads,
  // QueryBlockBNTPayload,
  TeleportConfirmPayload,
} from "@payloads/server/mod.ts";
import type { Reader } from "@util/reader.ts";

const PACKET_DECODERS = [
  confirmTeleportation,
  // queryBlockEntityTag
];

function confirmTeleportation(reader: Reader): TeleportConfirmPayload {
  return {
    teleportID: reader.getVarInt(),
  };
}

// function queryBlockEntityTag(reader: Reader): QueryBlockBNTPayload {
//   return {
//     transactionID: reader.getVarInt(),
//     location: {
//       x: reader.getBigInt64(),
//       y: reader.getBigInt64(),
//       z: reader.getBigInt64(),
//     }
//   };
// }

export function deserializeLoginPackets(
  buffer: Reader,
  packetID: number,
): PlayPayloads {
  if (packetID < 0 || packetID >= PACKET_DECODERS.length) {
    throw new ServerError("Redstone Serde", "Unknown Packet ID");
  }

  return PACKET_DECODERS[packetID](buffer);
}
