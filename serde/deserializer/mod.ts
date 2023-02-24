import { type ServerBoundPayloads, State } from "../../types/mod.ts";
import { readVarInt } from "../../util/varint.ts";
import { deserializeLoginPackets } from "./login.ts";

const PACKED_DECODER = [
  deserializeLoginPackets,
];

export function deserialize(
  buffer: Uint8Array,
  state: State,
): ServerBoundPayloads {
  if (state == State.Status) throw new Error("Internal Error! Please report immediately");

  const [packedID, bytesRead] = readVarInt(buffer);
  const dataSlice = buffer.subarray(bytesRead);
  const decoder = PACKED_DECODER[state - 2];
  if (!decoder) throw new Error("Invalid State");

  const payload = decoder(dataSlice, packedID);

  return {
    state,
    packedID,
    ...payload
  }
}