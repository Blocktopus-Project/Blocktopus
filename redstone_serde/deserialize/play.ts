import { ServerError } from "@core/error.ts";

import type {
  ChangeDifficultyPayload,
  ChangeRecipeBookSettingsPayload,
  ChatCommandPayload,
  ChatMessagePayload,
  ClickContainerButtonPayload,
  ClickContainerPayload,
  ClientCommandPayload,
  ClientInformationPayload,
  CloseContainerPayload,
  CommandSuggestionsRequestPayload,
  ConfirmTeleportationPayload,
  EditBookPayload,
  InteractPayload,
  ItemSlot,
  JigsawGeneratePayload,
  KeepAlivePayload,
  LockDifficultyPayload,
  MessageAcknowledgementPayload,
  MoveVehiclePayload,
  PaddleBoatPayload,
  PickItemPayload,
  PlaceRecipePayload,
  PlayerAbilitiesPayload,
  PlayerActionPayload,
  PlayerCommandPayload,
  PlayerInputPayload,
  PlayerSessionPayload,
  PlayPayloads,
  PluginMessagePayload,
  PongPayload,
  ProgramCommandBlockMinecartPayload,
  ProgramCommandBlockPayload,
  ProgramJigsawBlockPayload,
  ProgramStructureBlockPayload,
  QueryBlockEntityTagPayload,
  QueryEntityTagPayload,
  RenameItemPayload,
  ResourcePackPayload,
  SeenAdvancementsPayload,
  SelectTradePayload,
  SetBeaconEffectPayload,
  SetCreativeModeSlotPayload,
  SetHeldItemPayload,
  SetPlayerOnGroundPayload,
  SetPlayerPositionAndRotationPayload,
  SetPlayerPositionPayload,
  SetPlayerRotationPayload,
  SetSeenRecipePaylod,
  SwingArmPayload,
  TeleportToEntityPayload,
  UpdateSignPayload,
  UseItemOnPayload,
  UseItemPayload,
} from "@payloads/server/mod.ts";
import type { Reader } from "@util/reader.ts";
import { InteractKind } from "@payloads/enums.ts";
import { deserializePosition, deserializeUUID } from "../util.ts";
import { Identifier } from "@payloads/base.ts";
import { OffsetRange } from "@payloads/structureblock.ts";
import { Enumerate } from "../../types/range.ts";

// Somewhat gross function to read a slot from reader
function readSlot(reader: Reader) {
  return (reader.getInt8()
    ? {
      present: true,
      itemID: reader.getVarInt(),
      itemCount: reader.getInt8(),
      NBT: reader.getString(),
    }
    : {
      present: false,
    }) satisfies ItemSlot;
}

const PACKET_DECODERS = [
  confirmTeleportation,
  queryBlockEntityTag,
  changeDifficulty,
  messageAcknowledgment,
  chatCommand,
  chatMessage,
  playerSession,
  clientCommand,
  clientInformation,
  commandSuggestionsRequest,
  clickContainerButton,
  clickContainer,
  closeContainer,
  pluginMessage,
  editBook,
  queryEntityTag,
  interact,
  jigsawGenerate,
  keepAlive,
  lockDifficulty,
  setPlayerPosition,
  setPlayerPositionandRotation,
  setPlayerRotation,
  setPlayerOnGround,
  moveVehicle,
  paddleBoat,
  pickItem,
  placeRecipe,
  playerAbilities,
  playerAction,
  playerCommand,
  playerInput,
  pong,
  changeRecipeBookSettings,
  setSeenRecipe,
  renameItem,
  resourcePack,
  seenAdvancements,
  selectTrade,
  setBeaconEffect,
  setHeldItem,
  programCommandBlock,
  programCommandBlockMinecart,
  setCreativeModeSlot,
  programJigsawBlock,
  programStructureBlock,
  updateSign,
  swingArm,
  teleportToEntity,
  useItemOn,
  useItem,
];

function confirmTeleportation(reader: Reader): ConfirmTeleportationPayload {
  return {
    teleportID: reader.getVarInt(),
  };
}

function queryBlockEntityTag(reader: Reader): QueryBlockEntityTagPayload {
  return {
    transactionID: reader.getVarInt(),
    location: deserializePosition(reader.getSlice(8)),
  };
}

function changeDifficulty(reader: Reader): ChangeDifficultyPayload {
  return {
    newDifficulty: reader.getInt8(),
  };
}

