export enum States {
  Handshaking,
  Status,
  Login,
}

export interface BasePacket {
  state: States;
  packedID: number;
  size: number;
}
