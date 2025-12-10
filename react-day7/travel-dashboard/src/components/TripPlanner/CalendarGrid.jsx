// src/components/TripPlanner/CalendarGrid.jsx

import React, { useState } from "react";
import { WEEKDAY_NAMES, getCategoryColor } from "./constants";
import "../../styles/calendar-grid.css";

/**
 * CalendarGrid Component
 *
 * Displays a calendar with trip activities
 * - Shows all days of the month
 * - Displays activities as colored badges
 * - Past days are disabled (read-only)
 * - Users can only add/edit activities for today and future days
 */
const CalendarGrid = ({
  days,
  activities,
  onAddActivity,
  onEditActivity,
  currentMonth,
}) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  /**
   * Get all activities for a specific day, sorted by time
   */
  const getActivitiesForDay = (day) => {
    return activities
      .filter((a) => a.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  /**
   * Check if a day is today
   */
  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  /**
   * Check if a day is in the past
   * Past days are disabled for adding/editing activities
   */
  const isPastDay = (day) => {
    if (!day) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const cellDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    cellDate.setHours(0, 0, 0, 0);

    return cellDate < today;
  };

  /**
   * Handle day click - only allow adding activity if not a past day
   */
  const handleDayClick = (day) => {
    if (!isPastDay(day)) {
      onAddActivity(day);
    }
  };

  /**
   * Handle activity click - only allow editing if not a past day
   */
  const handleActivityClick = (e, activity, isPast) => {
    e.stopPropagation();
    if (!isPast) {
      onEditActivity(activity);
    }
  };

  return (
    <>
      {/* Weekday Headers (Mon, Tue, Wed, etc.) */}
      <div className="calendar-weekdays">
        {WEEKDAY_NAMES.map((day) => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid - Shows all days of the month */}
      <div className="calendar-grid">
        {days.map((day, idx) => {
          const dayActivities = day ? getActivitiesForDay(day) : [];
          const isTodayCell = day && isToday(day);
          const isPast = day && isPastDay(day);

          // Build className with all relevant states
          const cellClassName = `calendar-day-cell ${!day ? "empty-day" : ""} ${
            isTodayCell ? "today-day" : ""
          } ${dayActivities.length > 0 ? "has-activities" : ""} ${
            isPast ? "past-day" : ""
          }`;

          return (
            <div
              key={idx}
              className={cellClassName}
              onMouseEnter={() =>
                day && !isPast && dayActivities.length > 0 && setHoveredDay(day)
              }
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => handleDayClick(day)}
            >
              {day && (
                <>
                  {/* Day Number */}
                  <div className="day-number">{day}</div>

                  {/* Activity Badges (max 2 shown, rest in "more" badge) */}
                  <div className="day-activities">
                    {dayActivities.slice(0, 2).map((activity, i) => (
                      <div
                        key={i}
                        className="activity-badge"
                        onClick={(e) =>
                          handleActivityClick(e, activity, isPast)
                        }
                        title={activity.activity}
                        style={{
                          backgroundColor: getCategoryColor(activity.category),
                        }}
                      >
                        {activity.activity}
                      </div>
                    ))}
                    {dayActivities.length > 2 && (
                      <div className="more-activities-badge">
                        +{dayActivities.length - 2} more
                      </div>
                    )}
                  </div>

                  {/* Activity Tooltip - Shows on hover for non-past days */}
                  {hoveredDay === day &&
                    !isPast &&
                    dayActivities.length > 0 && (
                      <div className="activity-tooltip">
                        <div className="tooltip-header">
                          {dayActivities.length} Activity
                          {dayActivities.length > 1 ? "ies" : ""}
                        </div>
                        <div className="tooltip-activities">
                          {dayActivities.map((activity, i) => (
                            <div key={i} className="tooltip-activity">
                              <div
                                className="tooltip-activity-dot"
                                style={{
                                  backgroundColor: getCategoryColor(
                                    activity.category
                                  ),
                                }}
                              ></div>
                              <div className="tooltip-activity-content">
                                <div className="tooltip-activity-title">
                                  {activity.activity}
                                </div>
                                <div className="tooltip-activity-details">
                                  <span className="tooltip-time">
                                    {activity.time}
                                  </span>
                                  <span className="tooltip-category">
                                    {activity.category}
                                  </span>
                                </div>
                              </div>
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
    </>
  );
};

export default CalendarGrid;
