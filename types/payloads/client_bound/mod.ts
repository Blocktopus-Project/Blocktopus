import { HandShakePayloads } from "./handshaking.ts";
import { LoginPayloads } from "./login.ts";
import { PlayPayloads } from "./play.ts";
import { StatusPayloads } from "./status.ts";

export type ClientBoundPayloads =
  | HandShakePayloads
  | LoginPayloads
  | PlayPayloads
  | StatusPayloads;

export * from "./handshaking.ts";
export * from "./login.ts";
export * from "./play.ts";
export * from "./status.ts";
