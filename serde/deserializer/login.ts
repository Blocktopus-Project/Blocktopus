import type {
  EncryptionResponsePayload,
  LoginPayloads,
  LoginStartPayload,
} from "../../types/mod.ts";
import type { Reader } from "../../util/reader.ts";

const PACKED_DECODERS = [
  loginStart,
  encryptionResponse,
];

function loginStart(reader: Reader): LoginStartPayload {
  return {
    name: reader.getString(),
    hasPlayerUUID: !!reader.getUint8(),
    // Slow asf :|
    playerUUID: (reader.getBigUint64() << 64n) | reader.getBigUint64(),
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
  packedID: number,
): LoginPayloads {
  const decoder = PACKED_DECODERS[packedID];
  if (!decoder) throw new Error("Invalid or Unsupported Packet");

  return decoder(buffer);
}
