// src/components/Itinerary/ItineraryItemEditor.jsx
import React, { useState, useEffect } from "react";
import { Clock, MapPin, DollarSign, Users, X } from "lucide-react";
import "../../styles/itinerary-editor.css";

const DEFAULT_FORM = {
  day: 1,
  date: "",
  time: "09:00",
  activity: "",
  location: "",
  category: "sightseeing",
  budget: "",
  travelers: "",
  notes: "",
};

const CATEGORIES = [
  { value: "sightseeing", label: "🏛️ Sightseeing" },
  { value: "dining", label: "🍽️ Dining" },
  { value: "accommodation", label: "🏨 Accommodation" },
  { value: "transport", label: "🚗 Transport" },
  { value: "shopping", label: "🛍️ Shopping" },
  { value: "activity", label: "⚡ Activity" },
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

const YEAR_RANGE = 3;

const ItineraryItemEditor = ({ item, onSave, onClose }) => {
  const [formData, setFormData] = useState(() =>
    item ? { ...DEFAULT_FORM, ...item } : { ...DEFAULT_FORM }
  );
  const [errors, setErrors] = useState({});

  // FIXED: no more direct setState → functional update used
  useEffect(() => {
    setFormData(() =>
      item ? { ...DEFAULT_FORM, ...item } : { ...DEFAULT_FORM }
    );
    setErrors({});
  }, [item]);

  // ---------------------------------------
  // DATE HELPERS
  // ---------------------------------------

  const isoFromParts = (y, mIndex, d) => {
    if (!y || mIndex === undefined || !d) return "";
    return `${y}-${String(mIndex + 1).padStart(2, "0")}-${String(d).padStart(
      2,
      "0"
    )}`;
  };

  const parseISO = (iso) => {
    if (!iso) return null;
    const [y, m, d] = iso.split("-").map(Number);
    if (!y || !m || !d) return null;
    return { year: y, monthIndex: m - 1, day: d };
  };

  // ---------------------------------------
  // FORM HANDLERS
  // ---------------------------------------

  const handleDateInputChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const parsed = parseISO(val);
      return {
        ...prev,
        date: val,
        day: parsed ? parsed.day : prev.day,
      };
    });
    setErrors((p) => ({ ...p, date: undefined }));
  };

  const handleDayChange = (e) => {
    let v = e.target.value;
    if (v === "") {
      setFormData((p) => ({ ...p, day: "" }));
      return;
    }

    v = Math.max(1, Number(v));
    const parsed = parseISO(formData.date);
    const y = parsed ? parsed.year : new Date().getFullYear();
    const m = parsed ? parsed.monthIndex : new Date().getMonth();
    const iso = isoFromParts(y, m, v);

    setFormData((p) => ({ ...p, day: v, date: iso }));
    setErrors((p) => ({ ...p, day: undefined }));
  };

  const handleMonthChange = (e) => {
    const monthIndex = Number(e.target.value);
    const parsed = parseISO(formData.date);
    const year = parsed ? parsed.year : new Date().getFullYear();
    const day = formData.day || (parsed ? parsed.day : 1);

    setFormData((p) => ({ ...p, date: isoFromParts(year, monthIndex, day) }));
    setErrors((p) => ({ ...p, date: undefined }));
  };

  const handleYearChange = (e) => {
    const year = Number(e.target.value);
    const parsed = parseISO(formData.date);
    const m = parsed ? parsed.monthIndex : new Date().getMonth();
    const d = formData.day || (parsed ? parsed.day : 1);

    setFormData((p) => ({ ...p, date: isoFromParts(year, m, d) }));
    setErrors((p) => ({ ...p, date: undefined }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
  };

  // ---------------------------------------
  // VALIDATION
  // ---------------------------------------

  const validate = () => {
    const newErrors = {};

    if (!formData.activity.trim())
      newErrors.activity = "Activity name is required";
    if (!formData.time) newErrors.time = "Time is required";

    if (!formData.day || formData.day < 1)
      newErrors.day = "Day must be 1 or greater";

    if (formData.date && !parseISO(formData.date)) {
      newErrors.date = "Invalid date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ---------------------------------------
  // SUBMIT
  // ---------------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      id: item?.id || Date.now(),
    });
  };

  const parsed = parseISO(formData.date);
  const selectedYear = parsed ? parsed.year : new Date().getFullYear();
  const selectedMonthIndex = parsed ? parsed.monthIndex : new Date().getMonth();

  const curYear = new Date().getFullYear();
  const yearOptions = Array.from(
    { length: YEAR_RANGE * 2 + 1 },
    (_, i) => curYear - YEAR_RANGE + i
  );

  const isEditing = !!item?.id;

  // ---------------------------------------
  // RETURN JSX
  // ---------------------------------------

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal itinerary-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
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
            {/* DATE ROW */}
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
                  {monthNames.map((m, i) => (
                    <option key={m} value={i}>
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

            {/* TIME */}
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

            {/* ACTIVITY */}
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

            {/* LOCATION */}
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

            {/* CATEGORY */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* BUDGET + TRAVELERS */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <DollarSign size={16} /> Budget
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
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
                  className="form-input"
                />
              </div>
            </div>

            {/* NOTES */}
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
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
