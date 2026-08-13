import React from 'react'
import './FilterChips.css'

const FilterChips = ({ filters, removeFilter }) => {
  // collect a multidimensional array containing arrays of key-value pairs from filters object. ex: [['abc': 123], ...]
  const activeFilters = Object.entries(filters)

  // if no filters are applied, then nothing should appear on the screen, so return early
  if (activeFilters.length === 0) return null

  return (
    <div className="filter-chips">
      {/* map over the key value pairs in order to return a chip that shows - key: value [X] */}
      {activeFilters.map(([key, value]) => (
        <span key={key} className="filter-chip">
          {key}: {value}
          <button onClick={() => removeFilter(key)}>✕</button>
        </span>
      ))}
    </div>
  )
}

export default FilterChips