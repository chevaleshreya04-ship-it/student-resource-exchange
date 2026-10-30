import type { Resource } from "../types";

export const makeResource = (overrides: Partial<Resource> = {}): Resource => ({
  _id: "1",
  title: "Test Resource",
  subject: "Test Subject",
  university: "Test Uni",
  branch: "Test Branch",
  type: "notes",
  semester: 1,
  uploadedBy: { _id: "u1", username: "tester" },
  fileURL: "https://example.com/file.pdf",
  downloads: 0,
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});