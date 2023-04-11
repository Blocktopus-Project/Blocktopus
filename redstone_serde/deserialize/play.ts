import { ServerError } from "@core/error.ts";

import type {
  ChangeDifficultyPayload,
  ConfirmTeleportationPayload,
  MessageAcknowledgementPayload,
  PlayPayloads,
  QueryBlockEntityTagPayload,
} from "@payloads/server/mod.ts";
import type { Reader } from "@util/reader.ts";

/** Small utility function to deserialize position */
function getPosition(reader: Reader) {
  const position = reader.getBigInt64();

  // There must be a better way to do this
  // I'm abusing this gross bitshifting to get long lists
  // of 1s to bitwise and with
  return {
    x: Number((position >> 38n) & ((1n << 26n) - 1n)),
    y: Number((position >> 12n) & ((1n << 26n) - 1n)),
    z: Number(position & ((1n << 12n) - 1n)),
  };
}

const PACKET_DECODERS = [
  confirmTeleportation,
  queryBlockEntityTag,
  changeDifficulty,
  messageAcknowledgment,
];

function confirmTeleportation(reader: Reader): ConfirmTeleportationPayload {
  return {
    teleportID: reader.getVarInt(),
  };
}

function queryBlockEntityTag(reader: Reader): QueryBlockEntityTagPayload {
  return {
    transactionID: reader.getVarInt(),
    location: getPosition(reader),
  };
}

function changeDifficulty(reader: Reader): ChangeDifficultyPayload {
  return {
    newDifficulty: reader.getInt8(),
  };
}

function messageAcknowledgment(reader: Reader): MessageAcknowledgementPayload {
  return {
    messageCount: reader.getVarInt(),
  };
}

export function deserializeLoginPackets(
  buffer: Reader,
  packetID: number,
): PlayPayloads {
  if (packetID < 0 || packetID >= PACKET_DECODERS.length) {
    throw new ServerError("Redstone Serde", "Unknown Packet ID");
  }

  return PACKET_DECODERS[packetID](buffer);
}
