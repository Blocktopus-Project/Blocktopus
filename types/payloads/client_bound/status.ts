export interface StatusResponse {
  jsonResponse: string;
}

export interface PingResponse {
  payload: bigint;
}

export type StatusPayloads = StatusResponse | PingResponse;
