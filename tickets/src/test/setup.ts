import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

//tell ts there is some global property called signin
declare global {
  namespace NodeJS {
    interface Global {
      createFakeCookie(): string[];
    }
  }
}

//anywhere we try to use the real nats wrapper jest will see this
//and instead use the fake (mock) nats wrapper...
jest.mock("../nats-wrapper");

let mongo: any;

//run beforeAll Hook before all tests
beforeAll(async () => {
  //tests will fail unless we manually add this key here - because remember
  //JWT_KEY is only available inside our pod
  process.env.JWT_KEY = "wonfownffwefw";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  //connect to our mongo in memory server database
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

//run beforeEach Hook before each test
beforeEach(async () => {
  //clear all the mocks / reset mock data...
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  //delete all data before each test
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

//after all tests are complete hook
afterAll(async () => {
  //kill db and close connection
  await mongo.stop();
  await mongoose.connection.close();
});

//add a globally scoped function we can use in tests
global.createFakeCookie = () => {
  //Build a JWT payload {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  //Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //Build session object {jwt: MY_JWT}
  const session = { jwt: token };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //return a string thats the cookie with the encoded data
  //supertest expects we return all our headers in an array, so wrap in array
  return [`express:sess=${base64}`];
};
