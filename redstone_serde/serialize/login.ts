import type { Packet } from "@/types/mod.ts";
import type {
  DisconnectLoginPayload,
  EncryptionRequestPayload,
  LoginPayloads,
  LoginSuccessPayload,
  SetCompressionPayload,
} from "@payloads/client/login.ts";
import type { Writer } from "@util/writer.ts";
import { ServerError } from "@core/error.ts";

type Encoder = (writer: Writer, packet: LoginPayloads) => void;

const PACKET_ENCODER: Encoder[] = [
  disconnectLogin as Encoder,
  encryptionRequest as Encoder,
  loginSuccess as Encoder,
  setCompression as Encoder,
];

function disconnectLogin(writer: Writer, packet: Packet<DisconnectLoginPayload>) {
  writer.setString(JSON.stringify(packet.reason));
}

function encryptionRequest(writer: Writer, packet: EncryptionRequestPayload) {
  writer.setString(packet.serverID);
  writer.setVarInt(packet.publicKeyLength);
  writer.setSlice(packet.publicKey);
  writer.setVarInt(packet.verifyTokenLength);
  writer.setSlice(packet.verifyToken);
}

function loginSuccess(writer: Writer, packet: LoginSuccessPayload) {
  writer.setBigUint64(packet.UUID >> 64n);
  writer.setBigUint64(packet.UUID & 0xFFFFFFFFFFFFFFFFn);
  writer.setString(packet.username);
  writer.setVarInt(packet.properties.length);

  for (let i = 0; i < packet.properties.length; i++) {
    writer.setString(packet.properties[i].name);
    writer.setString(packet.properties[i].value);
    writer.setUint8(packet.properties[i].isSigned ? 1 : 0);
    if (packet.properties[i].isSigned) {
      writer.setString(packet.properties[i].signature!);
    }
  }
}

function setCompression(writer: Writer, packet: SetCompressionPayload) {
  writer.setVarInt(packet.treshold);
}

export function serializeLoginPackets(writer: Writer, packet: Packet<LoginPayloads>): void {
  if (packet.packetID < 0 || packet.packetID > PACKET_ENCODER.length) {
    throw new ServerError("Redstone Serde", "Unknown Packet ID");
  }

  PACKET_ENCODER[packet.packetID](writer, packet);
}
