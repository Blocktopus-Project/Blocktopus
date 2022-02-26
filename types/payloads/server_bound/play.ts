import type { BasePayload } from "../base.ts";
import type { Position } from "../../position.ts";
import type { DisplayedSkinParts } from "../../bit_masks.ts";

export interface TeleportConfirm extends BasePayload {
  teleportID: number;
}

export interface QueryBlockBNT extends BasePayload {
  transactionID: number;
  location: Position;
}

export interface SetDifficulty extends BasePayload {
  newDifficulty: 0 | 1 | 2 | 3;
}

export interface ChatMessage extends BasePayload {
  message: string;
}

export interface ClientStatus extends BasePayload {
  actionID: 0 | 1;
}

export interface ClientSettings extends BasePayload {
  locale: string;
  viewDistance: number;
  chatMode: 0 | 1 | 2;
  chatColors: boolean;
  displayedSkinParts: DisplayedSkinParts;
  mainHand: 0 | 1;
  enableTextFiltering: boolean;
  allowServerListings: boolean;
}

export interface TabComplete extends BasePayload {
  transactionID: number;
  text: string;
}

export type PlayPayloads =
  | TeleportConfirm
  | QueryBlockBNT
  | SetDifficulty
  | ChatMessage
  | ClientStatus
  | ClientSettings
  | TabComplete;
