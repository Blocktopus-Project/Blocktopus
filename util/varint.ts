import { Err, Ok } from "../deps.ts";
import type { Result } from "../deps.ts";

export function readVarInt(
  buffer: Uint8Array,
): Result<[number, number], string> {
  let value = 0;
  let length = 0;
  while (true) {
    const currentByte = buffer[length];
    value |= (currentByte & 0x7F) << 7 * length;
    length++;
    if (length > 5) return Err("Max Length Reached");

    if ((currentByte & 0x80) !== 0x80) {
      break;
    }
  }

  return Ok([value, length]);
}

export function writeVarInt(value: number): Uint8Array {
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

export function readVarLong(
  buffer: Uint8Array,
): Result<[bigint, number], string> {
  let value = 0n;
  let length = 0;
  while (true) {
    const currentByte = buffer[length];
    value |= BigInt((currentByte & 0x7F) << 7 * length);
    length++;
    if (length > 5) return Err("Max Length Reached");

    if ((currentByte & 0x80) !== 0x80) {
      break;
    }
  }

  return Ok([value, length]);
}

export function writeVarLong(value: bigint): Uint8Array {
  const buff: number[] = [];
  while (true) {
    if ((value & ~0x7Fn) == 0n) {
      buff.push(Number(value));
      return new Uint8Array(buff);
    }

    buff.push((Number(value) & 0x7F) | 0x80);
    value >>= 7n;
    if (value < 0) {
      value &= ~(-1n << 57n);
    }
  }
}
