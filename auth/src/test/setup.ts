import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { app } from "../app";

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
