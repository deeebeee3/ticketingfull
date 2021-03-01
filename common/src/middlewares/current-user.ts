import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

//We use this interface to explicitly tell ts what const payloads type is (line 38)
interface UserPayload {
  id: string;
  email: string;
}

//Augment type definition... reach into Expresses type definition and modify the
//Request interface to have an optional property currentUser of type UserPayload
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.session?.jwt) {
    //if jwt not defined move onto next middleware in our chain
    return next();
  }

  //decode / extract data out of jwt using verify()
  //! used after JWT_KEY - tell ts not to check if property defined - we already checked
  //in index.ts...
  try {
    //verify() will throw an error if token invalid
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    //we want to add a new property (currentUser) to req...
    req.currentUser = payload;
  } catch (err) {}

  next();
};
