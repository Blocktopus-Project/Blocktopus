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

export type Identifier = `minecraft:${string}`;

export interface BasePayload {
  state: State;
  packedID: number;
}
