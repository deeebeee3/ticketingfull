import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";
import { errorHandler, NotFoundError } from "@ddbtickets/common";

const app = express();
app.set("trust proxy", true); //trust traffic coming from our ingress-nginx proxy
app.use(json());
app.use(
  cookieSession({
    signed: false, //don't encrypt cookie contents
    secure: process.env.NODE_ENV !== "test", // cookies only used if using https
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
