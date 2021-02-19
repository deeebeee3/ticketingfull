import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";
import request from "supertest";

//tell ts there is some global property called signin
declare global {
  namespace NodeJS {
    interface Global {
      signUp(): Promise<string[]>;
    }
  }
}

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
global.signUp = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email,
      password,
    })
    .expect(201);

  const cookie = response.get("Set-Cookie");

  return cookie;
};
