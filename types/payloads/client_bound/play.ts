import { EntityAnimation } from "../enums.ts";

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

export type PlayPayloads = SpawnEntityPayload;
