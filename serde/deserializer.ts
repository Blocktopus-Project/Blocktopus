import {
  type LoginPayloads,
  type PlayPayloads,
  type ServerBoundPayloads,
  State,
} from "../types/mod.ts";
import { readVarInt } from "../util/varint.ts";
import { deserializePosition, deserializeString } from "./util.ts";

export function deserialize(
  buffer: Uint8Array,
  state: State,
): ServerBoundPayloads {
  const [packedID, bytesRead] = readVarInt(buffer);
  const dataSlice = buffer.subarray(bytesRead);

  switch (state) {
    case State.Status:
      throw new Error("Internal Error! Please report immediately");

    case State.Login:
      return deserializeLoginPackets(dataSlice, packedID);

    case State.Play:
      return deserializePlayPackets(buffer, packedID);

    default:
      throw new Error("Invalid State");
  }
}

function deserializePlayPackets(
  buffer: Uint8Array,
  packedID: number,
): PlayPayloads {
  switch (packedID) {
    case 0x00:
      return {
        state: State.Play,
        packedID,
        teleportID: readVarInt(buffer)[0],
      };

    case 0x01: {
      const [id, readBytes] = readVarInt(buffer);
      return {
        state: State.Play,
        packedID,
        transactionID: id,
        location: deserializePosition(buffer.subarray(readBytes))[0],
      };
    }

    default:
      throw new Error("Invalid or Unsupported Packet");
  }
}

function deserializeLoginPackets(
  buffer: Uint8Array,
  packedID: number,
): LoginPayloads {
  switch (packedID) {
    case 0x00: {
      return {
        state: State.Login,
        packedID,
        name: deserializeString(buffer)[0],
      };
    }
    default:
      throw new Error("Invalid or Unsupported Packet");
  }
}
