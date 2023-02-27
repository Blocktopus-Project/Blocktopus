import { Reader } from "@/util/reader.ts";
import { deserializeLoginPackets } from "./login.ts";
import { deserializeStatusPackets } from "./status.ts";
import { State, type Packet } from "@/types/mod.ts";
import type {
  HandshakePayload,
  ServerBoundPayloads,
} from "@server_payloads/mod.ts";

function deserializeHandshakePackets(
  reader: Reader,
  _packedID: number,
): HandshakePayload {
  return {
    protocolVersion: reader.getVarInt(),
    serverAdress: reader.getString(),
    serverPort: reader.getUint16(),
    nextState: reader.getUint8(),
  };
}

type Decoder = (reader: Reader, packedID: number) => ServerBoundPayloads;

const PACKED_DECODER: Decoder[] = [
  deserializeHandshakePackets,
  deserializeStatusPackets,
  deserializeLoginPackets,
  /** Todo */
  () => {
    throw "todo!";
  },
];

export function deserialize<T extends ServerBoundPayloads>(
  buffer: Uint8Array,
  state: State,
): Packet<T> {
  const buffReader = new Reader(buffer);
  const packedID = buffReader.getVarInt();
  if (state >= PACKED_DECODER.length) throw new Error("Invalid State");

  const payload = PACKED_DECODER[state](buffReader, packedID);

  return {
    state,
    packedID,
    ...payload,
  } as Packet<T>;
}
