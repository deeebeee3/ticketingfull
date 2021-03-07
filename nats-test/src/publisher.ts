import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

//after client (stan) connects to streaming server it will emit a connect event
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

//watch for connect event
stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "123",
      title: "concert",
      price: 20,
      userId: "je84ht874h",
    });
  } catch (err) {
    console.log(err);
  }
});
