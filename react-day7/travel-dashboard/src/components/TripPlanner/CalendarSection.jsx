import React, { useState } from "react";
import CalendarHeader from "./CalendarHeader";
import CalendarGrid from "./CalendarGrid";

/**
 * CalendarSection Component
 *
 * Main container for the trip activity planner calendar
 * Automatically synced with real-world calendar
 * - Opens to current month
 * - Today button goes to today's date
 * - Can navigate forward/backward
 */
const CalendarSection = ({ activities, onAddActivity, onEditActivity }) => {
  // State: current month being displayed (synced with real calendar)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get today's date with time reset for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /**
   * Navigate to previous month
   */
  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  /**
   * Navigate to next month
   */
  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  /**
   * Go back to today's month
   */
  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  /**
   * Generate array of days for the calendar grid
   * Includes empty cells for days from previous month
   */
  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  // Add empty cells for previous month
  for (let i = 0; i < firstDay; i++) days.push(null);

  // Add days of current month
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="planner-calendar-section">
      <div className="planner-header">
        <h3 className="planner-title">✈️ Trip Activity Planner</h3>
      </div>

      <CalendarHeader
        currentMonth={currentMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      <CalendarGrid
        days={days}
        activities={activities}
        onAddActivity={onAddActivity}
        onEditActivity={onEditActivity}
        currentMonth={currentMonth}
        today={today}
      />
    </div>
  );
};

export default CalendarSection;
