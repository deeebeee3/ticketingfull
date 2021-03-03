import nats from "node-nats-streaming";

//after client (stan) connects to streaming server it will emit a connect event
const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Publisher connected to NATS");
});
