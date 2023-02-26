import {
  type HandshakePayload,
  type Packet,
  type ServerBoundPayloads,
  State,
} from "../../types/mod.ts";
import { deserializeLoginPackets } from "./login.ts";
import { Reader } from "../../util/reader.ts";

function deserializeHandshakePackets(
  reader: Reader,
  _state: State,
): HandshakePayload {
  return {
    protocolVersion: reader.getVarInt(),
    serverAdress: reader.getString(),
    serverPort: reader.getUint16(),
    nextState: reader.getUint8(),
  };
}

type Decoder = (reader: Reader, state: State) => ServerBoundPayloads;

const PACKED_DECODER: Decoder[] = [
  deserializeHandshakePackets,
  /** Todo */
  () => {
    throw "todo!";
  },
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
  if (state == State.Status) {
    throw new Error("Internal Error! Please report immediately");
  }

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
