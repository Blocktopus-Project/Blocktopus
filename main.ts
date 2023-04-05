import { Server } from "@core/mod.ts";

const server = new Server(JSON.parse(Deno.readTextFileSync("./config.json")));
await server.listen();
