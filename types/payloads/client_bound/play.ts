import { Chat } from "../../chat.ts";
import { Identifier } from "../base.ts";
import { Difficulty, EntityAnimation, Gamemode, Hand } from "../enums.ts";
import { Position } from "../position.ts";
import { ItemSlot } from "../server_bound/play.ts";

export interface SpawnEntityPayload {
  entityID: number;
  entityUUID: bigint;
  type: number;
  x: number;
  y: number;
  z: number;
  pitch: number;
  yaw: number;
  headYaw: number;
  data: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
}

export interface SpawnExperienceOrbPayload {
  entityID: number;
  x: number;
  y: number;
  z: number;
  count: number;
}

/** This packet is sent by the server when a player comes into visible range, not when a player joins. */
export interface SpawnPlayerPayload {
  entityID: number;
  playerUUID: bigint;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

export interface EntityAnimationPayload {
  entityID: number;
  animation: EntityAnimation;
}

export interface AwardStatisticsPayload {
  statistic: {
    categoryID: number;
    statisticID: number;
    value: number;
  }[];
}

export interface AcknowledgeBlockChangePayload {
  sequenceID: number;
}

/** 0–9 are the displayable destroy stages and all other numbers means that there is no animation on this coordinate */
export interface SetBlockDestroyStagePayload {
  entityID: number;
  location: Position;
  destroyStage: number;
}

export interface BlockEntityDataPayload {
  location: Position;
  type: number;
  NBT: string;
}

export interface BlockActionPayload {
  location: Position;
  actionID: number;
  actionParameter: number;
  blockType: number;
}

export interface BlockUpdatePayload {
  location: Position;
  blockID: number;
}

export type BossBarPayload = {
  UUID: bigint;
  action: 0;
  title: Chat;
  health: number;
  color: number;
  division: number;
  flags: number;
} | {
  UUID: bigint;
  action: 1;
} | {
  UUID: bigint;
  action: 2;
  health: number;
} | {
  UUID: bigint;
  action: 3;
  title: Chat;
} | {
  UUID: bigint;
  action: 4;
  color: number;
  dividers: number;
} | {
  UUID: bigint;
  action: 5;
  flags: number;
};

export interface ChangeDifficultyPayload {
  difficulty: Difficulty;
  difficultyLocked: boolean;
}

export interface ChunkBiomesPayload {
  chunkBiomeData: {
    chunkX: number;
    chunkY: number;
    data: Uint8Array;
  }[];
}

export interface ClearTitlesPayload {
  reset: boolean;
}

export interface CommandSuggestionsResponsePayload {
  ID: number;
  start: number;
  length: number;
  matches: {
    match: string;
    tooltip?: Chat;
  };
}

interface Node {
  flags: number;
  children: number[];
  redirectNode?: number;
  name?: string;
  parserID?: number;
  properties?: Uint8Array; // TODO: fully type out nodes
  suggestionsType?: string;
}

export interface CommandsPayload {
  nodes: Node[];
  rootIndex: number;
}

export interface CloseContainerPayload {
  windowID: number;
}

export interface SetContainerContentPayload {
  windowID: number;
  stateID: number;
  slotData: ItemSlot[];
  carriedItem: ItemSlot;
}

export interface SetContainerPropertyPayload {
  windowID: number;
  property: number;
  value: number;
}

export interface SetContainerSlotPayload {
  windowID: number;
  stateID: number;
  slot: number;
  slotData: ItemSlot;
}

export interface SetCooldownPayload {
  itemID: number;
  cooldownTicks: number;
}

export interface ChatSuggestionsPayload {
  action: 0 | 1 | 2;
  entries: string[];
}

export interface PluginMessagePayload {
  channel: Identifier;
  data: Uint8Array;
}

export interface DamageEventPayload {
  entityID: number;
  sourceTypeID: number;
  sourceCauseID: number;
  sourceDirectID: number;
  sourcePosition?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface DeleteMessagePayload {
  signature: Uint8Array;
}

export interface DisconnectPayload {
  reason: Chat;
}

export interface DisguisedChatMessagePayload {
  message: Chat;
  chatType: number;
  chatTypeName: string;
  targetName?: Chat;
}

export interface EntityEventPayload {
  entityID: number;
  entityStatus: number;
}

export interface ExplosionPayload {
  x: number;
  y: number;
  z: number;
  strength: number;
  records: [number, number, number][];
  playerMotionX: number;
  playerMotionY: number;
  playerMotionZ: number;
}

export interface UnloadChunkPayload {
  chunkX: number;
  chunkZ: number;
}

export interface GameEventPayload {
  event: number;
  value: number;
}

export interface OpenHorseScreenPayload {
  windowID: number;
  slotCount: number;
  entityID: number;
}

export interface HurtAnimationPayload {
  entityID: number;
  yaw: number;
}

export interface InitializeWorldBorderPayload {
  x: number;
  z: number;
  oldDiameter: number;
  newDiameter: number;
  speed: number;
  portalTeleportBoundary: number;
  warningBlocks: number;
  warningTime: number;
}

export interface KeepAlivePayload {
  keepAliveID: number;
}

export type ChunkDataAndUpdateLightPayload = UpdateLightPayload & {
  heightmaps: string; // NBT
  data: Uint8Array;
  blockEntities: {
    x: number;
    y: number;
    z: number;
    type: number;
    data: string; // NBT
  }[];
};

export interface WorldEventPayload {
  event: number;
  location: Position;
  data: number;
  disableRelativeVolume: boolean;
}

export interface ParticlePayload {
  particleID: number;
  longDistance: boolean;
  x: number;
  y: number;
  z: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  maxSpeed: number;
  data: Uint8Array; // TODO: fully type out particles
}

export interface UpdateLightPayload {
  chunkX: number;
  chunkZ: number;
  trustEdges: boolean;
  skyLightMask: Uint8Array;
  blockLightMask: Uint8Array;
  emptySkyLightMask: Uint8Array;
  emptyBlockLightMask: Uint8Array;
  skyLightArrays: Uint8Array[];
  blockLightArrays: Uint8Array[];
}

export interface LoginPayload {
  entityID: number;
  isHardcore: boolean;
  gamemode: Gamemode;
  previousGamemode: Gamemode & -1;
  dimensionNames: Identifier[];
  registryCodec: string; // NBT
  dimensionType: Identifier;
  dimensionName: Identifier;
  hashedSeed: bigint;
  maxPlayers: number;
  viewDistance: number;
  simulationDistance: number;
  reducedDebugInfo: boolean;
  enableRespawnScreen: boolean;
  isDebug: boolean;
  isFlat: boolean;
  death?: {
    dimensionName: Identifier;
    location: Position;
  };
}

interface EmptyMap {
  columns: 0;
}

interface FullMap {
  columns: Omit<number, 0>;
  rows: number;
  x: number;
  z: number;
  data: Uint8Array;
}

export type MapDataPayload = {
  mapID: number;
  scale: number;
  locked: boolean;
  icons?: {
    type: number;
    x: number;
    y: number;
    direction: number;
    displayName: Chat;
  }[];
} & (EmptyMap | FullMap);

export interface MerchantOffersPayload {
  windowID: number;
  trades: {
    inputItemOne: ItemSlot;
    outputItem: ItemSlot;
    inputItemTwo: ItemSlot;
    tradeDisabled: boolean;
    numberOfTradeUses: number;
    maximumNumberOfTradeUses: number;
    xp: number;
    specialPrice: number;
    priceMultiplier: number;
    demand: number;
  }[];
  villagerLevel: number;
  experience: number;
  isRegularVillager: boolean;
  canRestock: boolean;
}

export interface UpdateEntityPositionPayload {
  entityID: number;
  deltaX: number;
  deltaY: number;
  deltaZ: number;
  onGround: boolean;
}

export type UpdateEntityPositionAndRotationPayload =
  & UpdateEntityPositionPayload
  & UpdateEntityRotationPayload;

export interface UpdateEntityRotationPayload {
  entityID: number;
  yaw: number;
  pitch: number;
  onGround: boolean;
}

export interface MoveVehiclePayload {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
}

export interface OpenBookPayload {
  hand: Hand;
}

export interface OpenScreenPayload {
  windowID: number;
  windowType: number;
  windowTitle: Chat;
}

export interface OpenSignEditorPayload {
  location: Position;
}

export interface PingPayload {
  ID: number;
}

export interface PlaceGhostRecipePayload {
  windowID: number;
  recipe: Identifier;
}

export interface PlayerAbilitiesPayload {
  flags: number;
  flyingSpeed: number;
  fieldOfViewModifier: number;
}

export interface PlayerChatMessagePayload {
  sender: bigint;
  index: number;
  messageSignatureBytes?: Uint8Array;
  message: string;
  timestamp: bigint;
  salt: bigint;
  previousMessages: {
    messageID: number;
    signature?: Uint8Array;
  }[];
  unsignedContentPresent: boolean;
  unsignedContent: boolean;
  filterType: number;
  filterTypeBits?: Uint8Array;
  chatType: number;
  networkName: Chat;
  networkTargetName?: Chat;
}

export interface EndCombatPayload {
  duration: number;
  entityID: number;
}

export interface CombatDeathPayload {
  playerID: number;
  entityID: number;
  message: Chat;
}

export interface PlayerInfoRemovePayload {
  players: bigint[];
}

export interface PlayerInfoUpdatePayload {
  actions: number;
  action: {
    UUID: bigint;
    name?: string;
    properties?: {
      name: string;
      value: string;
      signature?: string;
    };
    initializeChat?: {
      chatSessionUUID: bigint;
      publicKeyExpiryTime: bigint;
      encodedPublicKey: Uint8Array;
      publicKeySignature: Uint8Array;
    };
    gamemode?: Gamemode;
    listed?: boolean;
    ping?: number;
    displayName?: Chat;
  }[];
}

export interface LookAtPayload {
  from: 0 | 1; // feet | eyes
  targetX: number;
  targetY: number;
  targetZ: number;
  entity?: {
    ID: number;
    from: 0 | 1; // feet | eyes
  };
}

export interface SynchronizePlayerPositionPayload {
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  flags: number;
  teleportID: number;
}

interface UpdateRecipeBookBase {
  craftingRecipeBookOpen: boolean;
  craftingRecipeBookFilterActive: boolean;
  smeltingRecipeBookOpen: boolean;
  smeltingRecipeBookFilterActive: boolean;
  blastFurnaceRecipeBookOpen: boolean;
  blastFurnaceRecipeBookFilterActive: boolean;
  smokerRecipeBookOpen: boolean;
  smokerRecipeBookFilterActive: boolean;
  mainRecipeIDs: Identifier[];
}

export type UpdateRecipeBookPayload =
  & ({
    action: 0; // init
    secondaryRecipeIDs: Identifier[];
  } | {
    action: 1 | 2; // add | remove
  })
  & UpdateRecipeBookBase;

export interface RemoveEntitiesPayload {
  entityIDs: number[];
}

export interface RemoveEntityEffectPayload {
  entityID: number;
  effectID: number;
}

export interface ResourcePackPayload {
  url: string;
  hash: string;
  forced: boolean;
  promptMessage?: Chat;
}

export interface RespawnPayload {
  dimensionType: Identifier;
  dimensionName: Identifier;
  hashedSeed: bigint;
  gamemode: Gamemode;
  previousGamemode: Gamemode | -1;
  isDebug: boolean;
  isFlat: boolean;
  dataKept: number;
  death?: {
    dimensionName: Identifier;
    location: Position;
  };
}

export interface SetHeadRotationPayload {
  entityID: number;
  headYaw: number;
}

export interface UpdateSectionBlocksPayload {
  chunkSectionPosition: bigint;
  supressLightUpdates: boolean;
  blocks: bigint[];
}

export interface SelectAdvancementsTabPayload {
  identifier?: Identifier;
}

export interface ServerDataPayload {
  MOTD: Chat;
  icon?: string;
  enforcesSecureChat?: boolean;
}

export interface SetActionBarTextPayload {
  actionBarText: Chat;
}

export interface SetBorderCenterPayload {
  x: number;
  z: number;
}

export interface SetBorderLerpSizePayload {
  oldDiameter: number;
  newDiameter: number;
  speed: bigint;
}

export interface SetBorderSizePayload {
  diameter: number;
}

export interface SetBorderWarningDelayPayload {
  warningTime: number;
}

export interface SetBorderWarningDistancePayload {
  warningBlocks: number;
}

export interface SetCameraPayload {
  cameraID: number;
}

export interface SetHeldItemPayload {
  slot: number;
}

export interface SetCenterChunkPayload {
  chunkX: number;
  chunkZ: number;
}

export interface SetRenderDistancePayload {
  viewDistance: number;
}

export interface SetDefaultSpawnPositionPayload {
  location: Position;
  angle: number;
}

export interface DisplayObjectivePayload {
  position: number;
  scoreName: string;
}

export interface SetEntityMetadataPayload {
  entityID: number;
  metadata: Uint8Array;
}

export interface LinkEntitiesPayload {
  attachedEntityID: number;
  holdingEntityID: number;
}

export interface SetEntityVelocityPayload {
  entityID: number;
  velocityX: number;
  velocityY: number;
  velocityZ: number;
}

export interface SetEquipmentPayload {
  entityID: number;
  equipment: {
    slot: number;
    item: ItemSlot;
  }[];
}

export interface SetExperiencePayload {
  experienceBar: number;
  totalExperience: number;
  level: number;
}

export interface SetHealthPayload {
  health: number;
  food: number;
  foodSaturation: number;
}

export type UpdateObjectivesPayload = {
  objectiveName: string;
  mode: 1; // remove scoreboard
} | {
  objectiveName: string;
  mode: 0 | 1; // create | update scoreboard
  objectiveValue: Chat;
  type: 0 | 1; // integer | hearts
};

export interface SetPassengersPayload {
  entityID: number;
  passengers: number[];
}

export type UpdateTeamsPayload =
  & {
    teamName: string;
  }
  & (
    {
      mode: 0;
      teamDisplayName: Chat;
      friendlyFlags: number;
      nameTagVisibility: "always" | "hideForOtherTeams" | "hideForOwnTeam" | "never";
      collisionRule: "always" | "pushOtherTeams" | "pushOwnTeam" | "never";
      teamColor: number;
      teamPrefix: Chat;
      teamSuffix: Chat;
      entities: number[];
    } | {
      mode: 1;
    } | {
      mode: 2;
      teamDisplayName: Chat;
      friendlyFlags: number;
      nameTagVisibility: "always" | "hideForOtherTeams" | "hideForOwnTeam" | "never";
      collisionRule: "always" | "pushOtherTeams" | "pushOwnTeam" | "never";
      teamColor: number;
      teamPrefix: Chat;
      teamSuffix: Chat;
    } | {
      mode: 3;
      entities: number[];
    } | {
      mode: 4;
      entities: number[];
    }
  );

export type UpdateScorePayload = {
  entityName: number;
  action: 0; // create/update
  objectiveName: string;
  value: number;
} | {
  entityName: number;
  action: 1; // remove item
  objectiveName: string;
};

export interface SetSimulationDistancePayload {
  simulationDistance: number;
}

export interface SetSubtitleTextPayload {
  subtitleText: Chat;
}

export interface UpdateTimePayload {
  worldAge: bigint;
  timeOfDay: bigint;
}

export interface SetTitleTextPayload {
  titleText: Chat;
}

export interface SetTitleAnimationTimesPayload {
  fadeIn: number;
  stay: number;
  fadeOut: number;
}

interface SoundEffectBase {
  soundCategory: number;
  volume: number;
  pitch: number;
  seed: bigint;
}

type SoundEffectRange = {
  soundID: 0;
  soundName: Identifier;
  range?: number;
} | {
  soundID: Omit<number, 0>;
};

export type EntitySoundEffectPayload = SoundEffectBase & SoundEffectRange & {
  entityID: number;
};

export type SoundEffectPayload = SoundEffectBase & SoundEffectRange & {
  effectPositionX: number;
  effectPositionY: number;
  effectPositionZ: number;
};

export interface StopSoundPayload {
  flags: number;
  source?: number;
  sound?: Identifier;
}

export interface SystemChatMessagePayload {
  content: Chat;
  overlay: boolean;
}

export interface SetTabListHeaderAndFooterPayload {
  header: Chat;
  footer: Chat;
}

export interface TagQueryResponsePayload {
  transactionID: number;
  NBT: string; // NBT
}

export interface PickupItemPayload {
  collectedEntityID: number;
  collectorEntityID: number;
  pickupItemCount: number;
}

export interface TeleportEntityPayload {
  entityID: number;
  x: number;
  y: number;
  z: number;
  yaw: number;
  pitch: number;
  onGround: boolean;
}

type Criteria = {
  identifier: Identifier;
  criterion: {
    dateOfAchieving?: bigint;
  };
};

export interface UpdateAdvancementsPayload {
  reset: boolean;
  advancementMapping: {
    key: Identifier;
    advancement: {
      parentID?: Identifier;
      displayData?: {
        title: Chat;
        description: Chat;
        icon: ItemSlot;
        frameType: 0 | 1 | 2; // task | challenge | goal
        flags: number;
        backgroundTexture?: Identifier;
        xCoord: number;
        yCoord: number;
      };
      criteria: Criteria[];
      requirements: {
        requirement: string[];
      }[];
    };
  }[];
  identifiers: Identifier[];
  prograssMapping: {
    key: Identifier;
    value: {
      identifier: Identifier;
      critieria: Criteria[];
    }[];
  }[];
}

export interface UpdateAttributesPayload {
  entityID: number;
  properties: {
    key: Identifier;
    value: number;
    modifiers: {
      UUID: bigint;
      amount: number;
      operation: 0 | 1 | 2;
    }[];
  }[];
}

export interface FeatureFlagsPayload {
  featureFlags: Identifier[];
}

export interface EntityEffectPayload {
  entityID: number;
  effectID: number;
  amplifier: number;
  duration: number;
  flags: number;
  factorCodec?: string; // NBT
}

export interface UpdateRecipesPayload {
  recipes: {
    type: string;
    recipeID: string;
    data: Uint8Array; // TODO: better typing for this
  }[];
}

export interface UpdateTagsPayload {
  tags: {
    type: string;
    tags: {
      name: string;
      entries: number[];
    };
  };
}

export type PlayPayloads =
  | SpawnEntityPayload
  | SpawnExperienceOrbPayload
  | SpawnPlayerPayload
  | EntityAnimationPayload
  | AwardStatisticsPayload
  | AcknowledgeBlockChangePayload
  | SetBlockDestroyStagePayload
  | BlockEntityDataPayload
  | BlockActionPayload
  | BlockUpdatePayload
  | BossBarPayload
  | ChangeDifficultyPayload
  | ChunkBiomesPayload
  | ClearTitlesPayload
  | CommandSuggestionsResponsePayload
  | CommandsPayload
  | CloseContainerPayload
  | SetContainerContentPayload
  | SetContainerPropertyPayload
  | SetContainerSlotPayload
  | SetCooldownPayload
  | ChatSuggestionsPayload
  | PluginMessagePayload
  | DamageEventPayload
  | DeleteMessagePayload
  | DisconnectPayload
  | DisguisedChatMessagePayload
  | EntityEventPayload
  | ExplosionPayload
  | UnloadChunkPayload
  | GameEventPayload
  | OpenHorseScreenPayload
  | HurtAnimationPayload
  | InitializeWorldBorderPayload
  | KeepAlivePayload
  | ChunkDataAndUpdateLightPayload
  | WorldEventPayload
  | ParticlePayload
  | UpdateLightPayload
  | LoginPayload
  | MapDataPayload
  | MerchantOffersPayload
  | UpdateEntityPositionPayload
  | UpdateEntityPositionAndRotationPayload
  | UpdateEntityRotationPayload
  | MoveVehiclePayload
  | OpenBookPayload
  | OpenScreenPayload
  | OpenSignEditorPayload
  | PingPayload
  | PlaceGhostRecipePayload
  | PlayerAbilitiesPayload
  | PlayerChatMessagePayload
  | EndCombatPayload
  | CombatDeathPayload
  | PlayerInfoRemovePayload
  | PlayerInfoUpdatePayload
  | LookAtPayload
  | SynchronizePlayerPositionPayload
  | UpdateRecipeBookPayload
  | RespawnPayload
  | SetHeadRotationPayload
  | UpdateSectionBlocksPayload
  | SelectAdvancementsTabPayload
  | ServerDataPayload
  | SetActionBarTextPayload
  | SetBorderCenterPayload
  | SetBorderLerpSizePayload
  | SetBorderSizePayload
  | SetBorderWarningDelayPayload
  | SetBorderWarningDistancePayload
  | SetCameraPayload
  | SetHeldItemPayload
  | SetCenterChunkPayload
  | SetRenderDistancePayload
  | SetDefaultSpawnPositionPayload
  | DisplayObjectivePayload
  | SetEntityMetadataPayload
  | LinkEntitiesPayload
  | SetEntityVelocityPayload
  | SetEquipmentPayload
  | SetExperiencePayload
  | SetHealthPayload
  | UpdateObjectivesPayload
  | SetPassengersPayload
  | UpdateTeamsPayload
  | UpdateScorePayload
  | SetSimulationDistancePayload
  | SetSubtitleTextPayload
  | UpdateTimePayload
  | SetTitleTextPayload
  | SetTitleAnimationTimesPayload
  | EntitySoundEffectPayload
  | SoundEffectPayload
  | StopSoundPayload
  | SystemChatMessagePayload
  | SetTabListHeaderAndFooterPayload
  | TagQueryResponsePayload
  | PickupItemPayload
  | TeleportEntityPayload
  | UpdateAdvancementsPayload
  | UpdateAttributesPayload
  | FeatureFlagsPayload
  | EntityEffectPayload
  | UpdateRecipesPayload
  | UpdateTagsPayload;
