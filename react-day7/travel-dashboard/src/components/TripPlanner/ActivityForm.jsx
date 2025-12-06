// src/components/TripPlanner/ActivityForm.jsx

import React, { useState } from "react";
import LocationAutocomplete from "../Calendar/LocationAutocomplete";
import { CATEGORIES } from "./constants";

const ActivityForm = ({ activity, selectedDay, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(
    activity || {
      day: selectedDay,
      time: "09:00",
      activity: "",
      location: "",
      category: "sightseeing",
      budget: "",
      travelers: "",
      notes: "",
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.activity.trim()) {
      alert("Please enter an activity name");
      return;
    }
    onSubmit(formData);
  };

  return (
    <>
      <div className="editor-body">
        <div className="editor-form-row">
          <div className="editor-form-group">
            <label className="editor-label">Day</label>
            <input
              type="number"
              name="day"
              min="1"
              value={formData.day}
              onChange={handleChange}
              className="editor-input"
            />
          </div>
          <div className="editor-form-group">
            <label className="editor-label">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="editor-input"
            />
          </div>
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Activity *</label>
          <input
            type="text"
            name="activity"
            placeholder="e.g., Visit Eiffel Tower"
            value={formData.activity}
            onChange={handleChange}
            className="editor-input"
          />
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Location</label>
          <LocationAutocomplete
            value={formData.location}
            onChange={handleLocationChange}
            placeholder="Search for a place..."
          />
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="editor-select"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="editor-form-row">
          <div className="editor-form-group">
            <label className="editor-label">Budget (USD)</label>
            <input
              type="number"
              name="budget"
              placeholder="0"
              value={formData.budget}
              onChange={handleChange}
              className="editor-input"
            />
          </div>
          <div className="editor-form-group">
            <label className="editor-label">Travelers</label>
            <input
              type="number"
              name="travelers"
              placeholder="1"
              value={formData.travelers}
              onChange={handleChange}
              className="editor-input"
            />
          </div>
        </div>

        <div className="editor-form-group">
          <label className="editor-label">Notes</label>
          <textarea
            name="notes"
            placeholder="Add any additional details..."
            value={formData.notes}
            onChange={handleChange}
            className="editor-textarea"
          />
        </div>
      </div>

      <div className="editor-footer">
        <button onClick={onCancel} className="editor-btn cancel-btn">
          Cancel
        </button>
        <button onClick={handleSubmit} className="editor-btn submit-btn">
          {activity ? "Update" : "Add"} Activity
        </button>
      </div>
    </>
  );
};

export default ActivityForm;
