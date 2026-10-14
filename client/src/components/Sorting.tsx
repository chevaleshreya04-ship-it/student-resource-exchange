import React from "react";
import "./Sorting.css";

interface SortingProps {
  sortBy: string,
  sortOrder: string, 
  onSortByChange: (str: string) => void
  onSortOrderChange: (str: string) => void
}

const Sorting = ({ sortBy, sortOrder, onSortByChange, onSortOrderChange }: SortingProps) => {
  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => onSortByChange(e.target.value);
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => onSortOrderChange(e.target.value);

  return (
    <div className="sort-container">
      <div>
        <span>Sort By: </span>
        <select
          value={sortBy}
          onChange={handleSortByChange}
          name="sortBy"
          id="sortBy"
        >
          <option value="downloads">Downloads</option>
          <option value="dateUploaded">Date Uploaded</option>
        </select>
      </div>
      <div>
        <span>Sort Order: </span>
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          name="sortOrder"
          id="sortOrder"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default Sorting;
