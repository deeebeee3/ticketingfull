import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@ddbtickets/common";
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email in use.");
    }

    const user = User.build({ email, password });
    await user.save();

    //After saving the user, generate JWT synchronously
    const userJwt = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      //! means hey ts, don't worry we already did this check earlier in index.ts
      //we don't need to do it again here...
      process.env.JWT_KEY!
    );

    //Store it on the session object
    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
