import type { State } from "../base.ts";

export interface HandshakePayload {
  protocolVersion: number;
  serverAdress: string;
  serverPort: number;
  nextState: State.Status | State.Login;
}
