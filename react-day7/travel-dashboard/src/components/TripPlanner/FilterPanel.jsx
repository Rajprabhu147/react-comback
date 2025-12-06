// src/components/TripPlanner/FilterPanel.jsx

import React from "react";
import { CATEGORIES } from "./constants";

const FilterPanel = ({
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterChange,
}) => {
  return (
    <div className="filter-panel">
      <input
        type="text"
        placeholder="Search activities..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="filter-input"
      />
      <select
        value={filterCategory}
        onChange={(e) => onFilterChange(e.target.value)}
        className="filter-select"
      >
        <option value="all">All Categories</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterPanel;
