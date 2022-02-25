export enum State {
  HandShaking,
  Connected,
  Disconnected,
}

export interface ClientDescriptor {
  connection: Deno.Conn;
  name: string;
}

export class Client {
  #inner: Deno.Conn;
  state: State;
  name: string;

  constructor(clientDescription: ClientDescriptor) {
    this.#inner = clientDescription.connection;
    this.state = State.Connected;
    this.name = clientDescription.name;
  }

  drop() {
    this.#inner.close();
    this.state = State.Disconnected;
  }

  async poll() {
  }
}
