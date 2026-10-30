import type { Resource, ResourceField } from "../types";

// Helper: pull unique, sorted values for a given field from the resources array
// r[key] - returns the value of r object for key attribute. spread operator takes unique values from set & expands them into array so that sort method can be used. use of function: to add options in the filter that already exist in the resources data
export const getUniqueValues = (
  resources: Array<Resource>,
  key: ResourceField,
) => {
  const values = resources.map((r) => r[key]);
  const unique = [...new Set(values)];
  return unique.sort((a, b) =>
    typeof a === "number" && typeof b === "number"
      ? a - b
      : String(a).localeCompare(String(b)),
  );
};

export const removeExtraSpaces = (str: string): string => {
  let i = 0;
  str = str.trim()
  const n = str.length;
  let res = "";

  while (i < n) {
    while (i < n && str.charAt(i) === " ") i++;
    while (i < n && str.charAt(i) !== " ") {
      res += str.charAt(i);
      i++;
    }
    if (i < n) res += " ";
  }

  return res;
};
