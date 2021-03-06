import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

//jest will redirect this import to use the fake / mock natsWrapper
import { natsWrapper } from "../../nats-wrapper";

//anywhere we try to use the real nats wrapper jest will see this
//and instead use the fake (mock) nats wrapper...
//mock was added in /test/setup.ts instead - so applies to all tests in __test__
//jest.mock("../../nats-wrapper");

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
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.createFakeCookie()) //signUp
    .send({
      title: "Valid Title and Price",
      price: 20,
    })
    .expect(201);

  tickets = await Ticket.find({});

  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual("Valid Title and Price");
});

it("publishes an event", async () => {
  const title = "iejnciencienc";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.createFakeCookie())
    .send({
      title,
      price: 20,
    })
    .expect(201);

  //console.log(natsWrapper);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
