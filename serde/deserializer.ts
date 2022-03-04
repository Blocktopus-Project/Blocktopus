import {
  type LoginPayloads,
  type ServerBoundPayloads,
  State,
} from "../types/mod.ts";
import { readVarInt } from "../util/varint.ts";

const _TEXT_DECODER = new TextDecoder();

export function deserialize(
  buffer: Uint8Array,
  state: State,
): ServerBoundPayloads {
  const [packedID, bytesRead] = readVarInt(buffer);
  const dataSlice = buffer.subarray(bytesRead);
  switch (state) {
    case State.Status: {
      throw new Error("Internal Error! Please report immediately");
    }
    case State.Login: {
      return deserializeLoginPackets(dataSlice, packedID);
    }
    // case State.Play: {
    //   return deserializePlay(buffer);
    // }
    default: {
      throw new Error("Invalid State");
    }
  }
}

function deserializeLoginPackets(
  _buffer: Uint8Array,
  packedID: number,
): LoginPayloads {
  switch (packedID) {
    case 0x00: {
      return { state: State.Login, packedID, name: "" };
    }
    default:
      throw new Error("Invalid or Unsupported Packet");
  }
}
