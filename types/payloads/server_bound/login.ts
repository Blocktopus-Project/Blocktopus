import { BasePayload } from "../base.ts";

export interface LoginStartPayload extends BasePayload {
  name: string;
}

export interface EncryptionResponsePayload extends BasePayload {
  sharedSecretLength: number;
  sharedSecret: Uint8Array;
  verifyTokenLength: number;
  verifyToken: Uint8Array;
}

export interface LoginPluginResponse extends BasePayload {
  messageID: number;
  successful: boolean;
  data?: Uint8Array;
}

export type LoginPayloads = LoginStartPayload | EncryptionResponsePayload;
