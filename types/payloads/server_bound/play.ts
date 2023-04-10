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

export interface TeleportConfirmPayload {
  teleportID: number;
}

export interface QueryBlockBNTPayload {
  transactionID: number;
  location: Position;
}

export interface SetDifficultyPayload {
  newDifficulty: Difficulty;
}

export interface ChatMessagePayload {
  message: string;
}

export interface ClientStatusPayload {
  actionID: ClientStatusAction;
}

export interface ClientSettingsPayload {
  locale: string;
  viewDistance: number;
  chatMode: ChatMode;
  chatColors: boolean;
  displayedSkinParts: DisplayedSkinParts;
  mainHand: MainHand;
  enableTextFiltering: boolean;
  allowServerListings: boolean;
}

export interface TabCompletePayload {
  transactionID: number;
  text: string;
}

export interface ClickWindowButtonPayload {
  windowID: number;
  buttonID: number;
}

export interface ClickWindowPayload {
  windowID: number;
  stateID: number;
  slot: number;
  button: number;
  mode: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  slots: ItemSlot[];
  clickedItem: ItemSlot;
}

export interface CloseWindowPayload {
  windowID: number;
}

export interface PluginMessagePayload {
  channel: string;
  data: Uint8Array;
}

export interface EditBookPayload {
  hand: Hand;
  count: number;
  entries: string[];
  hasTitle: boolean;
  titel?: string;
}

export interface QueryEntityNBTPayload {
  transactionID: number;
  entitiyID: number;
}

interface InteractEntityBasePayload {
  entityID: number;
  interactionType: InteractKind;
  sneaking: boolean;
}

interface InteractEntityAtPayload extends InteractEntityBasePayload {
  interactionType: InteractKind.InteractAt;
  targetX: number;
  targetY: number;
  targetZ: number;
  hand: Hand;
}

export type InteractEntityPayload = InteractEntityBasePayload | InteractEntityAtPayload;

export interface GenerateStructurePayload {
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
export interface LockDifficultyPayload {
  locked: boolean;
}

export interface PlayerMovementPayload {
  onGround: boolean;
}

/** Y is at Feet level */
export type PlayerPositionPayload = Position & PlayerMovementPayload;

export interface PlayerRotationPayload extends PlayerMovementPayload {
  yaw: number;
  pitch: number;
}

export type PlayerPositionAndRotationPayload = PlayerPositionPayload & PlayerRotationPayload;

export type VehicleMovePayload = Omit<PlayerPositionAndRotationPayload, "onGround">;

export interface SteerBoatPayload {
  leftPaddle: boolean;
  rightPaddle: boolean;
}

export interface PickItemPayload {
  slotToUse: number;
}

export interface CraftRecipeRequestPayload {
  windowID: number;
  recipe: Identifier;
  makeAll: boolean;
}

export interface PlayerAbilitiesPayload {
  flags: AbilitiesFlags;
}

export interface PlayerDiggingPayload {
  status: DiggingStatus;
  location: Position;
  face: BlockFace;
}

export interface EntityActionPayload {
  entityID: number;
  actionID: PlayerAction;
  jumpBoost: number;
}

export interface SteerVehiclePayload {
  sideways: number;
  forward: number;
  flags: SteerVehicleFlags;
}

/**
 * Compatibility reasons
 */
export interface PongPayload {
  ID: number;
}

export interface SetRecipeBookStatePayload {
  bookID: BookID;
  bookOpen: boolean;
  filterActive: boolean;
}

export interface NameItemPayload {
  itemName: string;
}

export interface ResourcePackStatusPayload {
  result: ResourcePackStatusResult;
}

interface AdvancementTabClosePayload {
  action: 1;
}
interface AdvancementTabOpenPayload {
  action: 0;
  tabID: Identifier;
}

export type AdvancementTabPayload = AdvancementTabClosePayload | AdvancementTabOpenPayload;

export interface SelectTradePayload {
  selectedSlot: number;
}

export interface SetBeaconEffectPayload {
  primaryEffect: number;
  secondaryEffect: number;
}

export interface HeldItemChangePayload {
  slot: number;
}

export interface UpdateCommandBlockPayload {
  location: Position;
  command: string;
  mode: CommandblockExecuteMode;
}

export interface UpdateCommandBlockMinecartPayload {
  entityID: number;
  command: string;
  trackOutput: boolean;
}

export interface CreativeInventoryActionPayload {
  slot: number;
  clickedItem: Slot;
}

export interface UpdateJigsawBlockPayload {
  location: Position;
  name: Identifier;
  target: Identifier;
  pool: Identifier;
  finalState: string;
  jointType: string;
}

export interface UpdateStructureBlockPayload {
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

export interface UpdateSignPayload {
  location: Position;
  lines: [string, string, string, string];
}

export interface AnimatonPayload {
  hand: Hand;
}

export interface SpectatePayload {
  targetPlayer: string;
}

export interface PlayerBlockPlacementPayload {
  hand: Hand;
  location: Position;
  face: BlockFace;
  cursorPositionX: number;
  cursorPositionY: number;
  cursorPositionZ: number;
  insideBlock: boolean;
}

export interface UseItemPayload {
  hand: Hand;
}

export type PlayPayloads =
  | TeleportConfirmPayload
  | QueryBlockBNTPayload
  | SetDifficultyPayload
  | ChatMessagePayload
  | ClientStatusPayload
  | ClientSettingsPayload
  | TabCompletePayload
  | ClickWindowButtonPayload
  | ClickWindowPayload
  | CloseWindowPayload
  | PluginMessagePayload
  | EditBookPayload
  | QueryEntityNBTPayload
  | InteractEntityPayload
  | GenerateStructurePayload
  | LockDifficultyPayload
  | PlayerMovementPayload
  | PlayerPositionPayload
  | PlayerRotationPayload
  | PlayerPositionAndRotationPayload
  | VehicleMovePayload
  | SteerBoatPayload
  | PickItemPayload
  | CraftRecipeRequestPayload
  | PlayerAbilitiesPayload
  | PlayerDiggingPayload
  | EntityActionPayload
  | SteerVehiclePayload
  | PongPayload
  | SetRecipeBookStatePayload
  | NameItemPayload
  | ResourcePackStatusPayload
  | AdvancementTabPayload
  | SelectTradePayload
  | SetBeaconEffectPayload
  | HeldItemChangePayload
  | UpdateCommandBlockPayload
  | UpdateCommandBlockMinecartPayload
  | CreativeInventoryActionPayload
  | UpdateJigsawBlockPayload
  | UpdateStructureBlockPayload
  | UpdateSignPayload
  | AnimatonPayload
  | SpectatePayload
  | PlayerBlockPlacementPayload
  | UseItemPayload;
