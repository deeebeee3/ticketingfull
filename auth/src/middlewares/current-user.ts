import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    //if jwt not defined rmove onto next middleware in our chain
    return next();
  }

  //decode / extract data out of jwt using verify()
  //! used after JWT_KEY - tell ts not to check if property defined - we already checked
  //in index.ts...
  try {
    //verify() will throw an error if token invalid
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

    //we want to add a new property (currentUser) to req...
    req.currentuser = payload;
  } catch (err) {}

  next();
};
