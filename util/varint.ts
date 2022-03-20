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
    if ((value & (-128)) === 0) {
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

const exports = wasm.instance.exports as unknown as {
  mem: WebAssembly.Memory;
  readVarLong: (ptr: number) => [bigint, number];
  writeVarLong: (val: bigint) => number;
};

const wasmMemory = new Uint8Array(exports.mem.buffer);

export function readVarLong(buffer: Uint8Array): [bigint, number] {
  wasmMemory.set(buffer, 0);
  return exports.readVarLong(0);
}

export function writeVarLong(value: bigint): Uint8Array {
  return wasmMemory.subarray(0, exports.writeVarLong(value));
}
