// src/components/Itinerary/ItineraryItemEditor.jsx
import React, { useState, useEffect, useRef } from "react";
import { Clock, MapPin, DollarSign, Users, X } from "lucide-react";
import "../../styles/itinerary-editor.css";

/**
 * ItineraryItemEditor
 * Modal for creating or editing itinerary activities
 */

const DEFAULT_FORM = {
  day: 1,
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

const ItineraryItemEditor = ({ item, onSave, onClose }) => {
  // Initialize from incoming prop once (on first render)
  const [formData, setFormData] = useState(() =>
    item ? { ...item } : { ...DEFAULT_FORM }
  );
  const [errors, setErrors] = useState({});

  // Keep a ref of the last-applied incoming data so we only set state when real changes arrive.
  const lastIncomingRef = useRef(
    item ? JSON.stringify(item) : JSON.stringify(DEFAULT_FORM)
  );

  useEffect(() => {
    const incoming = item ? { ...item } : { ...DEFAULT_FORM };
    const incomingStr = JSON.stringify(incoming);

    if (incomingStr !== lastIncomingRef.current) {
      lastIncomingRef.current = incomingStr;
      setFormData(incoming);
      setErrors({});
    }
    // intentionally only depends on `item` to avoid render loops
  }, [item]);

  const validate = () => {
    const newErrors = {};
    if (!formData.activity || !formData.activity.trim()) {
      newErrors.activity = "Activity name is required";
    }
    if (!formData.time) {
      newErrors.time = "Time is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      ...formData,
      id: item?.id || Date.now(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const isEditing = !!item?.id;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal itinerary-modal"
        onClick={(e) => e.stopPropagation()}
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
            {/* Day and Time Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Day *</label>
                <input
                  type="number"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  min="1"
                  className="form-input"
                />
              </div>
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
