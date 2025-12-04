import React, { useEffect, useRef, useState, useMemo } from "react";
import "../../styles/calendar.css";

/**
 * TripsCalendar Component (hover popover version)
 *
 * - Hovering a day with activities shows a floating overlay with the day's activities.
 * - The overlay is absolutely positioned inside the calendar container so it doesn't
 *   affect layout or push other elements.
 * - Clicking a day still dispatches 'itinerary-open-editor' with { dateISO, day }.
 */

const STORAGE_KEY = "tripItineraryItems";

const TripsCalendar = ({ trips = [] }) => {
  const containerRef = useRef(null);

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

  // Hover state holds data and rect for the hovered cell
  const [hovered, setHovered] = useState(null);
  // hovered: { dateISO: "2025-12-01", items: [...], rect: DOMRect }

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
      let dateStr = null;
      if (trip.date) {
        dateStr = new Date(trip.date).toISOString().split("T")[0];
      } else if (typeof trip.day !== "undefined" && trip.day !== null) {
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

  // When user clicks a date, dispatch an event so the list opens editor prefilled
  const handleOpenEditorForDate = (day) => {
    if (!day) return;
    const dateISO = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    window.dispatchEvent(
      new CustomEvent("itinerary-open-editor", { detail: { dateISO, day } })
    );
  };

  // Mouse enter handler to compute rect and set hovered data
  const handleMouseEnterCell = (e, day) => {
    if (!day) return;
    const cell = e.currentTarget;
    const rect = cell.getBoundingClientRect();
    const containerRect = containerRef.current
      ? containerRef.current.getBoundingClientRect()
      : { left: 0, top: 0 };
    const dateISO = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
      .toISOString()
      .split("T")[0];
    const items = getTripsForDay(day);
    // compute position relative to container
    const relative = {
      top: rect.top - containerRect.top,
      left: rect.left - containerRect.left,
      width: rect.width,
      height: rect.height,
      pageLeft: rect.left,
      pageTop: rect.top,
    };
    setHovered({ dateISO, items, rect: relative });
  };

  const handleMouseLeaveCell = () => {
    setHovered(null);
  };

  // Popover positioning (clamped inside container)
  const computePopoverStyle = () => {
    if (!hovered || !containerRef.current) return { display: "none" };
    const containerRect = containerRef.current.getBoundingClientRect();
    const popoverWidth = 260; // px (approx)
    const popoverHeight = Math.min(240, 48 + hovered.items.length * 40); // dynamic
    // default: place above the cell if enough space, else below
    const preferredTop =
      hovered.rect.pageTop - containerRect.top - popoverHeight - 8; // above
    const fallbackTop =
      hovered.rect.pageTop - containerRect.top + hovered.rect.height + 8; // below
    const canPlaceAbove = preferredTop >= 0;
    const top = canPlaceAbove ? preferredTop : fallbackTop;

    // horizontally center popover on cell; clamp within container width
    const cellCenter = hovered.rect.left + hovered.rect.width / 2;
    const leftUnclamped = cellCenter - popoverWidth / 2;
    const maxLeft = containerRect.width - popoverWidth - 8;
    const leftClamped = Math.max(8, Math.min(leftUnclamped, maxLeft));

    return {
      display: "block",
      position: "absolute",
      top: `${top}px`,
      left: `${leftClamped}px`,
      width: `${popoverWidth}px`,
      maxHeight: `${popoverHeight}px`,
      overflowY: "auto",
      zIndex: 60,
    };
  };

  return (
    <div
      className="trips-calendar"
      ref={containerRef}
      style={{ position: "relative" }}
    >
      <div className="calendar-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={handlePrevMonth}
            className="nav-btn"
            aria-label="Previous month"
          >
            ←
          </button>
          <h3 className="month-year" style={{ margin: 0 }}>
            {monthYear}
          </h3>
          <button
            onClick={handleNextMonth}
            className="nav-btn"
            aria-label="Next month"
          >
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

      <div className="calendar-grid" role="grid" aria-label="Trip calendar">
        {days.map((day, index) => {
          const tripsOnDay = day ? getTripsForDay(day) : [];
          const isToday =
            day &&
            day === new Date().getDate() &&
            currentDate.getMonth() === new Date().getMonth() &&
            currentDate.getFullYear() === new Date().getFullYear();

          // fallback title
          const titleText =
            tripsOnDay.length > 0
              ? tripsOnDay
                  .map((t) => `${t.time ? t.time + " • " : ""}${t.activity}`)
                  .join("\n")
              : "";

          return (
            <div
              key={index}
              className={`calendar-day ${!day ? "empty" : ""} ${
                isToday ? "today" : ""
              } ${tripsOnDay.length > 0 ? "has-trips" : ""}`}
              onClick={() => handleOpenEditorForDate(day)}
              role={day ? "button" : "presentation"}
              tabIndex={day ? 0 : -1}
              onKeyDown={(e) => {
                if (day && (e.key === "Enter" || e.key === " "))
                  handleOpenEditorForDate(day);
              }}
              aria-label={
                day
                  ? `Day ${day}. ${tripsOnDay.length} activities`
                  : "Empty cell"
              }
              onMouseEnter={(e) => handleMouseEnterCell(e, day)}
              onMouseLeave={handleMouseLeaveCell}
              title={titleText}
            >
              {day && (
                <>
                  <div className="day-number">{day}</div>

                  {tripsOnDay.length > 0 && (
                    <div className="trip-indicators" aria-hidden>
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

      {/* Floating popover overlay (absolutely positioned inside container) */}
      {hovered && hovered.items && hovered.items.length > 0 && (
        <div
          className="calendar-hover-popover floating"
          style={computePopoverStyle()}
          role="dialog"
          aria-hidden="false"
          onMouseEnter={() => {
            /* keep popover visible while hovering popover itself */
            // Prevent premature hide by setting hovered to same value if needed.
          }}
        >
          <div className="popover-header">
            <strong>{hovered.dateISO}</strong>
          </div>
          <div className="popover-body">
            {hovered.items.map((t, idx) => (
              <div key={idx} className="popover-row">
                <div className="popover-title">{t.activity || "Untitled"}</div>
                <div className="popover-time">{t.time || "—"}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsCalendar;
