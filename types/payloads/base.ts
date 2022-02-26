export enum State {
  HandShaking,
  Status,
  Login,
  Play,
  /**
   * Non-standard
   */
  Disconnected,
}

export interface BasePayload {
  state: State;
  packedID: number;
  size: number;
}
