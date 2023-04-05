// import { ServerError } from "@/error.ts";
// import { Client } from "@/client.ts";
// import { LogEntry, Logger } from "./logger.ts";
// import { State } from "@/types/mod.ts";
// import type { HandshakePayload } from "@server_payloads/mod.ts";

// interface PlayerInfo {
//   uuid: string;
//   name: string;
// }

// interface ServerInfo {
//   version: {
//     name: string;
//     protocol: number;
//   };
//   players: {
//     max: number;
//     online: number;
//     sample?: PlayerInfo[];
//   };
//   description?: unknown;
//   favicon?: `data:image/png;base64,${string}`;
// }

// interface ServerConfig {
//   port: number;
//   maxPlayers: number;
//   motd: string;
//   favicon?: string;
//   debug: boolean;
// }

// export class Server extends Logger {
//   // #innerListener: Deno.Listener;
//   // #config: ServerConfig;
//   // #clients: Set<Client>;
//   // #logger: Logger;

//   // favicon: null | `data:image/png;base64,${string}`;

//   // get serverInfo(): ServerInfo {
//   //   const info: ServerInfo = {
//   //     version: {
//   //       name: "1.19.2",
//   //       protocol: 761,
//   //     },
//   //     players: {
//   //       online: this.#clients.size,
//   //       max: this.#config.maxPlayers,
//   //     },
//   //     description: {
//   //       text: this.#config.motd,
//   //     },
//   //   };

//   //   if (this.favicon) {
//   //     info.favicon = this.favicon;
//   //   }

//   //   return info;
//   // }

//   // constructor(config: ServerConfig) {
//   //   this.#clients = new Set();
//   //   this.#config = config;
//   //   this.#logger = new Logger(config.debug);
//   //   this.#logger.addOutput(Deno.stdout.writable);
//   //   this.favicon = null;

//   //   if (config.favicon) {
//   //     const fileData = Deno.readFileSync(config.favicon);
//   //     const base64String = btoa(String.fromCharCode(...fileData));
//   //     this.favicon = `data:image/png;base64,${base64String}`;
//   //   }

//   //   this.#innerListener = Deno.listen({ port: config.port, transport: "tcp" });
//   // }

//   // #errorHook(e: ServerError) {
//   // }

//   // async #connectClient(conn: Deno.Conn) {
//   //   const client = new Client(conn, this.#logger);
//   //   const handshake = await client.poll<HandshakePayload>()
//   //     .catch(e => this.#errorHook(e));

//   //   if (!handshake) return;

//   //   client.state = handshake.nextState;

//   //   await client.send({
//   //     state: State.HandShaking,
//   //     packedID: 0x00,
//   //     JsonResponse: JSON.stringify(this.serverInfo),
//   //   });

//   //   if (handshake.nextState === State.Status) {
//   //     // client.drop();
//   //     return;
//   //   }

//   //   // Server is full
//   //   if (this.#clients.size > this.#config.maxPlayers) {
//   //     client.drop();
//   //   }

//   //   this.#clients.add(client);

//   //   // TODO: Login Sequence
//   // }

//   // async #startEventLoop() {
//   //   // while (true) {
//   //   // }
//   // }

//   // async #listenConnections() {
//   //   for await (const conn of this.#innerListener) {
//   //     this.#connectClient(conn);
//   //   }
//   // }

//   // async listen() {
//   //   this.#logger.write(
//   //     new LogEntry("Info", `Listening on port: ${this.#config.port}`),
//   //   );

//   //   const eventLoopPromise = this.#startEventLoop();
//   //   const connectionLoop = this.#listenConnections();

//   //   await Promise.all([connectionLoop, eventLoopPromise]);
//   // }
// }
export * from "./server.ts";
