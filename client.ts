export enum State {
  HandShaking,
  Connected,
  Disconnected,
}

export interface ClientDescriptor {
  connection: Deno.Conn;
  state: State;
}

export class Client {
  #inner: Deno.Conn;
  state: State;
  constructor(clientDescription: ClientDescriptor) {
    this.#inner = clientDescription.connection;
    this.state = clientDescription.state;
  }

  drop() {
    this.#inner.close();
    this.state = State.Disconnected;
  }
}
