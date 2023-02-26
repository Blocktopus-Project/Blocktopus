export type Packet<T> = Omit<T, "state" | "packedID">;
