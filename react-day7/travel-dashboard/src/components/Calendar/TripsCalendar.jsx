import React, { useContext, useMemo, useState } from "react";
import { ItineraryContext } from "../../context/ItineraryContext";
import "../../styles/calendar.css";

const categoryColorMap = {
  sightseeing: "#0ea5a4",
  dining: "#f59e0b",
  transport: "#3b82f6",
  lodging: "#8b5cf6",
  default: "#64748b",
};

function groupEventsByDate(items, dayToISO) {
  const map = {};
  items.forEach((it) => {
    const date =
      it.date ??
      (it.day && typeof it.day !== "string"
        ? dayToISO(it.day)
        : it.day ?? null) ??
      null;
    if (!date) return;
    if (!map[date]) map[date] = [];
    map[date].push(it);
  });
  return map;
}

const TripsCalendar = ({
  year: propYear,
  month: propMonth,
  onOpenItem,
  onCreateAtDate,
}) => {
  const { items, openEditor, dayToISO } = useContext(ItineraryContext);
  const today = new Date();
  const year = propYear ?? today.getFullYear();
  const month = propMonth ?? today.getMonth();

  const eventsByDate = useMemo(
    () => groupEventsByDate(items, dayToISO),
    [items, dayToISO]
  );

  const [selectedDate, setSelectedDate] = useState(null);

  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];

  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  function iso(dt) {
    return dt.toISOString().slice(0, 10);
  }

  function handleOpen(id) {
    if (onOpenItem) onOpenItem(id);
    else openEditor(id);
  }

  function handleCreate(dateISO) {
    if (onCreateAtDate) onCreateAtDate(dateISO);
    else openEditor(null);
  }

  return (
    <div className="trips-calendar card">
      <div className="calendar-header">
        <h4>
          {first.toLocaleString(undefined, { month: "long" }) + " " + year}
        </h4>
      </div>

      <div className="calendar-grid">
        <div className="calendar-weekdays">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
            <div key={w} className="calendar-weekday">
              {w}
            </div>
          ))}
        </div>

        <div className="calendar-cells">
          {cells.map((cell, i) => {
            if (!cell)
              return <div key={i} className="calendar-cell empty"></div>;

            const dateISO = iso(cell);
            const events = eventsByDate[dateISO] ?? [];

            return (
              <div key={dateISO} className="calendar-cell">
                <div className="calendar-day-header">
                  <span className="calendar-day-number">{cell.getDate()}</span>
                  <button
                    className="calendar-add-btn"
                    onClick={() => handleCreate(dateISO)}
                  >
                    +
                  </button>
                </div>

                <div className="calendar-dots">
                  {events.slice(0, 3).map((ev) => {
                    const color =
                      categoryColorMap[ev.category] ?? categoryColorMap.default;
                    return (
                      <button
                        key={ev.id}
                        className="trip-dot"
                        style={{ background: color }}
                        title={ev.activity}
                        onClick={() => handleOpen(ev.id)}
                      />
                    );
                  })}

                  {events.length > 3 && (
                    <button
                      className="more-trips"
                      onClick={() => setSelectedDate(dateISO)}
                    >
                      +{events.length - 3}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="calendar-popover">
          <div className="popover-header">
            <strong>{selectedDate}</strong>
            <button onClick={() => setSelectedDate(null)}>Close</button>
          </div>
          <div className="popover-body">
            {(eventsByDate[selectedDate] ?? []).map((ev) => (
              <div key={ev.id} className="popover-row">
                <div>
                  <div className="popover-title">{ev.activity}</div>
                  <div className="popover-meta">
                    {ev.time} • {ev.location}
                  </div>
                </div>
                <button onClick={() => handleOpen(ev.id)}>Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripsCalendar;
