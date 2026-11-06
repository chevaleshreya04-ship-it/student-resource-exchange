import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import app from "../app.js";

const url = () => `/api/resources/${new mongoose.Types.ObjectId()}`;
const del = (token: string) =>
  request(app).delete(url()).set("Authorization", `Bearer ${token}`);

describe("protect middleware", () => {
  it("rejects a garbage token", async () => {
    const res = await del("not-a-real-token");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid or expired token");
  });

  it("rejects a token signed with the wrong secret", async () => {
    const token = jwt.sign({ id: "abc" }, "wrong-secret");
    expect((await del(token)).status).toBe(401);
  });

  it("rejects an expired token", async () => {
    const token = jwt.sign({ id: "abc" }, process.env.JWT_SECRET as string, {
      expiresIn: -10,
    });
    expect((await del(token)).status).toBe(401);
  });

  it("rejects a validly signed token that has no id", async () => {
    const token = jwt.sign({ foo: "bar" }, process.env.JWT_SECRET as string);
    const res = await del(token);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid token payload");
  });

  it("returns 500 when the server has no JWT_SECRET", async () => {
    const token = jwt.sign({ id: "abc" }, process.env.JWT_SECRET as string);
    const original = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    try {
      expect((await del(token)).status).toBe(500);
    } finally {
      process.env.JWT_SECRET = original;
    }
  });
});