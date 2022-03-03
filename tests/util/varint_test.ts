import { assert, assertEquals } from "../_deps.ts";
import {
  readVarInt,
  readVarLong,
  writeVarInt,
  writeVarLong,
} from "../../util/varint.ts";

Deno.test({
  name: "VarInt encode",
  fn: function () {
    assertEquals(writeVarInt(0), new Uint8Array([0]));
    assertEquals(writeVarInt(1), new Uint8Array([1]));
    assertEquals(writeVarInt(127), new Uint8Array([127]));
    assertEquals(writeVarInt(128), new Uint8Array([128, 1]));
    assertEquals(writeVarInt(255), new Uint8Array([255, 1]));
    assertEquals(writeVarInt(25565), new Uint8Array([221, 199, 1]));
    assertEquals(writeVarInt(2097151), new Uint8Array([255, 255, 127]));
    assertEquals(
      writeVarInt(2147483647),
      new Uint8Array([255, 255, 255, 255, 7]),
    );
    assertEquals(writeVarInt(-1), new Uint8Array([255, 255, 255, 255, 15]));
    assertEquals(
      writeVarInt(-2147483648),
      new Uint8Array([128, 128, 128, 128, 8]),
    );
  },
});

Deno.test({
  name: "VarInt decode",
  fn: function () {
    assertEquals(readVarInt(new Uint8Array([0])).unwrap()[0], 0);
    assertEquals(readVarInt(new Uint8Array([1])).unwrap()[0], 1);
    assertEquals(readVarInt(new Uint8Array([127])).unwrap()[0], 127);
    assertEquals(readVarInt(new Uint8Array([128, 1])).unwrap()[0], 128);
    assertEquals(readVarInt(new Uint8Array([255, 1])).unwrap()[0], 255);
    assertEquals(readVarInt(new Uint8Array([221, 199, 1])).unwrap()[0], 25565);
    assertEquals(
      readVarInt(new Uint8Array([255, 255, 127])).unwrap()[0],
      2097151,
    );
    assertEquals(
      readVarInt(new Uint8Array([255, 255, 255, 255, 7])).unwrap()[0],
      2147483647,
    );
    assertEquals(
      readVarInt(new Uint8Array([255, 255, 255, 255, 15])).unwrap()[0],
      -1,
    );
    assertEquals(
      readVarInt(new Uint8Array([128, 128, 128, 128, 8])).unwrap()[0],
      -2147483648,
    );
  },
});

Deno.test({
  name: "VarLong encode",
  fn: function () {
    assertEquals(writeVarLong(0n), new Uint8Array([0]));
    assertEquals(writeVarLong(1n), new Uint8Array([1]));
    assertEquals(writeVarLong(2n), new Uint8Array([2]));
    assertEquals(writeVarLong(127n), new Uint8Array([127]));
    assertEquals(writeVarLong(128n), new Uint8Array([128, 1]));
    assertEquals(writeVarLong(255n), new Uint8Array([255, 1]));
    assertEquals(
      writeVarLong(2147483647n),
      new Uint8Array([255, 255, 255, 255, 7]),
    );
    // assertEquals(
    //   writeVarLong(9223372036854775807n),
    //   new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 127]),
    // );
    // assertEquals(
    //   writeVarLong(-1n),
    //   new Uint8Array([255, 255, 255, 255, 255, 255, 255, 255, 255, 1]),
    // );
    assertEquals(
      writeVarLong(-2147483648n),
      new Uint8Array([128, 128, 128, 128, 248, 255, 255, 255, 255, 1]),
    );
    assertEquals(
      writeVarLong(-9223372036854775808n),
      new Uint8Array([128, 128, 128, 128, 128, 128, 128, 128, 128, 1]),
    );
  },
});

Deno.test({
  name: "VarLong decode",
  fn: function () {
    assertEquals(readVarLong(new Uint8Array([0])).unwrap()[0], 0n);
    assertEquals(readVarLong(new Uint8Array([1])).unwrap()[0], 1n);
    assertEquals(readVarLong(new Uint8Array([2])).unwrap()[0], 2n);
    assertEquals(readVarLong(new Uint8Array([127])).unwrap()[0], 127n);
    assertEquals(readVarLong(new Uint8Array([128, 1])).unwrap()[0], 128n);
    assertEquals(readVarLong(new Uint8Array([255, 1])).unwrap()[0], 255n);
  },
});
