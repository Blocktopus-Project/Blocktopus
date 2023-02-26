import { readVarInt, readVarLong } from "./varint.ts";

const TEXT_DECODER = new TextDecoder();

export class Reader {
  #inner: Uint8Array;
  #ptr: number;
  #view: DataView;

  readonly buffer: ArrayBuffer;

  constructor(buff: Uint8Array) {
    this.#inner = buff;
    this.#ptr = 0;
    this.#view = new DataView(buff.buffer, buff.byteOffset, buff.byteLength);
    this.buffer = buff.buffer;
  }

  getFloat32(littleEndian = false): number {
    const v = this.#view.getFloat32(this.#ptr, littleEndian);
    this.#ptr += 4;
    return v;
  }

  getFloat64(littleEndian = false): number {
    const v = this.#view.getFloat64(this.#ptr, littleEndian);
    this.#ptr += 8;
    return v;
  }

  getInt8(): number {
    const v = this.#view.getInt8(this.#ptr);
    this.#ptr++;
    return v;
  }

  getInt16(littleEndian = false): number {
    const v = this.#view.getInt16(this.#ptr, littleEndian);
    this.#ptr += 2;
    return v;
  }

  getInt32(littleEndian = false): number {
    const v = this.#view.getInt32(this.#ptr, littleEndian);
    this.#ptr += 4;
    return v;
  }

  getUint8(): number {
    const v = this.#view.getUint8(this.#ptr);
    this.#ptr++;
    return v;
  }

  getUint16(littleEndian = false): number {
    const v = this.#view.getUint16(this.#ptr, littleEndian);
    this.#ptr += 2;
    return v;
  }

  getUint32(littleEndian = false): number {
    const v = this.#view.getUint32(this.#ptr, littleEndian);
    this.#ptr += 4;
    return v;
  }

  getBigInt64(littleEndian = false): bigint {
    const v = this.#view.getBigInt64(this.#ptr, littleEndian);
    this.#ptr += 8;
    return v;
  }

  getBigUint64(littleEndian = false): bigint {
    const v = this.#view.getBigUint64(this.#ptr, littleEndian);
    this.#ptr += 8;
    return v;
  }

  getVarInt(): number {
    const [v, bytesRead] = readVarInt(this.#inner.subarray(this.#ptr));
    this.#ptr += bytesRead;
    return v;
  }

  getVarLong(): bigint {
    const [v, bytesRead] = readVarLong(this.#inner.subarray(this.#ptr));
    this.#ptr += bytesRead;
    return v;
  }

  getString(strLength = this.getVarInt()): string {
    const endPtr = this.#ptr + strLength;
    const v = TEXT_DECODER.decode(
      this.#inner.subarray(this.#ptr, endPtr),
    );
    this.#ptr = endPtr;
    return v;
  }

  getSlice(length = this.getVarInt()): Uint8Array {
    const endPtr = this.#ptr + length;
    const v = this.#inner.subarray(this.#ptr, endPtr);
    this.#ptr = endPtr;
    return v;
  }
}
