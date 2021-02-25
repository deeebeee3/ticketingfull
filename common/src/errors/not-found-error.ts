import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
  public reason = "Not Found";
  public statusCode = 404;

  constructor() {
    super("Route not found");

    //Only because we are extencing a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
