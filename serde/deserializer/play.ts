// export function deserializePlayPackets(
//   buffer: Uint8Array,
//   packedID: number,
// ): PlayPayloads {
//   switch (packedID) {
//     case 0x00:
//       return {
//         state: State.Play,
//         packedID,
//         teleportID: readVarInt(buffer)[0],
//       };

//     case 0x01: {
//       const [id, readBytes] = readVarInt(buffer);
//       return {
//         state: State.Play,
//         packedID,
//         transactionID: id,
//         location: deserializePosition(buffer.subarray(readBytes))[0],
//       };
//     }

//     case 0x03:
//       return {
//         state: State.Play,
//         packedID,
//         message: deserializeString(buffer)[0],
//       };

//     case 0x04:
//       return {
//         state: State.Play,
//         packedID,
//         actionID: readVarInt(buffer)[0],
//       };

//     case 0x05: {
//       let bytesRead = 0;
//       const localeString = deserializeString(buffer);
//       bytesRead += localeString[1];

//       const viewDistance = buffer.subarray(bytesRead)[0];
//       bytesRead++;

//       const chatMode = readVarInt(buffer.subarray(bytesRead));
//       bytesRead += chatMode[1];

//       const [chatColor, skinFlagsByte] = buffer.subarray(bytesRead);
//       bytesRead += 2;

//       const mainHand = readVarInt(buffer.subarray(bytesRead));
//       bytesRead += mainHand[1];

//       const misc = buffer.subarray(
//         bytesRead,
//       );

//       return {
//         state: State.Play,
//         packedID,
//         locale: localeString[0],
//         viewDistance,
//         chatMode: chatMode[0],
//         chatColors: !!chatColor,
//         displayedSkinParts: {
//           cape: !!(skinFlagsByte & 0x01),
//           jacket: !!(skinFlagsByte & 0x02),
//           leftSleeve: !!(skinFlagsByte & 0x04),
//           rightSleeve: !!(skinFlagsByte & 0x08),
//           leftPantsLeg: !!(skinFlagsByte & 0x10),
//           rightPantsLeg: !!(skinFlagsByte & 0x20),
//           hat: !!(skinFlagsByte & 0x40),
//         },
//         mainHand: mainHand[0],
//         enableTextFiltering: !!misc[0],
//         allowServerListings: !!misc[1],
//       };
//     }

//     case 0x06: {
//       const [transactionID, readBytes] = readVarInt(buffer);
//       return {
//         state: State.Play,
//         packedID,
//         transactionID: transactionID,
//         text: deserializeString(buffer.subarray(readBytes))[0],
//       };
//     }

//     case 0x02:
//     default:
//       throw new Error("Invalid or Unsupported Packet");
//   }
// }
