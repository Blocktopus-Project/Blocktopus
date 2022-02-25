export enum States {
  Handshaking,
  Status,
  Login,
  Play,
}

export interface BasePacket {
  state: States;
  packedID: number;
  size: number;
}
