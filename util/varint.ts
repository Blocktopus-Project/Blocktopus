export function readVarInt(buffer: Uint8Array): [number, number] {
  let value = 0;
  let length = 0;
  while (true) {
    const currentByte = buffer[length];
    value |= (currentByte & 0x7F) << 7 * length;
    length++;
    if (length > 5) {
      throw "VarInt is too big";
    }

    if ((currentByte & 0x80) !== 0x80) {
      break;
    }
  }

  return [value, length];
}

// export function
