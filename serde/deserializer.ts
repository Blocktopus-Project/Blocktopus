import { State } from "../types/payloads/base.ts";
import { Err, Ok as _Ok } from "../deps.ts";
import type { Result } from "../deps.ts";
import type {
  ServerBoundPayloads,
} from "../types/payloads/server_bound/mod.ts";

export function deserialize(
  _buffer: Uint8Array,
  state: State,
): Result<ServerBoundPayloads, string> {
  switch (state) {
    // case State.Status: {
    //   return deserializeStatus(buffer);
    // }
    // case State.Login: {
    //   return deserializeLogin(buffer);
    // }
    // case State.Play: {
    //   return deserializePlay(buffer);
    // }
    default: {
      return Err("Invalid State");
    }
  }
}
