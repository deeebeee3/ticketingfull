import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("returns a 404 if the ticket is not found", async () => {
  const response = await request(app)
    .get("/api/tickets/ifinfwiiwfhiwfhiwhfi")
    .send()
    .expect(404);
});

it("it returns the ticket if the ticket is found", async () => {
  const title = "A View From a Bridge";
  const price = 19.99;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.createFakeCookie()) //signUp
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
