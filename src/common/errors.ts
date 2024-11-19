export class ApplicationError extends Error {
  message: string;
  statusCode: number;
  type: string;

  constructor({
    message,
    statusCode = 500,
    type,
  }: {
    message: string;
    statusCode?: number;
    type: string;
  }) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.type = type;
  }
}

export enum ErrorType {
  UNKNOWN = "unknown",
  INVALID_TOKEN = "invalid_token",
  ITEM_NOT_FOUND = "item_not_found",
  ITEM_ALREADY_EXISTS = "item_already_exists",
  INPUT_INVALID = "input_invalid",
  CHANNEL_NAME_REQUIRED = "channel_name_required",
  CHANNEL_MIN_MEMBERS = "channel_min_members",
}
