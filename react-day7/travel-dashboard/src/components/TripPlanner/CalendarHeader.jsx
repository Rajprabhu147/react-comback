// src/components/TripPlanner/CalendarHeader.jsx

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES } from "./constants";

const CalendarHeader = ({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
}) => {
  return (
    <div className="calendar-controls">
      <h2 className="calendar-month-title">
        {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
      </h2>
      <div className="calendar-nav-buttons">
        <button onClick={onPrevMonth} className="nav-button prev-btn">
          <ChevronLeft size={20} />
        </button>
        <button onClick={onToday} className="nav-button today-btn">
          Today
        </button>
        <button onClick={onNextMonth} className="nav-button next-btn">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;
