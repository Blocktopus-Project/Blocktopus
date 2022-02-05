import type { BasePacket } from "./base.ts";

export interface ResponsePacket extends BasePacket {
  length: number;
  // TODO: Needs to be a `Response` type
  response: string;
}
// Not needed. Just resend a Ping
// export type PongPacket extends BasePacket

export interface DisconnectPacket extends BasePacket {
  // should be type `Chat`
  reason: string;
}

export interface EncryptionRequestPacket extends BasePacket {
  serverID: string;
  publicKeyLength: number;
  publicKey: Uint8Array;
  verifyTokenLength: number;
  verifyToken: Uint8Array;
}

export interface LoginSuccessPacket extends BasePacket {
  UUID: string;
  username: string;
}

export interface SetCompression extends BasePacket {
  threshold: number;
}

export interface LoginPluginRequestPacket extends BasePacket {
  messageID: number;
  channel: string;
  data: Uint8Array;
}
