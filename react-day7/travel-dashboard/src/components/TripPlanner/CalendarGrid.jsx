// src/components/TripPlanner/CalendarGrid.jsx

import React, { useState } from "react";
import { WEEKDAY_NAMES, getCategoryColor } from "./constants";
import DayActivityPopover from "./DayActivityPopover";

const CalendarGrid = ({
  days,
  activities,
  onAddActivity,
  onEditActivity,
  currentMonth,
}) => {
  const [hoveredDay, setHoveredDay] = useState(null);

  const getActivitiesForDay = (day) => {
    return activities
      .filter((a) => a.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <>
      {/* Weekday Headers */}
      <div className="calendar-weekdays">
        {WEEKDAY_NAMES.map((day) => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {days.map((day, idx) => {
          const dayActivities = day ? getActivitiesForDay(day) : [];
          const isTodayCell = day && isToday(day);

          const cellClassName = `calendar-day-cell ${!day ? "empty-day" : ""} ${
            isTodayCell ? "today-day" : ""
          } ${dayActivities.length > 0 ? "has-activities" : ""}`;

          return (
            <div
              key={idx}
              className={cellClassName}
              onMouseEnter={() =>
                day && dayActivities.length > 0 && setHoveredDay(day)
              }
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => day && onAddActivity(day)}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  <div className="day-activities">
                    {dayActivities.slice(0, 2).map((activity, i) => (
                      <div
                        key={i}
                        className="activity-badge"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditActivity(activity);
                        }}
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

                  {/* Activity Popover */}
                  {hoveredDay === day && dayActivities.length > 0 && (
                    <DayActivityPopover
                      day={day}
                      activities={dayActivities}
                      onEditActivity={onEditActivity}
                    />
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
