export enum ErrorKind {
  Deserialization,
  Serialization,
  Debug,
  TCP,
}

export class ServerError extends Error {
  public errorKind: ErrorKind;
  public name = "Server Error";

  constructor(errorKind: ErrorKind, message: string) {
    super(message);
    this.errorKind = errorKind;
  }
}
