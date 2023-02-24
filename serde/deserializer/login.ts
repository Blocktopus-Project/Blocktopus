import {
  type LoginPayloads,
  type LoginStartPayload,
  type EncryptionResponsePayload,
} from "../../types/mod.ts";
import type { Packed } from "../../types/util.ts";
import { readVarInt } from "../../util/varint.ts";
import { deserializeString } from "../util.ts";

const PACKED_DECODERS = [
  loginStart,
  encryptionResponse,
]

function loginStart(buffer: Uint8Array): Packed<LoginStartPayload> {
  const [name, offset] = deserializeString(buffer);
  const hasPlayerUUID = !!buffer[offset];
  const dt = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const firstCompliment = dt.getBigUint64(1);
  const secondCompliment = dt.getBigUint64(9);

  // Slow asf :|
  const playerUUID = (firstCompliment << 64n) | secondCompliment;
  return {
    name,
    hasPlayerUUID,
    playerUUID
  };
}

function encryptionResponse(buffer: Uint8Array): Packed<EncryptionResponsePayload> {
  const [sharedSecretLength, offset] = readVarInt(buffer);
  const sharedSecret = buffer.subarray(offset, sharedSecretLength);
  buffer = buffer.subarray(offset);

  const [verifyTokenLength, offset2] = readVarInt(buffer);
  const verifyToken = buffer.subarray(offset2, verifyTokenLength);

  return {
    sharedSecretLength,
    sharedSecret,
    verifyTokenLength,
    verifyToken,
  }
}

export function deserializeLoginPackets(
  buffer: Uint8Array,
  packedID: number,
): Packed<LoginPayloads> {
  const decoder = PACKED_DECODERS[packedID];
  if (!decoder) throw new Error("Invalid or Unsupported Packet");

  return decoder(buffer); 
}
