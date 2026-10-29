import type React from "react";
import "./SearchBar.css";

interface SearchBarProps {
  setSearchTerm: (searchInput: string) => void;
}

const SearchBar = ({ setSearchTerm }: SearchBarProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="search-form">
      <label className="search-label" htmlFor="resource-title">
        Search resources:
      </label>
      <input
        className="search-input"
        onChange={handleChange}
        id="resource-title"
        name="resource-title"
        type="text"
      />
      <button className="search-btn">Go</button>
    </form>
  );
};

export default SearchBar;
