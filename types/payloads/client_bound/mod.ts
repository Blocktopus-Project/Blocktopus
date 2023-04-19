import type { LoginPayloads } from "./login.ts";
import type { PlayPayloads } from "./play.ts";
import type { StatusPayloads } from "./status.ts";
import type { Packet } from "../base.ts";

export type ClientBoundPayloads =
  | PlayPayloads
  | LoginPayloads
  | StatusPayloads;

export type ClientPacket = Packet<ClientBoundPayloads>;
export * from "./login.ts";
export * from "./play.ts";
export * from "./status.ts";
