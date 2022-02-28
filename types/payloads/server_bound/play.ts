import type { BasePayload, Identifier } from "../base.ts";
import type { Position } from "../../position.ts";
import type { Abilities, DisplayedSkinParts } from "../../bit_field.ts";
import type { DiggingStatus } from "../enums.ts";
interface Slot {
  present: true;
  itemID: number;
  itemCount: number;
  NBT?: string;
}

type ItemSlot = { present: false } | Slot;

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

export interface ClickWindowButton extends BasePayload {
  windowID: number;
  buttonID: number;
}

export interface ClickWindow extends BasePayload {
  windowID: number;
  stateID: number;
  slot: number;
  button: number;
  mode: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  slots: Array<ItemSlot>;
  clickedItem: ItemSlot;
}

export interface CloseWindow extends BasePayload {
  windowID: number;
}

export interface PluginMessage extends BasePayload {
  channel: string;
  data: Uint8Array;
}

export interface EditBook extends BasePayload {
  hand: 0 | 1;
  count: number;
  entries: string[];
  hasTitle: boolean;
  titel?: string;
}

export interface QueryEntityNBT extends BasePayload {
  transactionID: number;
  entitiyID: number;
}

interface InteractEntityBase {
  entityID: number;
  interactionType: 0 | 1 | 2;
  sneaking: boolean;
}

interface InteractEntityAt extends InteractEntityBase {
  interactionType: 2;
  targetX: number;
  targetY: number;
  targetZ: number;
  hand: 0 | 1;
}

export type InteractEntity = InteractEntityBase | InteractEntityAt;

export interface GenerateStructure extends BasePayload {
  location: Position;
  levels: number;
  keepJigsaws: boolean;
}

export interface KeepAlive extends BasePayload {
  keepAliveID: number;
}

/**
 * Appears to only be used on singleplayer
 */
export interface LockDifficulty extends BasePayload {
  locked: boolean;
}

export interface PlayerMovement extends BasePayload {
  onGround: boolean;
}

/**
 * Y is at Feet level
 */
export interface PlayerPosition extends PlayerMovement {
  x: number;
  y: number;
  z: number;
}

export interface PlayerRotation extends PlayerMovement {
  yaw: number;
  pitch: number;
}

export type PlayerPositionAndRotation = PlayerPosition & PlayerRotation;

export type VehicleMove = Omit<PlayerPositionAndRotation, "onGround">;

export interface SteerBoat extends BasePayload {
  leftPaddle: boolean;
  rightPaddle: boolean;
}

export interface PickItem extends BasePayload {
  slotToUse: number;
}

export interface CraftRecipeRequest extends BasePayload {
  windowID: number;
  recipe: Identifier;
  makeAll: boolean;
}

export interface PlayerAbilities extends BasePayload {
  flags: Abilities;
}

export interface PlayerDigging {
  status: DiggingStatus;
  location: Position;
}

export type PlayPayloads =
  | TeleportConfirm
  | QueryBlockBNT
  | SetDifficulty
  | ChatMessage
  | ClientStatus
  | ClientSettings
  | TabComplete
  | ClickWindowButton
  | ClickWindow
  | CloseWindow
  | PluginMessage
  | EditBook
  | QueryEntityNBT
  | InteractEntity
  | GenerateStructure
  | LockDifficulty
  | PlayerMovement
  | PlayerPosition
  | PlayerRotation
  | PlayerPositionAndRotation
  | VehicleMove
  | SteerBoat
  | PickItem
  | CraftRecipeRequest
  | PlayerAbilities;
