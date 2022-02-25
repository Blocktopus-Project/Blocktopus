import { Server } from "./server.ts";

const server = new Server(JSON.parse(Deno.readTextFileSync("./config.json")));
await server.listen();
