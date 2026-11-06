import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../app.js";
import User from "../models/User.js";

const creds = { username: "shreya", password: "secret123" };

describe("POST /api/auth/register", () => {
  it("creates a user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send(creds);

    expect(res.status).toBe(201);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user.username).toBe("shreya");
    expect(res.body.user.password).toBeUndefined();
  });

  it("stores a hashed password, not the plain one", async () => {
    await request(app).post("/api/auth/register").send(creds);

    const saved = await User.findOne({ username: "shreya" });
    expect(saved!.password).not.toBe(creds.password);
    expect(await bcrypt.compare(creds.password, saved!.password)).toBe(true);
  });

  it("returns 400 when a field is missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "shreya" });

    expect(res.status).toBe(400);
  });

  it("returns 409 for a duplicate username", async () => {
    await request(app).post("/api/auth/register").send(creds);
    const res = await request(app).post("/api/auth/register").send(creds);

    expect(res.status).toBe(409);
  });

  it("returns 500 when the database fails", async () => {
    vi.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("db down");
    });
    const res = await request(app).post("/api/auth/register").send(creds);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Registration failed");
  });
});

describe("POST /api/auth/login", () => {
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(creds);
  });

  it("logs in with correct credentials", async () => {
    const res = await request(app).post("/api/auth/login").send(creds);

    expect(res.status).toBe(200);
    expect(res.body.token).toEqual(expect.any(String));
  });

  it("returns 400 when no password is sent", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "shreya" });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Username and password are required");
  });

  it("returns 401 for a wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "shreya", password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("returns 401 for an unknown user, with the same message as a wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "nobody", password: "whatever" });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid username or password");
  });

  it("returns 500 when the database fails", async () => {
    vi.spyOn(User, "findOne").mockImplementationOnce(() => {
      throw new Error("db down");
    });
    const res = await request(app).post("/api/auth/login").send(creds);
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Login failed");
  });
});
