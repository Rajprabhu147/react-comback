// src/components/TripPlanner/ItinerarySection.jsx

import React from "react";
import FilterPanel from "./FilterPanel";
import ActivityList from "./ActivityList";

const ItinerarySection = ({
  activities,
  searchQuery,
  onSearchChange,
  filterCategory,
  onFilterChange,
  onEditActivity,
  onDeleteActivity,
  onToggleComplete,
}) => {
  const filteredActivities = activities
    .filter((a) => {
      const matchesSearch =
        a.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || a.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));

  return (
    <div className="planner-itinerary-section">
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filterCategory={filterCategory}
        onFilterChange={onFilterChange}
      />

      <div className="activities-list-container">
        <h2 className="itinerary-title">
          Itinerary ({filteredActivities.length})
        </h2>

        <ActivityList
          activities={filteredActivities}
          onEdit={onEditActivity}
          onDelete={onDeleteActivity}
          onToggleComplete={onToggleComplete}
        />
      </div>
    </div>
  );
};

export default ItinerarySection;
