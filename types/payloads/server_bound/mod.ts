import type { BasePayload } from "../base.ts";
import type { HandshakePayloads } from "./handshaking.ts";
import type { LoginPayloads } from "./login.ts";
import type { PlayPayloads } from "./play.ts";
import type { StatusPayloads } from "./status.ts";

export type ServerBoundPayloads =
  | HandshakePayloads
  | LoginPayloads
  | PlayPayloads
  | StatusPayloads;

export type ServerPacket = ServerBoundPayloads & BasePayload;
export * from "./handshaking.ts";
export * from "./login.ts";
export * from "./play.ts";
export * from "./status.ts";
