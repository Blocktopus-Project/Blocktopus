export class ServerError extends Error {
  constructor(errorName: string, message: string) {
    super(message);
    this.name = errorName;
  }
}