import nats from "node-nats-streaming";

console.clear();

//after client (stan) connects to streaming server it will emit a connect event
const stan = nats.connect("ticketing", "123", {
  url: "http://localhost:4222",
});

//watch for connect event
stan.on("connect", () => {
  console.log("Publisher connected to NATS");

  const subscription = stan.subscribe("ticket:created");

  subscription.on("message", (msg) => {
    console.log("message recieved");
  });
});
