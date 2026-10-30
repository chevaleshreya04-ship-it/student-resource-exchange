import { getUniqueValues, removeExtraSpaces } from "./helpers";
import { makeResource } from "./testUtils";

describe("getUniqueValues", () => {
  it("removes duplicate values for a specified key", () => {
    const resources = [
      makeResource({ subject: "DBMS" }),
      makeResource({ subject: "OS" }),
      makeResource({ subject: "DBMS" }),
    ];

    expect(getUniqueValues(resources, "subject")).toEqual(["DBMS", "OS"]);
  });

  it("sorts strings alphabetically", () => {
    const resources = [
      makeResource({ subject: "Advanced Java" }),
      makeResource({ subject: "CSS Fundamentals" }),
      makeResource({ subject: "OS" }),
      makeResource({ subject: "DBMS" }),
    ];

    expect(getUniqueValues(resources, "subject")).toEqual([
      "Advanced Java",
      "CSS Fundamentals",
      "DBMS",
      "OS",
    ]);
  });

  it("sorts numbers in ascending order", () => {
    const resources = [
      makeResource({ semester: 5 }),
      makeResource({ semester: 1 }),
      makeResource({ semester: 4 }),
      makeResource({ semester: 3 }),
      makeResource({semester: 10})
    ];

    expect(getUniqueValues(resources, "semester")).toEqual([1, 3, 4, 5, 10]);
  });
});

describe("removeExtraSpaces", () => {
  it("collapses multiple spaces between words", () => {
    expect(removeExtraSpaces("Hello     from    me   !")).toBe(
      "Hello from me !",
    );
    expect(removeExtraSpaces("Unit    3  -  notes")).toBe("Unit 3 - notes");
  });

  it("trims leading and trailing spaces", () => {
    expect(removeExtraSpaces("    hello     ")).toBe("hello");
  });

  it(`returns '' for an all-space or empty string`, () => {
    expect(removeExtraSpaces("            ")).toBe("");
    expect(removeExtraSpaces("")).toBe("");
  });
});
