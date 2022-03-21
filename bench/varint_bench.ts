import {
  readVarInt,
  readVarLong,
  writeVarInt,
  writeVarLong,
} from "../util/varint.ts";

const VARINT_BUFFER = new Uint8Array([128, 128, 128, 128, 8]);
const VARLONG_BUFFER = new Uint8Array(
  [255, 255, 255, 255, 255, 255, 255, 255, 255, 1],
);
const BIGINT = 9223372036854775807n;

const n = 10_000_000;
const warmup = 500_000;

Deno.bench({
  name: "READ:  VarInt ",
  fn: function () {
    readVarInt(VARINT_BUFFER);
  },
  n,
  warmup,
});

Deno.bench({
  name: "READ:  VarLong",
  fn: function () {
    readVarLong(VARLONG_BUFFER);
  },
  n,
  warmup,
});

Deno.bench({
  name: "WRITE: VarInt ",
  fn: function () {
    writeVarInt(-2147483648);
  },
  n,
  warmup,
});

Deno.bench({
  name: "WRITE: VarLong",
  fn: function () {
    writeVarLong(BIGINT);
  },
  n,
  warmup,
});
