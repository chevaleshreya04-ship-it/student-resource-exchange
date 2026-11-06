import request from "supertest";
import app from "../app.js";

it("responds on the root route", async () => {
  const res = await request(app).get("/");
  expect(res.status).toBe(200);
});