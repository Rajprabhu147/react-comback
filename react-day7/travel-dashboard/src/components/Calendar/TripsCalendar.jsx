import React, { useEffect, useState, useMemo } from "react";
import "../../styles/calendar.css";

/**
 * TripsCalendar Component
 *
 * - Reads items from localStorage key "tripItineraryItems"
 * - Listens for 'itinerary-updated' events to refresh items
 * - Clicking on a calendar day prompts the user to add a new activity
 *   (simple prompt flow). Created item is saved to localStorage and an
 *   'itinerary-updated' event is dispatched so the list updates.
 *
 * Note: this implementation uses browser prompts for a lightweight add flow.
 * You can replace prompt() with a nicer modal component later.
 */

const STORAGE_KEY = "tripItineraryItems";

const TripsCalendar = ({ trips = [] }) => {
  // We allow optional incoming `trips` prop; but primary source is localStorage
  const [currentDate, setCurrentDate] = useState(new Date());
  const [localTrips, setLocalTrips] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : trips || [];
    } catch (e) {
      console.error("Failed to parse trips from localStorage", e);
      return trips || [];
    }
  });

  // Keep in sync when parent passes trips prop (optional)
  useEffect(() => {
    if (Array.isArray(trips) && trips.length > 0) {
      setLocalTrips(trips);
    }
  }, [trips]);

  // Listen for external updates (ItineraryItemsList dispatches 'itinerary-updated')
  useEffect(() => {
    function handleUpdate() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setLocalTrips(raw ? JSON.parse(raw) : []);
      } catch (e) {
        console.error("Failed to reload trips after update", e);
      }
    }
    window.addEventListener("itinerary-updated", handleUpdate);
    return () => window.removeEventListener("itinerary-updated", handleUpdate);
  }, []);

  // Build tripsByDate map from localTrips (date in ISO yyyy-mm-dd expected; fallback to day)
  const tripsByDate = useMemo(() => {
    return localTrips.reduce((acc, trip) => {
      // prefer trip.date (ISO), else if trip.day present create ISO from current month/year
      let dateStr = null;
      if (trip.date) {
        dateStr = new Date(trip.date).toISOString().split("T")[0];
      } else if (typeof trip.day !== "undefined" && trip.day !== null) {
        // try to map 'day' (1..n) to the current month year shown in calendar
        const d = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          Number(trip.day)
        );
        if (!isNaN(d.getTime())) dateStr = d.toISOString().split("T")[0];
      }
      if (!dateStr) return acc;
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(trip);
      return acc;
    }, {});
  }, [localTrips, currentDate]);

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
  for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
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

  // Lightweight save: push item into localStorage and dispatch event
  const saveNewItem = (item) => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const newList = [...list, item];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
      // update our local state immediately
      setLocalTrips(newList);
      // notify other components
      window.dispatchEvent(
        new CustomEvent("itinerary-updated", { detail: { source: "calendar" } })
      );
    } catch (e) {
      console.error("Failed to save new itinerary item", e);
    }
  };

  // When user clicks a date we ask for activity and time (simple prompt flow)
  const handleAddOnDate = async (day) => {
    if (!day) return;
    const dateISO = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];

    // Prompt for activity title
    const title = window.prompt(
      `Add activity for ${dateISO}\nEnter activity title:`
    );
    if (!title || !title.trim()) return;

    // Optional: prompt for time
    const time = window.prompt("Enter time (HH:MM) or leave empty:", "");

    // Optional: category selection basic
    const category = window.prompt(
      "Enter category (sightseeing/dining/transport/activity) or leave empty:",
      "activity"
    );

    // Create item with shape your list expects
    const newItem = {
      id: Date.now(),
      date: dateISO, // ISO date
      // keep 'day' numeric (this is what your ItineraryItemsList groups by)
      day: day,
      time: (time || "").trim(),
      activity: title.trim(),
      location: "",
      category: category || "activity",
      notes: "",
      completed: false,
    };

    saveNewItem(newItem);
  };

  return (
    <div className="trips-calendar">
      <div className="calendar-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={handlePrevMonth} className="nav-btn">
            ←
          </button>
          <h3 className="month-year" style={{ margin: 0 }}>
            {monthYear}
          </h3>
          <button onClick={handleNextMonth} className="nav-btn">
            →
          </button>
        </div>
        <div>
          <button onClick={handleToday} className="today-btn">
            Today
          </button>
        </div>
      </div>

      <div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dayName) => (
          <div key={dayName} className="weekday">
            {dayName}
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
              onClick={() => day && handleAddOnDate(day)}
              role={day ? "button" : "presentation"}
              tabIndex={day ? 0 : -1}
              onKeyDown={(e) => {
                if (day && (e.key === "Enter" || e.key === " "))
                  handleAddOnDate(day);
              }}
              aria-label={
                day
                  ? `Day ${day}. ${tripsOnDay.length} activities`
                  : "Empty cell"
              }
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>
                  {tripsOnDay.length > 0 && (
                    <div className="trip-indicators">
                      {tripsOnDay.slice(0, 3).map((trip, idx) => (
                        <div
                          key={idx}
                          className="trip-dot"
                          title={trip.activity || trip.name || ""}
                        >
                          {trip.activity
                            ? trip.activity.charAt(0).toUpperCase()
                            : "•"}
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
