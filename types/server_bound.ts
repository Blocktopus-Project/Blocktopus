import type { BasePacket } from "./base.ts";

export interface HandshakePacket extends BasePacket {
  protocolVersion: number;
  serverAddress: string;
  serverPort: number;
  nextState: 1 | 2;
}

export interface LegacyServerListPingPacket {
  protocolVersion: number;
  serverAddress: string;
  serverPort: number;
}

export type RequestPacket = BasePacket;

// Ping just needs to be resend as pong
// export type PingPacket = BasePacket;

export interface LoginStart extends BasePacket {
  name: string;
}

export interface EncryptionResponsePacket extends BasePacket {
  sharedSecretLength: number;
  sharedSecret: Uint8Array;
  verifyTokenLength: number;
  verifyToken: Uint8Array;
}

export interface LoginPluginResponsePacket extends BasePacket {
  messageID: number;
  successful: boolean;
  data?: Uint8Array;
}
