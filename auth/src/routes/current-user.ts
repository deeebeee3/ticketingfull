import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/api/users/currentuser", (req, res) => {
  if (!req.session?.jwt) {
    return res.send({ currentUser: null });
  }

  //decode / extract data out of jwt using verify()
  //! used after JWT_KEY - tell ts not to check if property defined - we already checked
  //in index.ts...
  try {
    //verify() will throw an error if token invalid
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);

    res.send({ currentUser: payload });
  } catch (err) {
    res.send({ currentUser: null });
  }
});

export { router as currentUserRouter };
