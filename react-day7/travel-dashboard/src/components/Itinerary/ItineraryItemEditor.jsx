// src/components/Itinerary/ItineraryItemEditor.jsx
import React, { useState, useEffect } from "react";
import { Clock, MapPin, DollarSign, Users, X } from "lucide-react";
import "../../styles/itinerary-editor.css";

/**
 * ItineraryItemEditor
 * Modal for creating or editing itinerary activities
 *
 * Enhancements:
 * - Adds a mini date selector (date input + month/year dropdowns)
 * - Keeps `date` (ISO) and numeric `day` synchronized
 * - Saves both `date` and `day` so calendar + list can use either
 */

const DEFAULT_FORM = {
  day: 1,
  date: "", // ISO yyyy-mm-dd (optional)
  time: "09:00",
  activity: "",
  location: "",
  category: "sightseeing",
  budget: "",
  travelers: "",
  notes: "",
};

const CATEGORIES = [
  { value: "sightseeing", label: "🏛️ Sightseeing", color: "#05668d" },
  { value: "dining", label: "🍽️ Dining", color: "#ffd166" },
  { value: "accommodation", label: "🏨 Accommodation", color: "#02c39a" },
  { value: "transport", label: "🚗 Transport", color: "#ef4444" },
  { value: "shopping", label: "🛍️ Shopping", color: "#10b981" },
  { value: "activity", label: "⚡ Activity", color: "#8b5cf6" },
];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEAR_RANGE = 3; // years before/after current for dropdown

