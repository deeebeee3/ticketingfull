import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  //private errs: ValidationError[];

  constructor(public errors: ValidationError[], public statusCode = 400) {
    super();

    //this.errs = errors;

    //Only because we are extencing a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((err) => {
      return { message: err.msg, field: err.param };
    });
  }
}
