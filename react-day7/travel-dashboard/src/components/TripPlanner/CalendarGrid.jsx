import React, { useState } from "react";
import { WEEKDAY_NAMES, getCategoryColor } from "./constants";
import "../../styles/calendar-grid.css";

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

  const handleDayClick = (day) => {
    if (day && isPastDay(day)) {
      alert("You can't add activity on passed days");
      return;
    }
    if (day) {
      onAddActivity(day);
    }
  };

  const handleActivityClick = (e, activity, isPast) => {
    e.stopPropagation();
    if (isPast) {
      alert("You can't edit activity on passed days");
      return;
    }
    onEditActivity(activity);
  };

  return (
    <>
      {/* Weekday Headers */}
      <div className="calendar-day-labels">
        {WEEKDAY_NAMES.map((day) => (
          <div key={day} className="day-label">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid">
        {days.map((day, idx) => {
          const dayActivities = day ? getActivitiesForDay(day) : [];
          const isTodayCell = day && isToday(day);
          const isPast = day && isPastDay(day);

          const cellClassName = `calendar-day ${!day ? "empty-day" : ""} ${
            isTodayCell ? "today-day" : ""
          } ${dayActivities.length > 0 ? "has-activities" : ""} ${
            isPast ? "past-day" : "active-day"
          }`;

          return (
            <div
              key={idx}
              className={cellClassName}
              onMouseEnter={() => setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() => handleDayClick(day)}
              title={isPast ? "This day has passed. No changes allowed." : ""}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>

                  {!isPast && (
                    <button className="add-activity-btn" title="Add activity">
                      +
                    </button>
                  )}

                  {/* Activity Tooltip - Only show for future days */}
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
                              <div>
                                <div className="tooltip-activity-title">
                                  {activity.activity}
                                </div>
                                <div className="tooltip-activity-time">
                                  {activity.time}
                                </div>
                              </div>
                              <button
                                className="tooltip-remove-btn"
                                onClick={(e) =>
                                  handleActivityClick(e, activity, isPast)
                                }
                                title="Edit activity"
                              >
                                ✎
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Show activities on past days - read only */}
                  {hoveredDay === day && isPast && dayActivities.length > 0 && (
                    <div className="activity-tooltip past-activities-tooltip">
                      <div className="tooltip-header">
                        {dayActivities.length} Activity
                        {dayActivities.length > 1 ? "ies" : ""}
                      </div>
                      <div className="tooltip-activities">
                        {dayActivities.map((activity, i) => (
                          <div key={i} className="tooltip-activity">
                            <div>
                              <div className="tooltip-activity-title">
                                {activity.activity}
                              </div>
                              <div className="tooltip-activity-time">
                                {activity.time}
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
