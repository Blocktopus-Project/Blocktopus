import { Server } from "@core/server.ts";

const server = new Server(JSON.parse(Deno.readTextFileSync("./config.json")));
await server.listen();
