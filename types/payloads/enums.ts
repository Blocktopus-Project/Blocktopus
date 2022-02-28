export enum Difficulty {
  Peaceful,
  Easy,
  Normal,
  Hard,
}

export enum ClientStatusAction {
  PerformRespawn,
  RequestStats,
}

export enum ChatMode {
  Enabled,
  CommandsOnly,
  Hidden,
}

export enum MainHand {
  Left,
  Right,
}

export enum Hand {
  MainHand,
  Offhand,
}

export enum DiggingStatus {
  StartedDigging,
  CancelledDigging,
  FinishedDigging,
  DropItemStack,
  DropItem,
  ShootArrowOrFinishEating,
  SwapItemInHands,
}

export enum BlockFace {
  Botton,
  Top,
  North,
  South,
  West,
  East,
}

export enum PlayerAction {
  StartSneaking,
  StopSneaking,
  LeaveBed,
  StartSprinting,
  StopSprinting,
  StartJumpWithHorse,
  StopJumpWithHorse,
  OpenHorseInventory,
  StartFlyingWithElytra,
}

export enum BookID {
  Crafting,
  Furnace,
  BlastFurnace,
  Smoker,
}

export enum ResourcePackStatusResult {
  Success,
  Declined,
  FailedDownload,
  Accepted,
}

export enum InteractKind {
  Interact,
  Attack,
  InteractAt,
}

export enum CommandblockExecuteMode {
  Sequence,
  Auto,
  Redstone,
}
