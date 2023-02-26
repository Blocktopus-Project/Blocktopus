export interface PingRequestPayload {
  payload: bigint;
}

export type StatusRequestPayload = Record<string, never>;

export type StatusPayloads = PingRequestPayload | StatusRequestPayload;
