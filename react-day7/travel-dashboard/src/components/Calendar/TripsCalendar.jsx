import React, { useState } from "react";
import "../../styles/calendar.css";

/**
 * TripsCalendar Component
 * Displays trips on a calendar with event indicators
 */
const TripsCalendar = ({ trips = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get trips organized by date (YYYY-MM-DD)
  const tripsByDate = trips.reduce((acc, trip) => {
    if (trip.date) {
      const dateStr = new Date(trip.date).toISOString().split("T")[0];
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(trip);
    }
    return acc;
  }, {});

  const monthYear = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
    );
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getTripsForDay = (day) => {
    if (!day) return [];
    const dateStr = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    return tripsByDate[dateStr] || [];
  };

  return (
    <div className="trips-calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="nav-btn">
          ←
        </button>
        <h3 className="month-year">{monthYear}</h3>
        <button onClick={handleNextMonth} className="nav-btn">
          →
        </button>
        <button onClick={handleToday} className="today-btn">
          Today
        </button>
      </div>

      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          const tripsOnDay = day ? getTripsForDay(day) : [];
          const isToday =
            day &&
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          return (
            <div
              key={index}
              className={`calendar-day ${!day ? "empty" : ""} ${
                isToday ? "today" : ""
              } ${tripsOnDay.length > 0 ? "has-trips" : ""}`}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  {tripsOnDay.length > 0 && (
                    <div className="trip-indicators">
                      {tripsOnDay.slice(0, 3).map((trip, idx) => (
                        <div key={idx} className="trip-dot" title={trip.name}>
                          {trip.name.charAt(0)}
                        </div>
                      ))}
                      {tripsOnDay.length > 3 && (
                        <span className="more-trips">
                          +{tripsOnDay.length - 3}
                        </span>
                      )}
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

export default TripsCalendar;
