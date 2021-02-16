import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "../errors/request-validation-error";
import { DatabaseConnectionError } from "../errors/database-connection-error";

/* only requirement for error handling middleware is that 
it recieves the following 4 arguments */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof RequestValidationError) {
    console.log("RequestValidationError");
  }

  if (err instanceof DatabaseConnectionError) {
    console.log("DatabaseConnectionError");
  }

  res.status(400).send({
    message: err.message,
  });
};
