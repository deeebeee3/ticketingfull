import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns an error if the ticket does not exist", async () => {
  const ticketId = mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.createFakeCookie())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns an error if the ticket is already reserved", () => {});

it("reserves a ticket", () => {});
