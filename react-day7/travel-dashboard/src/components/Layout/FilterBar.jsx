import React, { useState } from "react";
import { X, Filter, Search } from "lucide-react";

const FilterBar = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    status: "all",
    priority: "all",
    assignee: "all",
    search: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleSearchChange = (value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleReset = () => {
    setSelectedFilters({
      status: "all",
      priority: "all",
      assignee: "all",
      search: "",
    });
    setIsExpanded(false);
  };

  const activeFiltersCount = Object.values(selectedFilters).filter(
    (v) => v !== "all" && v !== ""
  ).length;

  const filterOptions = [
    {
      id: "status",
      label: "Status",
      icon: "📋",
      options: [
        { value: "all", label: "All Status" },
        { value: "open", label: "Open" },
        { value: "in-progress", label: "In Progress" },
        { value: "closed", label: "Closed" },
      ],
    },
    {
      id: "priority",
      label: "Priority",
      icon: "⚡",
      options: [
        { value: "all", label: "All Priorities" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
    {
      id: "assignee",
      label: "Assignee",
      icon: "👤",
      options: [
        { value: "all", label: "All Users" },
        { value: "me", label: "Assigned to me" },
        { value: "unassigned", label: "Unassigned" },
      ],
    },
  ];

  return (
    <div className="filter-bar-enhanced">
      {/* Compact View - Desktop */}
      <div className="filter-bar-compact">
        <div className="search-box-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={selectedFilters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="search-input"
          />
          {selectedFilters.search && (
            <button
              className="search-clear"
              onClick={() => handleSearchChange("")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filter-chips">
          {filterOptions.map((filter) => (
            <div key={filter.id} className="filter-chip">
              <span className="chip-icon">{filter.icon}</span>
              <select
                value={selectedFilters[filter.id]}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className="chip-select"
              >
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="filter-actions">
          {activeFiltersCount > 0 && (
            <span className="active-count">{activeFiltersCount} active</span>
          )}
          {activeFiltersCount > 0 && (
            <button className="btn-reset" onClick={handleReset}>
              <X size={16} />
              Reset
            </button>
          )}
          <button
            className="btn-advanced"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter size={16} />
            More
          </button>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="filter-bar-expanded">
          <div className="expanded-content">
            {filterOptions.map((filter) => (
              <div key={filter.id} className="expanded-group">
                <label className="expanded-label">
                  <span className="label-icon">{filter.icon}</span>
                  {filter.label}
                </label>
                <div className="expanded-options">
                  {filter.options.map((option) => (
                    <label key={option.value} className="radio-option">
                      <input
                        type="radio"
                        name={filter.id}
                        value={option.value}
                        checked={selectedFilters[filter.id] === option.value}
                        onChange={(e) =>
                          handleFilterChange(filter.id, e.target.value)
                        }
                      />
                      <span className="radio-text">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="expanded-footer">
            <button className="btn-close" onClick={() => setIsExpanded(false)}>
              Collapse
            </button>
            {activeFiltersCount > 0 && (
              <button className="btn-reset-expanded" onClick={handleReset}>
                Reset All
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
