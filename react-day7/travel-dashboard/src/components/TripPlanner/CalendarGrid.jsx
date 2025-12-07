// src/components/TripPlanner/CalendarGrid.jsx

import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import "../styles/calendar-grid.css";

const CalendarGrid = ({
  days,
  activities,
  onAddActivity,
  onEditActivity,
  currentMonth,
}) => {
  const [hoveredDate, setHoveredDate] = useState(null);
  const [activityInput, setActivityInput] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showInput, setShowInput] = useState(false);

  const getDateKey = (day) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };

  const getActivitiesForDate = (day) => {
    if (!day) return [];
    const dateKey = getDateKey(day);
    return activities.filter((activity) => activity.date === dateKey);
  };

  const handleAddActivity = (day) => {
    setSelectedDate(day);
    setShowInput(true);
  };

  const handleSaveActivity = (day) => {
    if (!activityInput.trim()) return;

    const dateKey = getDateKey(day);
    const newActivity = {
      id: Date.now(),
      date: dateKey,
      title: activityInput.trim(),
      description: "",
      time: "9:00 AM",
    };

    onAddActivity(newActivity);
    setActivityInput("");
    setShowInput(false);
    setSelectedDate(null);
  };

  const handleRemoveActivity = (activityId) => {
    onEditActivity(activityId, { deleted: true });
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="calendar-grid-container">
      {/* Day Labels */}
      <div className="calendar-day-labels">
        {dayLabels.map((label) => (
          <div key={label} className="day-label">
            {label}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {days.map((day, index) => {
          const dayActivities = getActivitiesForDate(day);
          const hasActivities = dayActivities.length > 0;

          return (
            <div
              key={index}
              className={`calendar-day ${day ? "active-day" : "empty-day"} ${
                hasActivities ? "has-activities" : ""
              }`}
              onMouseEnter={() => day && setHoveredDate(day)}
              onMouseLeave={() => setHoveredDate(null)}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>

                  {/* Activity Indicators */}
                  <div className="activity-indicators">
                    {dayActivities.slice(0, 2).map((activity) => (
                      <div
                        key={activity.id}
                        className="activity-indicator"
                        title={activity.title}
                      >
                        {activity.title.charAt(0)}
                      </div>
                    ))}
                    {dayActivities.length > 2 && (
                      <div className="activity-indicator more">
                        +{dayActivities.length - 2}
                      </div>
                    )}
                  </div>

                  {/* Add Activity Button */}
                  {!showInput && (
                    <button
                      className="add-activity-btn"
                      onClick={() => handleAddActivity(day)}
                      title="Add activity"
                    >
                      <Plus size={14} />
                    </button>
                  )}

                  {/* Activity Input */}
                  {showInput && selectedDate === day && (
                    <div className="activity-input-wrapper">
                      <input
                        type="text"
                        value={activityInput}
                        onChange={(e) => setActivityInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveActivity(day);
                          if (e.key === "Escape") {
                            setShowInput(false);
                            setActivityInput("");
                          }
                        }}
                        placeholder="Activity name"
                        className="activity-input"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveActivity(day)}
                        className="save-activity-btn"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  )}

                  {/* Tooltip on Hover */}
                  {hoveredDate === day && dayActivities.length > 0 && (
                    <div className="activity-tooltip">
                      <div className="tooltip-header">
                        {dayActivities.length} Activity
                        {dayActivities.length > 1 ? "ies" : ""}
                      </div>
                      <div className="tooltip-activities">
                        {dayActivities.map((activity) => (
                          <div key={activity.id} className="tooltip-activity">
                            <div className="tooltip-activity-title">
                              {activity.title}
                            </div>
                            {activity.time && (
                              <div className="tooltip-activity-time">
                                {activity.time}
                              </div>
                            )}
                            <button
                              className="tooltip-remove-btn"
                              onClick={() => handleRemoveActivity(activity.id)}
                              title="Remove activity"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarGrid;
