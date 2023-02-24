import type { BasePayload } from "../base.ts";

export interface LoginStartPayload extends BasePayload {
  name: string;
  hasPlayerUUID: boolean;
  /** 128 bit bigint */
  playerUUID: bigint;
}

export interface EncryptionResponsePayload extends BasePayload {
  sharedSecretLength: number;
  /** Needs to be decrypted by server private key */
  sharedSecret: Uint8Array;
  verifyTokenLength: number;
  verifyToken: Uint8Array;
}

/** Only here for typings. Not needed for vanilla */
export interface LoginPluginResponse extends BasePayload {
  messageID: number;
  successful: boolean;
  data?: Uint8Array;
}

export type LoginPayloads =
  | LoginStartPayload
  | EncryptionResponsePayload
  | LoginPluginResponse;
