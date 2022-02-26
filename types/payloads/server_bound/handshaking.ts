import type { BasePayload, State } from "../base.ts";

/**
 * Only here for typings
 */
export interface HandshakePayload extends BasePayload {
  protocolVersion: number;
  serverAdress: string;
  serverPort: number;
  nextState: State.Status | State.Login;
}

export type HandshakePayloads = HandshakePayload;
