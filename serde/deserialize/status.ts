import type { StatusPayloads } from "@server_payloads/mod.ts";
import type { Reader } from "@/util/reader.ts";

export function deserializeStatusPackets(
  reader: Reader,
  packedID: number,
): StatusPayloads {
  if (packedID < 0 || packedID > 1) throw Error("Invalid or Unsupported Packet");

  if (packedID === 0) {
    return {};
  }

  return {
    payload: reader.getBigUint64()
  }
}
