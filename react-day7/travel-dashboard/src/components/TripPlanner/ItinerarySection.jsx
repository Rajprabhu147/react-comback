// src/components/TripPlanner/ItinerarySection.jsx

import React from "react";
import { ChevronDown } from "lucide-react";
import FilterPanel from "./FilterPanel";
import ActivityList from "./ActivityList";
import "../../styles/itinerary-section.css";

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

  // Group activities by day
  const groupedActivities = filteredActivities.reduce((acc, activity) => {
    const dayKey = `Day ${activity.day}`;
    if (!acc[dayKey]) {
      acc[dayKey] = [];
    }
    acc[dayKey].push(activity);
    return acc;
  }, {});

  const dayKeys = Object.keys(groupedActivities).sort((a, b) => {
    const dayA = parseInt(a.split(" ")[1]);
    const dayB = parseInt(b.split(" ")[1]);
    return dayA - dayB;
  });

  return (
    <div className="planner-itinerary-section">
      <FilterPanel
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        filterCategory={filterCategory}
        onFilterChange={onFilterChange}
      />

      <div className="activities-list-container">
        <div className="itinerary-header">
          <h2 className="itinerary-title">
            📋 Itinerary
            <span className="itinerary-count">{filteredActivities.length}</span>
          </h2>
          <p className="itinerary-subtitle">
            {dayKeys.length} day{dayKeys.length !== 1 ? "s" : ""} planned
          </p>
        </div>

        {filteredActivities.length === 0 ? (
          <div className="no-activities-message">
            <div className="empty-icon">📭</div>
            <p className="empty-text">No activities found</p>
            <p className="empty-hint">
              {searchQuery
                ? "Try adjusting your search filters"
                : "Add activities to your trip itinerary"}
            </p>
          </div>
        ) : (
          <div className="activities-by-day">
            {dayKeys.map((dayKey) => (
              <div key={dayKey} className="day-group">
                <div className="day-header">
                  <div className="day-header-content">
                    <h3 className="day-title">{dayKey}</h3>
                    <span className="activity-count">
                      {groupedActivities[dayKey].length} activit
                      {groupedActivities[dayKey].length !== 1 ? "ies" : "y"}
                    </span>
                  </div>
                </div>

                <div className="day-activities">
                  {groupedActivities[dayKey].map((activity) => (
                    <div
                      key={activity.id}
                      className={`activity-card ${
                        activity.completed ? "completed" : ""
                      }`}
                    >
                      {/* Left Checkbox Section */}
                      <div className="activity-checkbox">
                        <input
                          type="checkbox"
                          checked={activity.completed || false}
                          onChange={() => onToggleComplete(activity.id)}
                          className="checkbox-input"
                        />
                      </div>

                      {/* Main Content Section */}
                      <div className="activity-content">
                        <div className="activity-header-row">
                          <div className="activity-title-section">
                            <h4 className="activity-title">
                              {activity.activity}
                            </h4>
                            {activity.category && (
                              <span
                                className="activity-category-badge"
                                style={{
                                  backgroundColor: getCategoryColor(
                                    activity.category
                                  ),
                                }}
                              >
                                {activity.category}
                              </span>
                            )}
                          </div>
                          <div className="activity-time">
                            🕐 {activity.time}
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="activity-details-grid">
                          {activity.location && (
                            <div className="detail-item">
                              <span className="detail-label">📍 Location:</span>
                              <span className="detail-value">
                                {activity.location}
                              </span>
                            </div>
                          )}
                          {activity.budget && (
                            <div className="detail-item">
                              <span className="detail-label">💵 Budget:</span>
                              <span className="detail-value detail-budget">
                                ${activity.budget}
                              </span>
                            </div>
                          )}
                          {activity.notes && (
                            <div className="detail-item full-width">
                              <span className="detail-label">📝 Notes:</span>
                              <span className="detail-value">
                                {activity.notes}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons Section */}
                      <div className="activity-actions">
                        <button
                          onClick={() => onEditActivity(activity)}
                          className="action-btn edit-btn"
                          title="Edit activity"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => onDeleteActivity(activity.id)}
                          className="action-btn delete-btn"
                          title="Delete activity"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get category colors
const getCategoryColor = (category) => {
  const colors = {
    food: "#ffd166",
    transport: "#ef4444",
    accommodation: "#02c39a",
    activities: "#8b5cf6",
    shopping: "#10b981",
    other: "#05668d",
  };
  return colors[category] || "#05668d";
};

export default ItinerarySection;
