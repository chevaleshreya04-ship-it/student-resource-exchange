import request from "supertest";
import mongoose from "mongoose";
import type { Request, Response, NextFunction } from "express";
import app from "../app.js";
import Resource from "../models/Resource.js";
import cloudinary from "../config/cloudinary.js";
import { createUserWithToken } from "./helpers.js";

// Never hit real Cloudinary
vi.mock("../config/cloudinary", () => ({
  default: {
    uploader: { destroy: vi.fn().mockResolvedValue({ result: "ok" }) },
  },
}));

// Replace multer: pretend a file was uploaded when the test sends the x-test-file header
vi.mock("../config/multer", () => ({
  default: {
    single: () => (req: Request, _res: Response, next: NextFunction) => {
      if (req.headers["x-test-file"]) {
        (req as any).file = {
          secure_url: "https://cdn.test/file.pdf",
          public_id: "sre-resources/abc",
          resource_type: "raw",
        };
      }
      next();
    },
  },
}));

const validBody = {
  title: "DBMS Notes",
  subject: "DBMS",
  university: "RTMNU",
  branch: "Computer Science",
  type: "notes",
  semester: "5",
} as const;

const makeResourceDoc = (uploadedBy: mongoose.Types.ObjectId) =>
  Resource.create({
    ...validBody,
    semester: 5,
    uploadedBy,
    fileURL: "https://cdn.test/file.pdf",
    publicId: "sre-resources/abc",
    resourceType: "raw",
  });

afterEach(() => vi.clearAllMocks());

