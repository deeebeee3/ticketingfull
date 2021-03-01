import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

/* only requirement for error handling middleware is that 
it recieves the following 4 arguments */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({
      errors: err.serializeErrors(),
    });
  }

  console.error(err);

  res.status(400).send({
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  });
};
