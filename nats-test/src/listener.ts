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

  const subscription = stan.subscribe(
    "ticket:created",
    "whatever-service-queue-group"
  );

  subscription.on("message", (msg: Message) => {
    const data = msg.getData();

    if (typeof data === "string") {
      console.log(`Recieved event #${msg.getSequence()}, with data: ${data}`);
    }
  });
});