function messageAcknowledgment(reader: Reader): MessageAcknowledgementPayload {
  return {
    messageCount: reader.getVarInt(),
  };
}

function chatCommand(reader: Reader): ChatCommandPayload {
  return {
    command: reader.getString(),
    timestamp: reader.getBigInt64(),
    salt: reader.getBigInt64(),
    argumentSignatures: new Array(reader.getVarInt()).fill(undefined).map(() => ({
      argumentName: reader.getString(),
      signature: reader.getSlice(256),
    })),
    messageCount: reader.getVarInt(),
    acknowledged: reader.getSlice(3),
  };
}

function chatMessage(reader: Reader): ChatMessagePayload {
  return {
    message: reader.getString(),
    timestamp: reader.getBigInt64(),
    salt: reader.getBigInt64(),
    signature: reader.getInt8() ? reader.getSlice(256) : undefined,
    messageCount: reader.getVarInt(),
    acknowledged: reader.getSlice(3),
  };
}

function playerSession(reader: Reader): PlayerSessionPayload {
  return {
    sessionID: deserializeUUID(reader),
    publicKey: {
      expiresAt: reader.getBigInt64(),
      publicKey: reader.getSlice(reader.getVarInt()),
      keySignature: reader.getSlice(reader.getVarInt()),
    },
  };
}

function clientCommand(reader: Reader): ClientCommandPayload {
  return {
    actionID: reader.getVarInt(),
  };
}

function clientInformation(reader: Reader): ClientInformationPayload {
  const getDisplayedSkinParts = (skinFlagsByte: number) => ({
    cape: !!(skinFlagsByte & 0x01),
    jacket: !!(skinFlagsByte & 0x02),
    leftSleeve: !!(skinFlagsByte & 0x04),
    rightSleeve: !!(skinFlagsByte & 0x08),
    leftPantsLeg: !!(skinFlagsByte & 0x10),
    rightPantsLeg: !!(skinFlagsByte & 0x20),
    hat: !!(skinFlagsByte & 0x40),
  });

  return {
    locale: reader.getString(),
    viewDistance: reader.getInt8(),
    chatMode: reader.getVarInt(),
    chatColors: !!reader.getInt8(),
    displayedSkinParts: getDisplayedSkinParts(reader.getUint8()),
    mainHand: reader.getVarInt(),
    enableTextFiltering: !!reader.getInt8(),
    allowServerListings: !!reader.getInt8(),
  };
}

function commandSuggestionsRequest(reader: Reader): CommandSuggestionsRequestPayload {
  return {
    transactionID: reader.getVarInt(),
    text: reader.getString(),
  };
}

function clickContainerButton(reader: Reader): ClickContainerButtonPayload {
  return {
    windowID: reader.getInt8(),
    buttonID: reader.getInt8(),
  };
}

function clickContainer(reader: Reader): ClickContainerPayload {
  return {
    windowID: reader.getUint8(),
    stateID: reader.getVarInt(),
    slot: reader.getInt16(),
    button: reader.getInt8(),
    mode: reader.getVarInt() as 0 | 1 | 2 | 3 | 4 | 5 | 6,
    slots: new Array(reader.getVarInt()).fill(undefined).map(() => ({
      position: reader.getInt16(),
      slot: readSlot(reader),
    })).sort((a, b) => a.position - b.position).map(({ slot }) => slot),
    clickedItem: readSlot(reader),
  };
}

function closeContainer(reader: Reader): CloseContainerPayload {
  return {
    windowID: reader.getUint8(),
  };
}

// This is not trivial
function pluginMessage(_reader: Reader): PluginMessagePayload {
  throw new ServerError("Redstone Serde", "TODO: Implement Plugin Message");
}

function editBook(reader: Reader): EditBookPayload {
  return {
    slot: reader.getVarInt(),
    entries: new Array(reader.getVarInt()).fill(undefined).map(() => reader.getString()),
    title: reader.getInt8() ? reader.getString() : undefined,
  };
}

function queryEntityTag(reader: Reader): QueryEntityTagPayload {
  return {
    transactionID: reader.getVarInt(),
    entitiyID: reader.getVarInt(),
  };
}

function interact(reader: Reader): InteractPayload {
  const entityID = reader.getVarInt();
  const type = reader.getVarInt();

  return {
    entityID,
    type,
    ...(type === InteractKind.InteractAt
      ? {
        targetX: reader.getFloat32(),
        targetY: reader.getFloat32(),
        targetZ: reader.getFloat32(),
      }
      : {}),
    sneaking: !!reader.getInt8(),
  };
}

