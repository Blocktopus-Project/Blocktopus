import { Chat } from "../../chat.ts";
import { Difficulty, EntityAnimation } from "../enums.ts";
import { Position } from "../position.ts";

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
}

export interface CommandsPayload {
}

export interface CloseContainerPayload {
}

export interface SetContainerContentPayload {
}

export interface SetContainerPropertyPayload {
}

export interface SetContainerSlotPayload {
}

export interface SetCooldown {
}

export interface ChatSuggestions {
}

export interface PluginMessagePayload {
}

export interface DamageEventPayload {
}

export interface DeleteMessagePayload {
}

export interface DisconnectPayload {
}

export interface DisguisedChatMessagePayload {
}

export interface EntityEventPayload {
}

export interface ExplosionPayload {
}

export interface UnloadChunkPayload {
}

export interface GameEventPayload {
}

export interface OpenHorseScreenPayload {
}

export interface HurtAnimationPayload {
}

export interface InitializeWorldBorderPayload {
}

export interface KeepAlivePayload {
}

export interface ChunkDataAndUpdateLightPayload {
}

export interface WorldEventPayload {
}

export interface ParticlePayload {
}

export interface UpdateLightPayload {
}

export interface LoginPayload {
}

export interface MapDataPayload {
}

export interface MerchantOffersPayload {
}

export interface UpdateEntityPositionPayload {
}

export interface UpdateEntityPositionAndRotationPayload {
}

export interface UpdateEntityRotationPayload {
}

export interface MoveVehiclePayload {
}

export interface OpenBookPayload {
}

export interface OpenScreenPayload {
}

export interface OpenSignEditorPayload {
}

export interface PingPayload {
}

export interface PlaceGhostRecipePayload {
}

export interface PlayerAbilitiesPayload {
}

export interface PlayerChatMessagePayload {
}

export interface EndCombatPayload {
}

export interface EnterCombatPayload {
}

export interface CombatDeathPayload {
}

export interface PlayerInfoRemovePayload {
}

export interface PlayerInfoUpdatePayload {
}

export interface LookAtPayload {
}

export interface SynchronizePlayerPositionPayload {
}

export interface UpdateRecipeBookPayload {
}

export interface RemoveEntitiesPayload {
}

export interface RemoveEntityEffectPayload {
}

export interface ResourcePackPayload {
}

export interface RespawnPayload {
}

export interface SetHeadRotationPayload {
}

export interface UpdateSectionBlocksPayload {
}

export interface SelectAdvancementsTabPayload {
}

export interface ServerDataPayload {
}

export interface SetActionBarTextPayload {
}

export interface SetBorderCenterPayload {
}

export interface SetBorderLerpSizePayload {
}

export interface SetBorderSizePayload {
}

export interface SetBorderWarningDelayPayload {
}

export interface SetBorderWarningDistancePayload {
}

export interface SetCameraPayload {
}

export interface SetHeldItemPayload {
}

export interface SetCenterChunkPayload {
}

export interface SetRenderDistancePayload {
}

export interface SetDefaultSpawnPositionPayload {
}

export interface DisplayObjectivePayload {
}

export interface SetEntityMetadataPayload {
}

export interface LinkEntitiesPayload {
}

export interface SetEntityVelocityPayload {
}

export interface SetEquipmentPayload {
}

export interface SetExperiencePayload {
}

export interface SetHealthPayload {
}

export interface UpdateObjectivesPayload {
}

export interface SetPassengersPayload {
}

export interface UpdateTeamsPayload {
}

export interface UpdateScorePayload {
}

export interface SetSimulationDistancePayload {
}

export interface SetSubtitleTextPayload {
}

export interface UpdateTimePayload {
}

export interface SetTitleTextPayload {
}

export interface SetTitleAnimationTimesPayload {
}

export interface EntitySoundEffectPayload {
}

export interface SoundEffectPayload {
}

export interface StopSoundPayload {
}

export interface SystemChatMessagePayload {
}

export interface SetTabListHeaderAndFooterPayload {
}

export interface TagQueryResponsePayload {
}

export interface PickupItemPayload {
}

export interface TeleportEntityPayload {
}

export interface UpdateAdvancementsPayload {
}

export interface UpdateAttributesPayload {
}

export interface FeatureFlagsPayload {
}

export interface EntityEffectPayload {
}

export interface UpdateRecipesPayload {
}

export interface UpdateTagsPayload {
}

export type PlayPayloads = SpawnEntityPayload;
