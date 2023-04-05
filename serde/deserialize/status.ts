import { ErrorKind, ServerError } from "@/error.ts";
import type { StatusPayloads } from "@server_payloads/mod.ts";
import type { Reader } from "@/util/reader.ts";

export function deserializeStatusPackets(
  reader: Reader,
  packedID: number,
): StatusPayloads {
  if (packedID < 0 || packedID > 1) {
    throw new ServerError(ErrorKind.Deserialization, "Unknown Packet ID");
  }

  if (packedID === 0) {
    return {};
  }

  return {
    payload: reader.getBigUint64(),
  };
}
