import type { Chat } from "@/types/chat.ts";
import { Identifier } from "../base.ts";

export interface DisconnectLoginPayload {
  reason: Chat;
}

export interface EncryptionRequestPayload {
  serverID: string;
  publicKeyLength: number;
  publicKey: Uint8Array;
  verifyTokenLength: number;
  verifyToken: Uint8Array;
}

interface Property {
  name: string;
  value: string;
  isSigned: boolean;
  signature?: string;
}

/**
 * When send. Server should change the client to `State.Play`
 */
export interface LoginSuccessPayload {
  /** 128 bit bigint */
  UUID: bigint;
  username: string;
  properties: Property[];
}

export interface SetCompressionPayload {
  treshold: number;
}

export interface LoginPluginRequestPayload {
  messageID: number;
  channel: Identifier<string>;
  data: Uint8Array;
}

export type LoginPayloads =
  | DisconnectLoginPayload
  | EncryptionRequestPayload
  | LoginSuccessPayload
  | SetCompressionPayload
  | LoginPluginRequestPayload;
