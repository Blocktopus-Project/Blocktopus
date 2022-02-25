import { readVarNum } from "./varint.ts";

export async function pollConnection(conn: Deno.Conn): Promise<Uint8Array> {
  const packetSizeBytes = new Uint8Array(3);
  await conn.read(packetSizeBytes);

  const [packetSize, bytesRead] = readVarNum(packetSizeBytes, 3).unwrap();

  const readBuffer = new Uint8Array(packetSize - (3 - bytesRead));
  await conn.read(readBuffer);
  const payloadBinary = new Uint8Array(
    readBuffer.length + packetSizeBytes.length - bytesRead,
  );

  payloadBinary.set(packetSizeBytes.subarray(bytesRead));
  payloadBinary.set(readBuffer, packetSizeBytes.length - bytesRead);

  return payloadBinary;
}
