import type { Identifier } from "../base.ts";
import type { Position } from "../position.ts";
import type {
  AbilitiesFlags,
  CommandblockFlags,
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

export type ItemSlot = { present: false } | Slot;

export interface ConfirmTeleportationPayload {
  teleportID: number;
}

export interface QueryBlockEntityTagPayload {
  transactionID: number;
  location: Position;
}

export interface ChangeDifficultyPayload {
  newDifficulty: Difficulty;
}

export interface MessageAcknowledgementPayload {
  messageCount: number;
}

export interface ChatCommandPayload {
  command: string;
  timestamp: bigint;
  salt: bigint;
  argumentSignatures: {
    argumentName: string;
    signature: Uint8Array;
  }[];
  messageCount: number;
  acknowledged: Uint8Array;
}

export interface ChatMessagePayload {
  message: string;
  timestamp: bigint;
  salt: bigint;
  signature?: Uint8Array;
  messageCount: number;
  acknowledged: Uint8Array;
}

export interface PlayerSessionPayload {
  sessionID: bigint;
  publicKey: {
    expiresAt: bigint;
    publicKey: Uint8Array;
    keySignature: Uint8Array;
  };
}

export interface ClientCommandPayload {
  actionID: ClientStatusAction;
}

export interface ClientInformationPayload {
  locale: string;
  viewDistance: number;
  chatMode: ChatMode;
  chatColors: boolean;
  displayedSkinParts: DisplayedSkinParts;
  mainHand: MainHand;
  enableTextFiltering: boolean;
  allowServerListings: boolean;
}

export interface CommandSuggestionsRequestPayload {
  transactionID: number;
  text: string;
}

export interface ClickContainerButtonPayload {
  windowID: number;
  buttonID: number;
}

export interface ClickContainerPayload {
  windowID: number;
  stateID: number;
  slot: number;
  button: number;
  mode: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  slots: ItemSlot[];
  clickedItem: ItemSlot;
}

export interface CloseContainerPayload {
  windowID: number;
}

export interface PluginMessagePayload {
  channel: string;
  data: Uint8Array;
}

export interface EditBookPayload {
  slot: number;
  entries: string[];
  title?: string;
}

export interface QueryEntityTagPayload {
  transactionID: number;
  entitiyID: number;
}

interface InteractEntityBasePayload {
  entityID: number;
  type: InteractKind;
  sneaking: boolean;
}

interface InteractEntityAtPayload extends InteractEntityBasePayload {
  interactionType: InteractKind.InteractAt;
  targetX: number;
  targetY: number;
  targetZ: number;
  hand: Hand;
}

export type InteractPayload = InteractEntityBasePayload | InteractEntityAtPayload;

export interface JigsawGeneratePayload {
  location: Position;
  levels: number;
  keepJigsaws: boolean;
}

export interface KeepAlivePayload {
  keepAliveID: bigint;
}

/**
 * Appears to only be used on singleplayer
 */
export interface LockDifficultyPayload {
  locked: boolean;
}

export interface SetPlayerOnGroundPayload {
  onGround: boolean;
}

/** Y is at Feet level */
export type SetPlayerPositionPayload = Position & SetPlayerOnGroundPayload;

export interface SetPlayerRotationPayload extends SetPlayerOnGroundPayload {
  yaw: number;
  pitch: number;
}

export type SetPlayerPositionAndRotationPayload =
  & SetPlayerPositionPayload
  & SetPlayerRotationPayload;

export type VehicleMovePayload = Omit<SetPlayerPositionAndRotationPayload, "onGround">;

export interface MoveVehiclePayload {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

export interface PaddleBoatPayload {
  leftPaddle: boolean;
  rightPaddle: boolean;
}

export interface PickItemPayload {
  slotToUse: number;
}

export interface PlaceRecipePayload {
  windowID: number;
  recipe: Identifier;
  makeAll: boolean;
}

export interface PlayerAbilitiesPayload {
  flags: AbilitiesFlags;
}

export interface PlayerActionPayload {
  status: DiggingStatus;
  location: Position;
  face: BlockFace;
  sequence: number;
}

export interface PlayerCommandPayload {
  entityID: number;
  actionID: PlayerAction;
  jumpBoost: number;
}

export interface PlayerInputPayload {
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

export interface ChangeRecipeBookSettingsPayload {
  bookID: BookID;
  bookOpen: boolean;
  filterActive: boolean;
}

export interface SetSeenRecipePaylod {
  recipeID: Identifier;
}

export interface RenameItemPayload {
  itemName: string;
}

export interface ResourcePackPayload {
  result: ResourcePackStatusResult;
}

interface AdvancementTabClosePayload {
  action: 1;
}
interface AdvancementTabOpenPayload {
  action: 0;
  tabID: Identifier;
}

export type SeenAdvancementsPayload = AdvancementTabClosePayload | AdvancementTabOpenPayload;

export interface SelectTradePayload {
  selectedSlot: number;
}

export interface SetBeaconEffectPayload {
  primaryEffect?: number;
  secondaryEffect?: number;
}

export interface SetHeldItemPayload {
  slot: number;
}

export interface ProgramCommandBlockPayload {
  location: Position;
  command: string;
  mode: CommandblockExecuteMode;
  flags: CommandblockFlags;
}

export interface ProgramCommandBlockMinecartPayload {
  entityID: number;
  command: string;
  trackOutput: boolean;
}

export interface SetCreativeModeSlotPayload {
  slot: number;
  clickedItem: ItemSlot;
}

export interface ProgramJigsawBlockPayload {
  location: Position;
  name: Identifier;
  target: Identifier;
  pool: Identifier;
  finalState: string;
  jointType: string;
}

export interface ProgramStructureBlockPayload {
  location: Position;
  action: StructureBlockAction;
  mode: StructureBlockMode;
  name: string;
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
  flags: StructureBlockFlags;
}

export interface UpdateSignPayload {
  location: Position;
  lines: [string, string, string, string];
}

export interface SwingArmPayload {
  hand: Hand;
}

export interface TeleportToEntityPayload {
  targetPlayer: bigint;
}

export interface UseItemOnPayload {
  hand: Hand;
  location: Position;
  face: BlockFace;
  cursorPositionX: number;
  cursorPositionY: number;
  cursorPositionZ: number;
  insideBlock: boolean;
  sequence: number;
}

export interface UseItemPayload {
  hand: Hand;
  sequence: number;
}

export type PlayPayloads =
  | ConfirmTeleportationPayload
  | QueryBlockEntityTagPayload
  | ChangeDifficultyPayload
  | MessageAcknowledgementPayload
  | ChatCommandPayload
  | ChatMessagePayload
  | PlayerSessionPayload
  | ClientCommandPayload
  | ClientInformationPayload
  | CommandSuggestionsRequestPayload
  | ClickContainerButtonPayload
  | ClickContainerPayload
  | CloseContainerPayload
  | PluginMessagePayload
  | EditBookPayload
  | QueryEntityTagPayload
  | InteractPayload
  | JigsawGeneratePayload
  | KeepAlivePayload
  | LockDifficultyPayload
  | SetPlayerOnGroundPayload
  | SetPlayerPositionPayload
  | SetPlayerRotationPayload
  | SetPlayerPositionAndRotationPayload
  | VehicleMovePayload
  | MoveVehiclePayload
  | PaddleBoatPayload
  | PickItemPayload
  | PlaceRecipePayload
  | PlayerAbilitiesPayload
  | PlayerActionPayload
  | PlayerCommandPayload
  | PlayerInputPayload
  | PongPayload
  | ChangeRecipeBookSettingsPayload
  | SetSeenRecipePaylod
  | RenameItemPayload
  | ResourcePackPayload
  | SeenAdvancementsPayload
  | SelectTradePayload
  | SetBeaconEffectPayload
  | SetHeldItemPayload
  | ProgramCommandBlockPayload
  | ProgramCommandBlockMinecartPayload
  | SetCreativeModeSlotPayload
  | ProgramJigsawBlockPayload
  | ProgramStructureBlockPayload
  | UpdateSignPayload
  | SwingArmPayload
  | TeleportToEntityPayload
  | UseItemOnPayload
  | UseItemPayload;