function jigsawGenerate(reader: Reader): JigsawGeneratePayload {
  return {
    location: deserializePosition(reader.getSlice(8)),
    levels: reader.getVarInt(),
    keepJigsaws: !!reader.getInt8(),
  };
}

function keepAlive(reader: Reader): KeepAlivePayload {
  return {
    keepAliveID: reader.getBigInt64(),
  };
}

function lockDifficulty(reader: Reader): LockDifficultyPayload {
  return {
    locked: !!reader.getInt8(),
  };
}

function setPlayerPosition(reader: Reader): SetPlayerPositionPayload {
  return {
    x: reader.getFloat64(),
    y: reader.getFloat64(),
    z: reader.getFloat64(),
    onGround: !!reader.getInt8(),
  };
}

function setPlayerPositionandRotation(reader: Reader): SetPlayerPositionAndRotationPayload {
  return {
    x: reader.getFloat64(),
    y: reader.getFloat64(),
    z: reader.getFloat64(),
    yaw: reader.getFloat32(),
    pitch: reader.getFloat32(),
    onGround: !!reader.getInt8(),
  };
}

function setPlayerRotation(reader: Reader): SetPlayerRotationPayload {
  return {
    yaw: reader.getFloat32(),
    pitch: reader.getFloat32(),
    onGround: !!reader.getInt8(),
  };
}

function setPlayerOnGround(reader: Reader): SetPlayerOnGroundPayload {
  return {
    onGround: !!reader.getInt8(),
  };
}

function moveVehicle(reader: Reader): MoveVehiclePayload {
  return {
    x: reader.getFloat64(),
    y: reader.getFloat64(),
    z: reader.getFloat64(),
    yaw: reader.getFloat32(),
    pitch: reader.getFloat32(),
  };
}

function paddleBoat(reader: Reader): PaddleBoatPayload {
  return {
    leftPaddle: !!reader.getInt8(),
    rightPaddle: !!reader.getInt8(),
  };
}

function pickItem(reader: Reader): PickItemPayload {
  return {
    slotToUse: reader.getVarInt(),
  };
}

function placeRecipe(reader: Reader): PlaceRecipePayload {
  return {
    windowID: reader.getInt8(),
    recipe: reader.getString() as Identifier,
    makeAll: !!reader.getInt8(),
  };
}

function playerAbilities(reader: Reader): PlayerAbilitiesPayload {
  const abilitiesFlags = reader.getInt8();

  return {
    flags: {
      invulnerable: !!(abilitiesFlags & 0x01),
      flying: !!(abilitiesFlags & 0x02),
      allowFlying: !!(abilitiesFlags & 0x04),
      creativeMode: !!(abilitiesFlags & 0x08),
    },
  };
}

function playerAction(reader: Reader): PlayerActionPayload {
  return {
    status: reader.getVarInt(),
    location: deserializePosition(reader.getSlice(8)),
    face: reader.getInt8(),
    sequence: reader.getVarInt(),
  };
}

function playerCommand(reader: Reader): PlayerCommandPayload {
  return {
    entityID: reader.getVarInt(),
    actionID: reader.getVarInt(),
    jumpBoost: reader.getVarInt(),
  };
}

function playerInput(reader: Reader): PlayerInputPayload {
  const getInputParts = (skinFlagsByte: number) => ({
    jump: !!(skinFlagsByte & 0x01),
    unmount: !!(skinFlagsByte & 0x02),
  });

  return {
    sideways: reader.getFloat32(),
    forward: reader.getFloat32(),
    flags: getInputParts(reader.getInt8()),
  };
}

function pong(reader: Reader): PongPayload {
  return {
    ID: reader.getInt32(),
  };
}

function changeRecipeBookSettings(reader: Reader): ChangeRecipeBookSettingsPayload {
  return {
    bookID: reader.getVarInt(),
    bookOpen: !!reader.getInt8(),
    filterActive: !!reader.getInt8(),
  };
}

function setSeenRecipe(reader: Reader): SetSeenRecipePaylod {
  return {
    recipeID: reader.getString() as Identifier,
  };
}

function renameItem(reader: Reader): RenameItemPayload {
  return {
    itemName: reader.getString(),
  };
}

function resourcePack(reader: Reader): ResourcePackPayload {
  return {
    result: reader.getVarInt(),
  };
}

function seenAdvancements(reader: Reader): SeenAdvancementsPayload {
  return reader.getVarInt()
    ? {
      action: 0,
      tabID: reader.getString() as Identifier,
    }
    : {
      action: 1,
    };
}

