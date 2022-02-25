import { Err, Ok } from "../deps.ts";
import type { Result } from "../deps.ts";

export function readVarNum(
  buffer: Uint8Array,
  maxLength: number,
): Result<[number, number], string> {
  let value = 0;
  let length = 0;
  while (true) {
    const currentByte = buffer[length];
    value |= (currentByte & 0x7F) << 7 * length;
    length++;
    if (length > maxLength) return Err("Max Length Reached");

    if ((currentByte & 0x80) !== 0x80) {
      break;
    }
  }

  return Ok([value, length]);
}

export function writeVarNum(value: number): Uint8Array {
  const buff: number[] = [];
  while (true) {
    if ((value & ~0x7F) == 0) {
      buff.push(value);
      return new Uint8Array(buff);
    }

    buff.push((value & 0x7F) | 0x80);
    value >>>= 7;
  }
}
