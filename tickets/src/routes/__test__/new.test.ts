import request from "supertest";
import { app } from "../../app";

it("has a route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});

  expect(response.status).not.toEqual(404);
});

it("it can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/tickets").send({}).expect(401);
});

it("it returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.createFakeCookie())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.createFakeCookie())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.createFakeCookie())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.createFakeCookie())
    .send({
      title: "Valid Title",
      price: -10,
    })
    .expect(400);

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.createFakeCookie())
    .send({
      title: "Valid Title But No Price",
    });

  expect(response.status).toEqual(400);
});

it("creates a ticket with valid inputs", async () => {
  // TODO: add in a check to make sure a ticket was saved

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.createFakeCookie())
    .send({
      title: "Valid Title and Price",
      price: 20,
    })
    .expect(201);
});
