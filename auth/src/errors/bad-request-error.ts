import { CustomError } from "./custom-error";

export class BadRequestError extends CustomError {
  public statusCode = 400;

  constructor(public reason: string = "Bad request error.") {
    super(reason);

    //Only because we are extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
