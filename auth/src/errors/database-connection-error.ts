import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  public reason = "Error connecting to database";
  public statusCode = 500;

  constructor() {
    super("Error connecting to db");

    //Only because we are extencing a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [
      {
        message: this.reason,
      },
    ];
  }
}
