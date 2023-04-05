import { ErrorKind, ServerError } from "@/error.ts";
import { serializeStatusPackets } from "./status.ts";
import { Writer } from "@util/writer.ts";
import type { ClientPacket } from "@payloads/client/mod.ts";
import type { State } from "@payloads/mod.ts";

type Encoder = (writer: Writer, packet: ClientPacket) => void;

const PACKED_ENCODER: Encoder[] = [
  serializeStatusPackets,
  // serializeLoginPackets,
  // serializePlayPackets
];

export function serialize(packet: ClientPacket, state: State): Uint8Array {
  const idx = state - 1;
  if (idx < 0 || idx >= PACKED_ENCODER.length) {
    throw new ServerError(ErrorKind.Deserialization, "Invalid State");
  }

  const writer = new Writer();
  writer.setVarInt(packet.packedID);
  PACKED_ENCODER[idx](writer, packet);

  return writer.intoPacket();
}
