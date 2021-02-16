import { Request, Response, NextFunction } from "express";

/* only requirement for error handling middleware is that 
it recieves the following 4 arguments */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err.message);

  res.status(400).send({
    message: err.message,
  });
};
