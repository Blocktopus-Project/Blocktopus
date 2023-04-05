import { writeVarInt, writeVarLong } from "./varint.ts";

const TEXT_ENCODER = new TextEncoder();

type BigIntKind = "u64" | "i64";
type NumberKind = "u8" | "i8" | "u16" | "i16" | "u32" | "i32" | "f32" | "f64";

interface BigIntValue {
  value: bigint;
  kind: BigIntKind;
}

interface NumberValue {
  value: number;
  kind: NumberKind;
}

interface BinaryValue {
  kind: "bin";
  value: Uint8Array;
}

type Value =
  | ((BigIntValue | NumberValue) & { littleEndian: boolean })
  | BinaryValue;

export class Writer {
  #values: Value[];
  #size: number;

  constructor() {
    this.#values = [];
    this.#size = 0;
  }

  setFloat32(value: number, littleEndian = false): void {
    this.#values.push({ kind: "f32", value, littleEndian });
    this.#size += 4;
  }

  setFloat64(value: number, littleEndian = false): void {
    this.#values.push({ kind: "f64", value, littleEndian });
    this.#size += 8;
  }

  setInt8(value: number, littleEndian = false): void {
    this.#values.push({ kind: "i8", value, littleEndian });
    this.#size++;
  }

  setInt16(value: number, littleEndian = false): void {
    this.#values.push({ kind: "i16", value, littleEndian });
    this.#size += 2;
  }

  setInt32(value: number, littleEndian = false): void {
    this.#values.push({ kind: "i32", value, littleEndian });
    this.#size += 4;
  }

  setUint8(value: number, littleEndian = false): void {
    this.#values.push({ kind: "u8", value, littleEndian });
    this.#size++;
  }

  setUint16(value: number, littleEndian = false): void {
    this.#values.push({ kind: "u16", value, littleEndian });
    this.#size += 2;
  }

  setUint32(value: number, littleEndian = false): void {
    this.#values.push({ kind: "u32", value, littleEndian });
    this.#size += 4;
  }

  setBigInt64(value: bigint, littleEndian = false): void {
    this.#values.push({ kind: "i64", value, littleEndian });
    this.#size += 8;
  }

  setBigUint64(value: bigint, littleEndian = false): void {
    this.#values.push({ kind: "u64", value, littleEndian });
    this.#size += 8;
  }

  setVarInt(value: number): void {
    const binValue = writeVarInt(value);
    this.#values.push({ kind: "bin", value: binValue });
    this.#size += binValue.byteLength;
  }

  setVarLong(value: bigint): void {
    const binValue = writeVarLong(value);
    this.#values.push({ kind: "bin", value: binValue });
    this.#size += binValue.byteLength;
  }

  setString(value: string): void {
    this.setVarInt(value.length);
    this.#values.push({ kind: "bin", value: TEXT_ENCODER.encode(value) });
    this.#size += value.length;
  }

  setSlice(value: ArrayBufferView): void {
    this.setVarInt(value.byteLength);
    this.#values.push({
      kind: "bin",
      value: new Uint8Array(value.buffer, value.byteOffset, value.byteLength),
    });

    this.#size += value.byteLength;
  }

  intoPacket(): Uint8Array {
    const varintSize = writeVarInt(this.#size);
    const bytes = new Uint8Array(this.#size + varintSize.byteLength);
    const dt = new DataView(bytes.buffer);
    bytes.set(varintSize);

    let offset = 0;
    for (let i = 0; i < this.#values.length; i++) {
      const value = this.#values[i];

      switch (value.kind) {
        case "i8":
          dt.setInt8(offset, value.value);
          offset++;
          break;

        case "u8":
          dt.setUint8(offset, value.value);
          offset++;
          break;

        case "i16":
          dt.setInt16(offset, value.value, value.littleEndian);
          offset += 2;
          break;

        case "u16":
          dt.setUint16(offset, value.value, value.littleEndian);
          offset += 2;
          break;

        case "i32":
          dt.setInt32(offset, value.value, value.littleEndian);
          offset += 4;
          break;

        case "u32":
          dt.setUint32(offset, value.value, value.littleEndian);
          offset += 4;
          break;

        case "i64":
          dt.setBigInt64(offset, value.value, value.littleEndian);
          offset += 8;
          break;

        case "u64":
          dt.setBigUint64(offset, value.value, value.littleEndian);
          offset += 8;
          break;

        case "f32":
          dt.setFloat32(offset, value.value, value.littleEndian);
          offset += 4;
          break;

        case "f64":
          dt.setFloat64(offset, value.value, value.littleEndian);
          offset += 8;
          break;

        case "bin":
          bytes.set(value.value, offset);
          offset += value.value.byteLength;
      }
    }

    return bytes;
  }
}
