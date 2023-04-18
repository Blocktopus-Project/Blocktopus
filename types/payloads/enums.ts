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

export enum ClickMode {
  Normal,
  Shift,
  Hotkey,
  Copy,
  Drop,
  Drag,
  Double,
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

export enum StructureBlockAction {
  UpdateData,
  SaveStruct,
  LoadStruct,
  DetectSize,
}

export enum StructureBlockMode {
  SAVE,
  LOAD,
  CORNER,
  DATA,
}

export enum StructureBlockMirror {
  None,
  LEFT_RIGHT,
  FRONT_BACK,
}

export enum StructureBlockRotation {
  NONE,
  CLOCKWISE_90,
  CLOCKWISE_180,
  COUNTERCLOCKWISE_90,
}

export enum EntityAnimation {
  SWING_MAIN_ARM,
  TAKE_DAMAGE,
  LEAVE_BED,
  SWING_OFFHAND,
  CRITICAL_EFFECT,
  MAGIC_CRITICAL_EFFECT,
}

export enum Gamemode {
  SURVIVAL,
  CREATIVE,
  ADVENTURE,
  SPECTATOR,
}
