export function readVarInt(
  buffer: Uint8Array,
): [number, number] {
  let value = 0;
  let length = 0;
  while (true) {
    const currentByte = buffer[length];
    value |= (currentByte & 0x7F) << 7 * length;
    length++;
    if (length > 5) throw new Error("Max Length Reached");

    if ((currentByte & 0x80) !== 0x80) {
      break;
    }
  }

  return [value, length];
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
const wasm = await WebAssembly.instantiateStreaming(
  fetch(new URL("./varlong.wasm", import.meta.url)),
);
const wasmMemory = new Uint8Array(
  (wasm.instance.exports as Record<string, WebAssembly.Memory>).mem.buffer,
);

type FnCall = (ptr: number) => [bigint, number];

export function readVarLong(buffer: Uint8Array): [bigint, number] {
  wasmMemory.set(buffer, 0);
  return (wasm.instance.exports as Record<string, FnCall>).readVarLong(0);
}

export function writeVarLong(value: bigint): Uint8Array {
  const buff: number[] = [];
  while (true) {
    if (Number(value & ~0x7Fn) == 0) {
      buff.push(Number(value));
      return new Uint8Array(buff);
    }

    buff.push(Number(value & 0x7Fn) | 0x80);
    value >>= 7n;
    if (value < 0) {
      value &= ~(-1n << 57n);
    }
  }
}
