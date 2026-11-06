import { getErrorMessage } from "../utils/getErrorMessage.js";

it("returns the message for Error objects", () => {
  expect(getErrorMessage(new Error("boom"))).toBe("boom");
});

it("returns a fallback for non-Error values", () => {
  expect(getErrorMessage("something")).toBe("Unknown Error");
});