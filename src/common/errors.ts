export class ApplicationError extends Error {
  message: string;
  statusCode: number;

  constructor({
    message,
    statusCode = 500,
  }: {
    message: string;
    statusCode?: number;
  }) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}
