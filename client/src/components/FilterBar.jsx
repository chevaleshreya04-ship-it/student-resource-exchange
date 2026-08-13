import React from "react";
import "./FilterBar.css";

const TYPE_OPTIONS = ["question paper", "textbook", "research paper", "notes"];

// Helper: pull unique, sorted values for a given field from the resources array
// r[key] - returns the value of r object for key attribute. spread operator takes unique values from set & expands them into array so that sort method can be used. use of function: to add options in the filter that already exist in the resources data
const getUniqueValues = (resources, key) => {
  const values = resources.map((r) => r[key]);
  const unique = [...new Set(values)];
  return unique.sort((a, b) =>
    typeof a === "number" ? a - b : String(a).localeCompare(String(b)),
  );
};

const FilterBar = ({ resources, filters, setFilter }) => {
  // find values present in resource data for subject, uni, branch & sem, and populate them into an array. unique values are found for attributes that are not enum-type (predefined)
  const subjectOptions = getUniqueValues(resources, "subject");
  const universityOptions = getUniqueValues(resources, "university");
  const branchOptions = getUniqueValues(resources, "branch");
  const semesterOptions = getUniqueValues(resources, "semester");

  const handleChange = (key) => (e) => {
    setFilter(key, e.target.value);
  };

  return (
    // map through TYPE_OPTIONS array to list out the options within select, and so on for the rest of the arrays for other filters...
    // every filter has a "" value, using which we can remove a specific filter
    // event handling: developer calls handleChange(key) (for example handleChange("type")), which returns the event handler to store it in onChange attribute. THIS returned function is called whenever change occurs in selected option
    <div className="filter-bar">
      <label className="filter-label">Filter:</label>
      <select value={filters.type || ""} onChange={handleChange("type")}>
        <option value="">Type</option>
        {TYPE_OPTIONS.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select value={filters.subject || ""} onChange={handleChange("subject")}>
        <option value="">Subject</option>
        {subjectOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select
        value={filters.university || ""}
        onChange={handleChange("university")}
      >
        <option value="">University</option>
        {universityOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select value={filters.branch || ""} onChange={handleChange("branch")}>
        <option value="">Branch</option>
        {branchOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      <select
        value={filters.semester || ""}
        onChange={handleChange("semester")}
      >
        <option value="">Semester</option>
        {semesterOptions.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterBar;
