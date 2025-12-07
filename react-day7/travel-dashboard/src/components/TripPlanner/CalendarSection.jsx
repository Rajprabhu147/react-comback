// src/components/TripPlanner/CalendarSection.jsx

import React from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

const CalendarSection = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  activities,
  onAddActivity,
  onEditActivity,
}) => {
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="planner-calendar-section">
      <div className="planner-header">
        <h3 className="planner-title">✈️ Trip Activity Planner</h3>
      </div>

      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={onPrevMonth}
        onNextMonth={onNextMonth}
        onToday={onToday}
      />

      <CalendarGrid
        days={days}
        activities={activities}
        onAddActivity={onAddActivity}
        onEditActivity={onEditActivity}
        currentMonth={currentMonth}
      />
    </div>
  );
};

export default CalendarSection;
