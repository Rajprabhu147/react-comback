import React, { useState } from "react";

const FilterBar = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    priority: "all",
    assignee: "all",
  });

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <div className="filter-bar">
      <div className="filter-bar-content">
        <div className="filter-group">
          <label htmlFor="status-filter">Status</label>
          <select
            id="status-filter"
            value={selectedFilters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="priority-filter">Priority</label>
          <select
            id="priority-filter"
            value={selectedFilters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
          >
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="assignee-filter">Assignee</label>
          <select
            id="assignee-filter"
            value={selectedFilters.assignee}
            onChange={(e) => handleFilterChange("assignee", e.target.value)}
          >
            <option value="all">All</option>
            <option value="me">Assigned to me</option>
            <option value="unassigned">Unassigned</option>
          </select>
        </div>

        <button
          className="reset-filters-btn"
          onClick={() =>
            setSelectedFilters({
              status: "all",
              priority: "all",
              assignee: "all",
            })
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default FilterBar;
