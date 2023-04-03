export interface StatusResponse {
  JsonResponse: string;
}

export interface PingResponse {
  payload: bigint;
}

export type StatusPayloads = StatusResponse | PingResponse;
