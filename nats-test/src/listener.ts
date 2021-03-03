import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

//after client (stan) connects to streaming server it will emit a connect event
const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

//watch for connect event
stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  //rather than pass in an object with options... with nats options
  //are methods which are chained on
  const options = stan.subscriptionOptions().setManualAckMode(true);

  const subscription = stan.subscribe(
    "ticket:created",
    "whatever-service-queue-group",
    options
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Recieved event #${msg.getSequence()}, with data: ${data}`);
    }

    //tell nats streaming server we recieved the message and it has been processed
    msg.ack();
  });
});

process.on("SIGINT", () => stan.close()); // interupt signals
process.on("SIGTERM", () => stan.close()); // terminate signals
