import type { Position } from "@payloads/position.ts";
import type { Reader } from "@util/reader.ts";

const POSITION_X_BITSHIFT = 38n;
const POSITION_Y_BITSHIFT = 0xFFFn;
const POSITION_Z_BITSHIFT1 = 12n;
const POSITION_Z_BITSHIFT2 = 0x3FFFFFFn;

export function deserializePosition(reader: Reader): Position {
  const bigint = reader.getBigUint64();

  let x = Number(bigint >> POSITION_X_BITSHIFT);
  let y = Number(bigint & POSITION_Y_BITSHIFT);
  let z = Number((bigint >> POSITION_Z_BITSHIFT1) & POSITION_Z_BITSHIFT2);

  if (x >= (2 ^ 25)) x -= 2 ^ 26;
  if (y >= (2 ^ 11)) y -= 2 ^ 12;
  if (z >= (2 ^ 25)) z -= 2 ^ 26;

  return {
    x,
    y,
    z,
  };
}
