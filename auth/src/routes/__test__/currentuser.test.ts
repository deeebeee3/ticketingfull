import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  //supertest doesn't manage and pass on cookies like a browser or postman does...
  //get the cookie (that includes our jwt inside it) and pass it to follow up request
  const cookie = await global.signUp();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie) //set the Cookie Header
    .send()
    .expect(200);

  //console.log(response.body);
  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null aif not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  //console.log(response.body);
  expect(response.body.currentUser).toEqual(null);
});
