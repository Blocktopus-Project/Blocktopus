import type { BasePayload } from "../base.ts";

export interface PingRequestPayload extends BasePayload {
  payload: bigint;
}

export type StatusRequestPayload = BasePayload;

export type StatusPayloads = PingRequestPayload | StatusRequestPayload;
