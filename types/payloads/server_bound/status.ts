import { BasePayload } from "../base.ts";

export interface PingPayload extends BasePayload {
  payload: number;
}

export type StatusPayloads = PingPayload;
