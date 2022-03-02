import type { BasePayload, Identifier } from "../base.ts";
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

export interface TeleportConfirm extends BasePayload {
  teleportID: number;
}

export interface QueryBlockBNT extends BasePayload {
  transactionID: number;
  location: Position;
}

export interface SetDifficulty extends BasePayload {
  newDifficulty: Difficulty;
}

export interface ChatMessage extends BasePayload {
  message: string;
}

export interface ClientStatus extends BasePayload {
  actionID: ClientStatusAction;
}

export interface ClientSettings extends BasePayload {
  locale: string;
  viewDistance: number;
  chatMode: ChatMode;
  chatColors: boolean;
  displayedSkinParts: DisplayedSkinParts;
  mainHand: MainHand;
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
  slots: ItemSlot[];
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
  hand: Hand;
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

/** Y is at Feet level */
export type PlayerPosition = Position & PlayerMovement;

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
  flags: AbilitiesFlags;
}

export interface PlayerDigging extends BasePayload {
  status: DiggingStatus;
  location: Position;
  face: BlockFace;
}

export interface EntityAction extends BasePayload {
  entityID: number;
  actionID: PlayerAction;
  jumpBoost: number;
}

export interface SteerVehicle extends BasePayload {
  sideways: number;
  forward: number;
  flags: SteerVehicleFlags;
}

/**
 * Compatibility reasons
 */
export interface Pong extends BasePayload {
  ID: number;
}

export interface SetRecipeBookState extends BasePayload {
  bookID: BookID;
  bookOpen: boolean;
  filterActive: boolean;
}

export interface NameItem extends BasePayload {
  itemName: string;
}

export interface ResourcePackStatus extends BasePayload {
  result: ResourcePackStatusResult;
}

interface AdvancementTabClose {
  action: 1;
}
interface AdvancementTabOpen {
  action: 0;
  tabID: Identifier;
}

export type AdvancementTab =
  & (AdvancementTabClose | AdvancementTabOpen)
  & BasePayload;

export interface SelectTrade extends BasePayload {
  selectedSlot: number;
}

export interface SetBeaconEffect extends BasePayload {
  primaryEffect: number;
  secondaryEffect: number;
}

export interface HeldItemChange extends BasePayload {
  slot: number;
}

export interface UpdateCommandBlock extends BasePayload {
  location: Position;
  command: string;
  mode: CommandblockExecuteMode;
}

export interface UpdateCommandBlockMinecart extends BasePayload {
  entityID: number;
  command: string;
  trackOutput: boolean;
}

export interface CreativeInventoryAction extends BasePayload {
  slot: number;
  clickedItem: Slot;
}

export interface UpdateJigsawBlock extends BasePayload {
  location: Position;
  name: Identifier;
  target: Identifier;
  pool: Identifier;
  finalState: string;
  jointType: string;
}

export interface UpdateStructureBlock extends BasePayload {
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

export interface UpdateSign extends BasePayload {
  location: Position;
  lines: [string, string, string, string];
}

export interface Animaton extends BasePayload {
  hand: Hand;
}

export interface Spectate extends BasePayload {
  targetPlayer: string;
}

export interface PlayerBlockPlacement extends BasePayload {
  hand: Hand;
  location: Position;
  face: BlockFace;
  cursorPositionX: number;
  cursorPositionY: number;
  cursorPositionZ: number;
  insideBlock: boolean;
}

export interface UseItem extends BasePayload {
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