describe("GET /api/resources", () => {
  it("returns an empty array when there are no resources", async () => {
    const res = await request(app).get("/api/resources");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("returns resources with the uploader's username populated", async () => {
    const { user } = await createUserWithToken("shreya");
    await makeResourceDoc(user._id);

    const res = await request(app).get("/api/resources");
    expect(res.body).toHaveLength(1);
    expect(res.body[0].uploadedBy.username).toBe("shreya");
  });

  it("returns 500 when the database fails", async () => {
    vi.spyOn(Resource, "find").mockImplementationOnce(() => {
      throw new Error("db down");
    });
    const res = await request(app).get("/api/resources");
    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to fetch resources");
  });
});

describe("GET /api/resources/:id", () => {
  it("returns the resource with the uploader populated", async () => {
    const { user } = await createUserWithToken("shreya");
    const doc = await makeResourceDoc(user._id);

    const res = await request(app).get(`/api/resources/${doc._id}`);
    expect(res.status).toBe(200);
    expect(res.body.uploadedBy.username).toBe("shreya");
  });

  it("returns 404 for a nonexistent id", async () => {
    const res = await request(app).get(
      `/api/resources/${new mongoose.Types.ObjectId()}`,
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 for a malformed id", async () => {
    const res = await request(app).get("/api/resources/abc");
    expect(res.status).toBe(404);
  });

  it("returns 500 when the database fails", async () => {
    const { user } = await createUserWithToken("shreya");
    const doc = await makeResourceDoc(user._id);
    vi.spyOn(Resource, "findById").mockImplementationOnce(() => {
      throw new Error("db down");
    });

    const res = await request(app).get(`/api/resources/${doc._id}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to fetch resource");
  });
});

describe("POST /api/resources", () => {
  it("returns 401 without a token", async () => {
    const res = await request(app).post("/api/resources").send(validBody);
    expect(res.status).toBe(401);
  });

  it("returns 400 when fields are missing", async () => {
    const { token } = await createUserWithToken();
    const res = await request(app)
      .post("/api/resources")
      .set("Authorization", `Bearer ${token}`)
      .set("x-test-file", "1")
      .send({ title: "Only a title" });
    expect(res.status).toBe(400);
  });

  it("returns 400 when no file is attached", async () => {
    const { token } = await createUserWithToken();
    const res = await request(app)
      .post("/api/resources")
      .set("Authorization", `Bearer ${token}`)
      .send(validBody);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("File is required");
  });

  it("creates a resource owned by the logged-in user", async () => {
    const { user, token } = await createUserWithToken();
    const res = await request(app)
      .post("/api/resources")
      .set("Authorization", `Bearer ${token}`)
      .set("x-test-file", "1")
      .send(validBody);

    expect(res.status).toBe(201);
    expect(res.body.uploadedBy).toBe(user._id.toString());
    expect(res.body.fileURL).toBe("https://cdn.test/file.pdf");
    expect(res.body.downloads).toBe(0);
    expect(await Resource.countDocuments()).toBe(1);
  });

  it("returns 500 when the database fails", async () => {
    const { token } = await createUserWithToken();
    vi.spyOn(Resource, "create").mockImplementationOnce(() => {
      throw new Error("db down");
    });

    const res = await request(app)
      .post("/api/resources")
      .set("Authorization", `Bearer ${token}`)
      .set("x-test-file", "1")
      .send(validBody);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to create resource");
  });
});

describe("DELETE /api/resources/:id", () => {
  it("returns 401 without a token", async () => {
    const { user } = await createUserWithToken();
    const doc = await makeResourceDoc(user._id);

    const res = await request(app).delete(`/api/resources/${doc._id}`);
    expect(res.status).toBe(401);
  });

  it("returns 403 when a different user tries to delete", async () => {
    const { user: owner } = await createUserWithToken("owner");
    const { token: otherToken } = await createUserWithToken("other");
    const doc = await makeResourceDoc(owner._id);

    const res = await request(app)
      .delete(`/api/resources/${doc._id}`)
      .set("Authorization", `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
    expect(await Resource.findById(doc._id)).not.toBeNull();
    expect(cloudinary.uploader.destroy).not.toHaveBeenCalled();
  });

  it("lets the owner delete, removing it from the DB and Cloudinary", async () => {
    const { user, token } = await createUserWithToken();
    const doc = await makeResourceDoc(user._id);

    const res = await request(app)
      .delete(`/api/resources/${doc._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(await Resource.findById(doc._id)).toBeNull();
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(
      "sre-resources/abc",
      {
        resource_type: "raw",
      },
    );
  });

  it("returns 404 for a nonexistent id", async () => {
    const { token } = await createUserWithToken();
    const res = await request(app)
      .delete(`/api/resources/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it("returns 404 for a malformed id", async () => {
    const res = await request(app).delete("/api/resources/abc");
    expect(res.status).toBe(404);
  });

  it("returns 500 and keeps the DB record when Cloudinary fails", async () => {
    const { user, token } = await createUserWithToken("shreya");
    const doc = await makeResourceDoc(user._id);
    vi.mocked(cloudinary.uploader.destroy).mockRejectedValueOnce(
      new Error("cloudinary down"),
    );

    const res = await request(app)
      .delete(`/api/resources/${doc._id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to delete resource");
    expect(await Resource.findById(doc._id)).not.toBeNull();
  });
});

describe("PATCH /api/resources/:id/download", () => {
  it("increments the download count", async () => {
    const { user } = await createUserWithToken();
    const doc = await makeResourceDoc(user._id);

    await request(app).patch(`/api/resources/${doc._id}/download`);
    const res = await request(app).patch(`/api/resources/${doc._id}/download`);

    expect(res.status).toBe(200);
    expect(res.body.downloads).toBe(2);
  });

  it("returns 404 for a nonexistent id", async () => {
    const res = await request(app).patch(
      `/api/resources/${new mongoose.Types.ObjectId()}/download`,
    );
    expect(res.status).toBe(404);
  });

  it("returns 404 for a malformed id", async () => {
    const res = await request(app).patch("/api/resources/abc");
    expect(res.status).toBe(404);
  });

  it("returns 500 when the database fails", async () => {
    const { user } = await createUserWithToken("shreya");
    const doc = await makeResourceDoc(user._id);

    vi.spyOn(Resource, "findByIdAndUpdate").mockImplementationOnce(() => {
      throw new Error("db down");
    });

    const res = await request(app).patch(`/api/resources/${doc._id}/download`);

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Failed to update download count");
  });
});
