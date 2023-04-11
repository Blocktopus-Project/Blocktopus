import { ServerError } from "@core/error.ts";

import type {
  EncryptionResponsePayload,
  LoginPayloads,
  LoginStartPayload,
} from "@payloads/server/mod.ts";
import type { Reader } from "@util/reader.ts";
import { deserializeUUID } from "../util.ts";

const PACKET_DECODERS = [
  loginStart,
  encryptionResponse,
];

function loginStart(reader: Reader): LoginStartPayload {
  return {
    name: reader.getString(),
    hasPlayerUUID: !!reader.getUint8(),
    // Slow asf :|
    playerUUID: deserializeUUID(reader),
  };
}

function encryptionResponse(
  reader: Reader,
): EncryptionResponsePayload {
  const sharedSecretLength = reader.getVarInt();
  const sharedSecret = reader.getSlice(sharedSecretLength);

  const verifyTokenLength = reader.getVarInt();
  const verifyToken = reader.getSlice(verifyTokenLength);

  return {
    sharedSecretLength,
    sharedSecret,
    verifyTokenLength,
    verifyToken,
  };
}

export function deserializeLoginPackets(
  buffer: Reader,
  packetID: number,
): LoginPayloads {
  if (packetID < 0 || packetID >= PACKET_DECODERS.length) {
    throw new ServerError("Redstone Serde", "Unknown Packet ID");
  }

  return PACKET_DECODERS[packetID](buffer);
}
