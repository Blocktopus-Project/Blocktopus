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

export type Identifier<T extends string = "minecraft"> = `${T}:${string}`;

export interface BasePayload {
  state: State;
  packedID: number;
}
