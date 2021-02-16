export class DatabaseConnectionError extends Error {
  public reason = "Error connecting to database";

  constructor() {
    super();

    //Only because we are extencing a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
}
