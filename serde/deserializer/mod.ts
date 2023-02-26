import { type HandshakePayloads, type Packet, State } from "../../types/mod.ts";
import { deserializeLoginPackets } from "./login.ts";
import { Reader } from "../../util/reader.ts";

function deserializeHandshakePackets(
  reader: Reader,
  _state: State,
): HandshakePayloads {
  return {
    protocolVersion: reader.getVarInt(),
    serverAdress: reader.getString(),
    serverPort: reader.getUint16(),
    nextState: reader.getUint8(),
  };
}

const PACKED_DECODER = [
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

export function deserialize(
  buffer: Uint8Array,
  state: State,
): Packet {
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
  };
}
