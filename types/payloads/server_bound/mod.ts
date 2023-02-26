import type { Packet } from "../base.ts";
import type { HandshakePayload } from "./handshaking.ts";
import type { LoginPayloads } from "./login.ts";
import type { PlayPayloads } from "./play.ts";
import type { StatusPayloads } from "./status.ts";

export type ServerBoundPayloads =
  | HandshakePayload
  | LoginPayloads
  | PlayPayloads
  | StatusPayloads;

export type ServerPacket = Packet<ServerBoundPayloads>;
export * from "./handshaking.ts";
export * from "./login.ts";
export * from "./play.ts";
export * from "./status.ts";
