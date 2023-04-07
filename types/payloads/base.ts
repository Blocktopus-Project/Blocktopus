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
  packetID: number;
}

export type Packet<T> = T & BasePayload;
