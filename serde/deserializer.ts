import { State } from "../types/payloads/base.ts";
import { Err, Ok } from "../deps.ts";
import { readVarInt } from "../util/varint.ts";
import type { Result } from "../deps.ts";
import type {
  LoginPayloads,
  ServerBoundPayloads,
  // PlayPayloads,
} from "../types/payloads/server_bound/mod.ts";

const TEXT_DECODER = new TextDecoder();

function deserializeLogin(buffer: Uint8Array): Result<LoginPayloads, string> {
  const maybePacketID = readVarInt(buffer);
  if (maybePacketID.isErr()) return Err(maybePacketID.unwrapErr());
  const [packedID, bytesRead] = maybePacketID.unwrap();

  switch (packedID) {
    case 0x00:
      return Ok({
        state: State.Login,
        packedID,
        // This is wrong
        name: TEXT_DECODER.decode(buffer.subarray(bytesRead)),
      });
    // case 0x01: Encryption Response
    // case 0x02: Login Plugin Response
    default:
      return Err("Invalid Payload");
  }
}

export function deserialize(
  buffer: Uint8Array,
  state: State,
): Result<ServerBoundPayloads, string> {
  switch (state) {
    case State.Status: {
      return Err("Internal Error! Please report immediately");
    }
    case State.Login: {
      return deserializeLogin(buffer);
    }
    // case State.Play: {
    //   return deserializePlay(buffer);
    // }
    default: {
      return Err("Invalid State");
    }
  }
}
