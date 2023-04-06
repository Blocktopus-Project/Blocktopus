import { ServerError } from "@core/error.ts";
import type { StatusPayloads } from "@payloads/server/mod.ts";
import type { Reader } from "@util/reader.ts";

export function deserializeStatusPackets(
  reader: Reader,
  packedID: number,
): StatusPayloads {
  if (packedID < 0 || packedID > 1) {
    throw new ServerError("Redstone Serde", "Unknown Packet ID");
  }

  if (packedID === 0) {
    return {};
  }

  return {
    payload: reader.getBigUint64(),
  };
}
