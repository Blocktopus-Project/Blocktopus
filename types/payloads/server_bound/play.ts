import type { Identifier } from "../base.ts";
import type { Position } from "../position.ts";
import type {
  AbilitiesFlags,
  DisplayedSkinParts,
  SteerVehicleFlags,
  StructureBlockFlags,
} from "../bit_field.ts";
import type {
  BlockFace,
  BookID,
  ChatMode,
  ClientStatusAction,
  CommandblockExecuteMode,
  Difficulty,
  DiggingStatus,
  Hand,
  InteractKind,
  MainHand,
  PlayerAction,
  ResourcePackStatusResult,
  StructureBlockAction,
  StructureBlockMirror,
  StructureBlockMode,
  StructureBlockRotation,
} from "../enums.ts";

import type { Enumerate } from "../../range.ts";
import type { OffsetRange } from "../structureblock.ts";

interface Slot {
  present: true;
  itemID: number;
  itemCount: number;
  NBT?: string;
}

type ItemSlot = { present: false } | Slot;

export interface TeleportConfirm {
  teleportID: number;
}

export interface QueryBlockBNT {
  transactionID: number;
  location: Position;
}

export interface SetDifficulty {
  newDifficulty: Difficulty;
}

export interface ChatMessage {
  message: string;
}

export interface ClientStatus {
  actionID: ClientStatusAction;
}

export interface ClientSettings {
  locale: string;
  viewDistance: number;
  chatMode: ChatMode;
  chatColors: boolean;
  displayedSkinParts: DisplayedSkinParts;
  mainHand: MainHand;
  enableTextFiltering: boolean;
  allowServerListings: boolean;
}

export interface TabComplete {
  transactionID: number;
  text: string;
}

export interface ClickWindowButton {
  windowID: number;
  buttonID: number;
}

export interface ClickWindow {
  windowID: number;
  stateID: number;
  slot: number;
  button: number;
  mode: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  slots: ItemSlot[];
  clickedItem: ItemSlot;
}

export interface CloseWindow {
  windowID: number;
}

export interface PluginMessage {
  channel: string;
  data: Uint8Array;
}

export interface EditBook {
  hand: Hand;
  count: number;
  entries: string[];
  hasTitle: boolean;
  titel?: string;
}

export interface QueryEntityNBT {
  transactionID: number;
  entitiyID: number;
}

interface InteractEntityBase {
  entityID: number;
  interactionType: InteractKind;
  sneaking: boolean;
}

interface InteractEntityAt extends InteractEntityBase {
  interactionType: InteractKind.InteractAt;
  targetX: number;
  targetY: number;
  targetZ: number;
  hand: Hand;
}

export type InteractEntity = InteractEntityBase | InteractEntityAt;

export interface GenerateStructure {
  location: Position;
  levels: number;
  keepJigsaws: boolean;
}

export interface KeepAlive {
  keepAliveID: number;
}

/**
 * Appears to only be used on singleplayer
 */
export interface LockDifficulty {
  locked: boolean;
}

export interface PlayerMovement {
  onGround: boolean;
}

/** Y is at Feet level */
export type PlayerPosition = Position & PlayerMovement;

export interface PlayerRotation extends PlayerMovement {
  yaw: number;
  pitch: number;
}

export type PlayerPositionAndRotation = PlayerPosition & PlayerRotation;

export type VehicleMove = Omit<PlayerPositionAndRotation, "onGround">;

export interface SteerBoat {
  leftPaddle: boolean;
  rightPaddle: boolean;
}

export interface PickItem {
  slotToUse: number;
}

export interface CraftRecipeRequest {
  windowID: number;
  recipe: Identifier;
  makeAll: boolean;
}

export interface PlayerAbilities {
  flags: AbilitiesFlags;
}

export interface PlayerDigging {
  status: DiggingStatus;
  location: Position;
  face: BlockFace;
}

export interface EntityAction {
  entityID: number;
  actionID: PlayerAction;
  jumpBoost: number;
}

export interface SteerVehicle {
  sideways: number;
  forward: number;
  flags: SteerVehicleFlags;
}

/**
 * Compatibility reasons
 */
export interface Pong {
  ID: number;
}

export interface SetRecipeBookState {
  bookID: BookID;
  bookOpen: boolean;
  filterActive: boolean;
}

export interface NameItem {
  itemName: string;
}

export interface ResourcePackStatus {
  result: ResourcePackStatusResult;
}

interface AdvancementTabClose {
  action: 1;
}
interface AdvancementTabOpen {
  action: 0;
  tabID: Identifier;
}

export type AdvancementTab = AdvancementTabClose | AdvancementTabOpen;

export interface SelectTrade {
  selectedSlot: number;
}

export interface SetBeaconEffect {
  primaryEffect: number;
  secondaryEffect: number;
}

export interface HeldItemChange {
  slot: number;
}

export interface UpdateCommandBlock {
  location: Position;
  command: string;
  mode: CommandblockExecuteMode;
}

export interface UpdateCommandBlockMinecart {
  entityID: number;
  command: string;
  trackOutput: boolean;
}

export interface CreativeInventoryAction {
  slot: number;
  clickedItem: Slot;
}

export interface UpdateJigsawBlock {
  location: Position;
  name: Identifier;
  target: Identifier;
  pool: Identifier;
  finalState: string;
  jointType: string;
}

export interface UpdateStructureBlock {
  location: Position;
  action: StructureBlockAction;
  mode: StructureBlockMode;
  offsetX: OffsetRange;
  offsetY: OffsetRange;
  offsetZ: OffsetRange;
  sizeX: Enumerate<33>;
  sizeY: Enumerate<33>;
  sizeZ: Enumerate<33>;
  mirror: StructureBlockMirror;
  rotation: StructureBlockRotation;
  metadata: string;
  integrity: number;
  seed: bigint;
  flag: StructureBlockFlags;
}

export interface UpdateSign {
  location: Position;
  lines: [string, string, string, string];
}

export interface Animaton {
  hand: Hand;
}

export interface Spectate {
  targetPlayer: string;
}

export interface PlayerBlockPlacement {
  hand: Hand;
  location: Position;
  face: BlockFace;
  cursorPositionX: number;
  cursorPositionY: number;
  cursorPositionZ: number;
  insideBlock: boolean;
}

export interface UseItem {
  hand: Hand;
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
  | PlayerAbilities
  | PlayerDigging
  | EntityAction
  | SteerVehicle
  | Pong
  | SetRecipeBookState
  | NameItem
  | ResourcePackStatus
  | AdvancementTab
  | SelectTrade
  | SetBeaconEffect
  | HeldItemChange
  | UpdateCommandBlock
  | UpdateCommandBlockMinecart
  | CreativeInventoryAction
  | UpdateJigsawBlock
  | UpdateStructureBlock
  | UpdateSign
  | Animaton
  | Spectate
  | PlayerBlockPlacement
  | UseItem;
