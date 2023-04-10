import { ServerError } from "@core/error.ts";
import { Reader } from "@util/reader.ts";
import { deserializeLoginPackets } from "./login.ts";
import { deserializeStatusPackets } from "./status.ts";
import { type Packet, State } from "@payloads/mod.ts";
import type { HandshakePayload, ServerBoundPayloads } from "@payloads/server/mod.ts";

function deserializeHandshakePackets(
  reader: Reader,
  _packetID: number,
): HandshakePayload {
  return {
    protocolVersion: reader.getVarInt(),
    serverAdress: reader.getString(),
    serverPort: reader.getUint16(),
    nextState: reader.getUint8(),
  };
}

type Decoder = (reader: Reader, packetID: number) => ServerBoundPayloads;

const PACKET_DECODER: Decoder[] = [
  deserializeHandshakePackets,
  deserializeStatusPackets,
  deserializeLoginPackets,
  /** Todo */
  () => {
    throw new ServerError("Redstone Serde", "Deserializer todo!");
  },
];

export function deserialize<T extends ServerBoundPayloads>(
  buffer: Uint8Array,
  state: State,
): Packet<T> {
  const buffReader = new Reader(buffer);
  const packetID = buffReader.getVarInt();
  if (state < 0 || state >= PACKET_DECODER.length) {
    throw new ServerError("Redstone Serde", "Invalid State");
  }

  return {
    state,
    packetID,
    ...PACKET_DECODER[state](buffReader, packetID),
  } as Packet<T>;
}
