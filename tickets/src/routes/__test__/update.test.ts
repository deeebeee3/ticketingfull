import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

//jest will redirect this import to use the fake / mock natsWrapper
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exist", async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.createFakeCookie())
    .send({
      title: "gwgwg",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "gwgwg",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.createFakeCookie())
    .send({
      title: "ffwiufiw",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", global.createFakeCookie())
    .send({
      title: "wnfiwnifunw",
      price: 18,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const cookie = global.createFakeCookie();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "ffwiufiw",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "invalid price",
      price: -10,
    })
    .expect(400);
});

it("updates the ticket if provided valid inputs", async () => {
  const cookie = global.createFakeCookie();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "ffwiufiw",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Valid Title and Price",
      price: 17,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual("Valid Title and Price");
  expect(ticketResponse.body.price).toEqual(17);
});

it("publishes an event", async () => {
  const cookie = global.createFakeCookie();

  const response = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", cookie)
    .send({
      title: "ffwiufiw",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Valid Title and Price",
      price: 17,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
