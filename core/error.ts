export class ServerError extends Error {
  readonly isFatal: boolean;
  constructor(errorName: string, message: string, isFatal = false) {
    super(message);
    this.name = `${errorName} Error`;
    this.isFatal = isFatal;
  }
}