const ItineraryItemEditor = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState(() =>
    item ? { ...DEFAULT_FORM, ...item } : { ...DEFAULT_FORM }
  );
  const [errors, setErrors] = useState({});

  // Populate date components from existing date if present
  useEffect(() => {
    if (item) {
      const merged = { ...DEFAULT_FORM, ...item };
      setFormData(merged);
    } else {
      setFormData({ ...DEFAULT_FORM });
    }
    setErrors({});
  }, [item]);

  // Helpers to parse and build ISO date
  const isoFromParts = (y, mIndex, d) => {
    if (!y || typeof mIndex === "undefined" || !d) return "";
    const paddedM = String(mIndex + 1).padStart(2, "0");
    const paddedD = String(d).padStart(2, "0");
    return `${y}-${paddedM}-${paddedD}`;
  };

  const parseISO = (iso) => {
    if (!iso) return null;
    const parts = iso.split("-");
    if (parts.length !== 3) return null;
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
    return { year: y, monthIndex: m, day: d };
  };

  // When user changes the date input, sync day/month/year
  const handleDateInputChange = (e) => {
    const val = e.target.value; // yyyy-mm-dd
    setFormData((prev) => {
      const parsed = parseISO(val);
      return {
        ...prev,
        date: val,
        day: parsed ? parsed.day : prev.day,
      };
    });
    if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
  };

  // When user changes the numeric day, update date if possible (use current month/year or existing date)
  const handleDayChange = (e) => {
    let dayVal = e.target.value;
    // prevent negative / zero
    if (dayVal === "") {
      setFormData((p) => ({ ...p, day: "" }));
      return;
    }
    dayVal = Math.max(1, Number(dayVal));
    // find month/year from existing date or fallback to today
    const parsed = parseISO(formData.date);
    const baseYear = parsed ? parsed.year : new Date().getFullYear();
    const baseMonth = parsed ? parsed.monthIndex : new Date().getMonth();
    const newIso = isoFromParts(baseYear, baseMonth, dayVal);
    setFormData((prev) => ({
      ...prev,
      day: dayVal,
      date: newIso,
    }));
    if (errors.day) setErrors((p) => ({ ...p, day: undefined }));
  };

  // Month change: update date using selected month and current day/year
  const handleMonthChange = (e) => {
    const monthIndex = Number(e.target.value);
    const parsed = parseISO(formData.date);
    const year = parsed ? parsed.year : new Date().getFullYear();
    const day = formData.day || (parsed ? parsed.day : 1);
    const newIso = isoFromParts(year, monthIndex, day);
    setFormData((prev) => ({ ...prev, date: newIso }));
    if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
  };

  // Year change: update date using selected year and current month/day
  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    const parsed = parseISO(formData.date);
    const monthIndex = parsed ? parsed.monthIndex : new Date().getMonth();
    const day = formData.day || (parsed ? parsed.day : 1);
    const newIso = isoFromParts(year, monthIndex, day);
    setFormData((prev) => ({ ...prev, date: newIso }));
    if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
  };

  // Generic change for other inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.activity || !formData.activity.trim()) {
      newErrors.activity = "Activity name is required";
    }
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    // Ensure day is a positive integer
    if (!formData.day || Number(formData.day) < 1) {
      newErrors.day = "Day must be 1 or greater";
    }
    // If date exists, validate it
    if (formData.date) {
      const parsed = parseISO(formData.date);
      if (!parsed) newErrors.date = "Invalid date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Ensure item has id (use existing if editing)
    const payload = {
      ...formData,
      id: item?.id || Date.now(),
    };

    onSave(payload);
  };

  const isEditing = !!item?.id;

  // derive month/year dropdown values from date or fallback to today
  const parsed = parseISO(formData.date);
  const selectedYear = parsed ? parsed.year : new Date().getFullYear();
  const selectedMonthIndex = parsed ? parsed.monthIndex : new Date().getMonth();

  // build year options
  const curYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: YEAR_RANGE * 2 + 1 },
    (_, i) => curYear - YEAR_RANGE + i
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal itinerary-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Edit Activity" : "Add Activity"}
          </h2>
          <button onClick={onClose} className="close-btn" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="modal-body">
            {/* Date selector row: Date input + Month + Year + Day */}
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date || ""}
                  onChange={handleDateInputChange}
                  className="form-input"
                />
                {errors.date && (
                  <span className="error-text">{errors.date}</span>
                )}
              </div>

              <div className="form-group" style={{ minWidth: 120 }}>
                <label className="form-label">Month</label>
                <select
                  name="month"
                  value={selectedMonthIndex}
                  onChange={handleMonthChange}
                  className="form-select"
                >
                  {monthNames.map((m, idx) => (
                    <option key={m} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ minWidth: 120 }}>
                <label className="form-label">Year</label>
                <select
                  name="year"
                  value={selectedYear}
                  onChange={handleYearChange}
                  className="form-select"
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ minWidth: 100 }}>
                <label className="form-label">Day *</label>
                <input
                  type="number"
                  name="day"
                  value={formData.day}
                  onChange={handleDayChange}
                  min="1"
                  className="form-input"
                />
                {errors.day && <span className="error-text">{errors.day}</span>}
              </div>
            </div>

            {/* Time */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <Clock size={16} /> Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="form-input"
                />
                {errors.time && (
                  <span className="error-text">{errors.time}</span>
                )}
              </div>
            </div>

            {/* Activity Name */}
            <div className="form-group">
              <label className="form-label">Activity Name *</label>
              <input
                type="text"
                name="activity"
                value={formData.activity}
                onChange={handleChange}
                placeholder="e.g., Visit Eiffel Tower"
                className="form-input"
              />
              {errors.activity && (
                <span className="error-text">{errors.activity}</span>
              )}
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">
                <MapPin size={16} /> Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Paris, France"
                className="form-input"
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget and Travelers Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} /> Budget (USD)
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="0"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  <Users size={16} /> Travelers
                </label>
                <input
                  type="number"
                  name="travelers"
                  value={formData.travelers}
                  onChange={handleChange}
                  placeholder="1"
                  className="form-input"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any additional details..."
                className="form-textarea"
                rows="4"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {isEditing ? "Update Activity" : "Add Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItineraryItemEditor;
