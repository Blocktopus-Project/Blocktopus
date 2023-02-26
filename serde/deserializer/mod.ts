import { type HandshakePayloads, type Packet, State } from "../../types/mod.ts";
import { deserializeLoginPackets } from "./login.ts";
import { Reader } from "../../util/reader.ts";

function deserializeHandshakePackets(
  reader: Reader,
  _state: State,
): HandshakePayloads {
  const protocolVersion = reader.getVarInt();
  const serverAdress = reader.getString();
  const serverPort = reader.getUint16();
  const nextState = reader.getUint8();

  return {
    protocolVersion,
    serverAdress,
    serverPort,
    nextState,
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
  const decoder = PACKED_DECODER[state];
  if (!decoder) throw new Error("Invalid State");

  const payload = decoder(buffReader, packedID);

  return {
    state,
    packedID,
    ...payload,
  };
}