function selectTrade(reader: Reader): SelectTradePayload {
  return {
    selectedSlot: reader.getVarInt(),
  };
}

function setBeaconEffect(reader: Reader): SetBeaconEffectPayload {
  return {
    primaryEffect: reader.getInt8() ? reader.getVarInt() : undefined,
    secondaryEffect: reader.getInt8() ? reader.getVarInt() : undefined,
  };
}

function setHeldItem(reader: Reader): SetHeldItemPayload {
  return {
    slot: reader.getInt16(),
  };
}

function programCommandBlock(reader: Reader): ProgramCommandBlockPayload {
  const getCommandParts = (commandFlagsByte: number) => ({
    trackOutput: !!(commandFlagsByte & 0x01),
    isConditional: !!(commandFlagsByte & 0x02),
    automatic: !!(commandFlagsByte & 0x04),
  });

  return {
    location: deserializePosition(reader.getSlice(8)),
    command: reader.getString(),
    mode: reader.getVarInt(),
    flags: getCommandParts(reader.getInt8()),
  };
}

function programCommandBlockMinecart(reader: Reader): ProgramCommandBlockMinecartPayload {
  return {
    entityID: reader.getVarInt(),
    command: reader.getString(),
    trackOutput: !!reader.getInt8(),
  };
}

function setCreativeModeSlot(reader: Reader): SetCreativeModeSlotPayload {
  return {
    slot: reader.getInt16(),
    clickedItem: readSlot(reader),
  };
}

function programJigsawBlock(reader: Reader): ProgramJigsawBlockPayload {
  return {
    location: deserializePosition(reader.getSlice(8)),
    name: reader.getString() as Identifier,
    target: reader.getString() as Identifier,
    pool: reader.getString() as Identifier,
    finalState: reader.getString(),
    jointType: reader.getString(),
  };
}

function programStructureBlock(reader: Reader): ProgramStructureBlockPayload {
  const getProgramParts = (programFlagsByte: number) => ({
    ignoreEntities: !!(programFlagsByte & 0x01),
    showAir: !!(programFlagsByte & 0x02),
    showBoundingBox: !!(programFlagsByte & 0x04),
  });

  return {
    location: deserializePosition(reader.getSlice(8)),
    action: reader.getVarInt(),
    mode: reader.getVarInt(),
    name: reader.getString(),
    offsetX: reader.getInt8() as OffsetRange,
    offsetY: reader.getInt8() as OffsetRange,
    offsetZ: reader.getInt8() as OffsetRange,
    sizeX: reader.getInt8() as Enumerate<33>,
    sizeY: reader.getInt8() as Enumerate<33>,
    sizeZ: reader.getInt8() as Enumerate<33>,
    mirror: reader.getVarInt(),
    rotation: reader.getVarInt(),
    metadata: reader.getString(),
    integrity: reader.getFloat32(),
    seed: reader.getVarLong(),
    flags: getProgramParts(reader.getInt8()),
  };
}

function updateSign(reader: Reader): UpdateSignPayload {
  return {
    location: deserializePosition(reader.getSlice(8)),
    lines: [
      reader.getString(),
      reader.getString(),
      reader.getString(),
      reader.getString(),
    ],
  };
}

function swingArm(reader: Reader): SwingArmPayload {
  return {
    hand: reader.getVarInt(),
  };
}

function teleportToEntity(reader: Reader): TeleportToEntityPayload {
  return {
    targetPlayer: deserializeUUID(reader),
  };
}

function useItemOn(reader: Reader): UseItemOnPayload {
  return {
    hand: reader.getVarInt(),
    location: deserializePosition(reader.getSlice(8)),
    face: reader.getVarInt(),
    cursorPositionX: reader.getFloat32(),
    cursorPositionY: reader.getFloat32(),
    cursorPositionZ: reader.getFloat32(),
    insideBlock: !!reader.getInt8(),
    sequence: reader.getVarInt(),
  };
}

function useItem(reader: Reader): UseItemPayload {
  return {
    hand: reader.getVarInt(),
    sequence: reader.getVarInt(),
  };
}

export function deserializePlayPackets(
  buffer: Reader,
  packetID: number,
): PlayPayloads {
  if (packetID < 0 || packetID >= PACKET_DECODERS.length) {
    throw new ServerError("Redstone Serde", "Unknown Packet ID");
  }

  return PACKET_DECODERS[packetID](buffer);
}
