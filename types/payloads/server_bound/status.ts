import type { BasePayload } from "../base.ts";

export interface PingPayload extends BasePayload {
  payload: bigint;
}

export type RequestPayload = BasePayload;

export type StatusPayloads = PingPayload | RequestPayload;
