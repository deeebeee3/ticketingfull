export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor() {
    super();

    //Only because we are extencing a built in class
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
