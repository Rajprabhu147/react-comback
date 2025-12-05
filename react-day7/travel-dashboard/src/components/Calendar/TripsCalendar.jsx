import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  Check,
  Clock,
  MapPin,
  DollarSign,
  Users,
  X,
  Calendar,
} from "lucide-react";
import ItineraryMap from "../components/ItineraryMap";
import LocationAutocomplete from "../../components/Calendar/LocationAutocomplete.jsx";

import "../../styles/trip-planner.css";

const TripPlanner = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11, 1));
  const [activities, setActivities] = useState([
    {
      id: 1,
      day: 15,
      time: "09:00",
      activity: "Eiffel Tower Visit",
      location: "Paris",
      category: "sightseeing",
      budget: 25,
      travelers: 2,
      notes: "Book tickets online",
      completed: false,
    },
    {
      id: 2,
      day: 15,
      time: "13:00",
      activity: "Lunch",
      location: "Latin Quarter",
      category: "dining",
      budget: 40,
      travelers: 2,
      notes: "",
      completed: false,
    },
    {
      id: 3,
      day: 16,
      time: "10:00",
      activity: "Louvre Museum",
      location: "Paris",
      category: "sightseeing",
      budget: 30,
      travelers: 2,
      notes: "",
      completed: false,
    },
  ]);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredPopover, setHoveredPopover] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  const CATEGORIES = [
    { value: "sightseeing", label: "🏛️ Sightseeing", color: "#05668d" },
    { value: "dining", label: "🍽️ Dining", color: "#ffd166" },
    { value: "accommodation", label: "🏨 Accommodation", color: "#02c39a" },
    { value: "transport", label: "🚗 Transport", color: "#ef4444" },
    { value: "shopping", label: "🛍️ Shopping", color: "#10b981" },
    { value: "activity", label: "⚡ Activity", color: "#8b5cf6" },
  ];

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  const handleNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  const handleToday = () => setCurrentMonth(new Date());

  const handleAddActivity = (day) => {
    setSelectedDate(day);
    setEditingItem(null);
    setShowEditor(true);
  };

  const handleEditActivity = (activity) => {
    setEditingItem(activity);
    setSelectedDate(activity.day);
    setShowEditor(true);
  };

  const handleSaveActivity = (formData) => {
    if (editingItem) {
      setActivities(
        activities.map((a) =>
          a.id === editingItem.id ? { ...formData, id: editingItem.id } : a
        )
      );
    } else {
      setActivities([...activities, { ...formData, id: Date.now() }]);
    }
    setShowEditor(false);
    setEditingItem(null);
  };

  const handleDeleteActivity = (id) => {
    setActivities(activities.filter((a) => a.id !== id));
  };

  const handleToggleComplete = (id) => {
    setActivities(
      activities.map((a) =>
        a.id === id ? { ...a, completed: !a.completed } : a
      )
    );
  };

  const getActivitiesForDay = (day) => {
    return activities
      .filter((a) => a.day === day)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getCategoryIcon = (category) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat ? cat.label.split(" ")[0] : "📌";
  };

  const getCategoryColor = (category) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat ? cat.color : "#666";
  };

  const filteredActivities = activities
    .filter((a) => {
      const matchesSearch =
        a.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || a.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));

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
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div className="trip-planner-wrapper">
      <div className="trip-planner-container">
        {/* ========== TRIP ROUTE MAP ========== */}
        <div className="planner-map-section">
          <ItineraryMap activities={activities} />
        </div>

        {/* Original planner-grid content below */}
        <div className="planner-grid">
          {/* Calendar Section */}
          <div className="planner-calendar-section">
            <div className="planner-header">
              <h3 className="planner-title">✈️ Trip Planner</h3>
            </div>

            <div className="calendar-controls">
              <h2 className="calendar-month-title">
                {monthNames[currentMonth.getMonth()]}{" "}
                {currentMonth.getFullYear()}
              </h2>
              <div className="calendar-nav-buttons">
                <button
                  onClick={handlePrevMonth}
                  className="nav-button prev-btn"
                >
                  <ChevronLeft size={20} />
                </button>
                <button onClick={handleToday} className="nav-button today-btn">
                  Today
                </button>
                <button
                  onClick={handleNextMonth}
                  className="nav-button next-btn"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Weekdays */}
            <div className="calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="weekday-header">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid">
              {days.map((day, idx) => {
                const dayActivities = day ? getActivitiesForDay(day) : [];
                const isToday =
                  day === new Date().getDate() &&
                  currentMonth.getMonth() === new Date().getMonth();
                const cellClassName = `calendar-day-cell ${
                  !day ? "empty-day" : ""
                } ${isToday ? "today-day" : ""} ${
                  dayActivities.length > 0 ? "has-activities" : ""
                }`;

                return (
                  <div
                    key={idx}
                    className={cellClassName}
                    onMouseEnter={() =>
                      day && dayActivities.length > 0 && setHoveredPopover(day)
                    }
                    onMouseLeave={() => setHoveredPopover(null)}
                    onClick={() => day && handleAddActivity(day)}
                  >
                    {day && (
                      <>
                        <div className="day-number">{day}</div>
                        <div className="day-activities">
                          {dayActivities.slice(0, 2).map((activity, i) => (
                            <div
                              key={i}
                              className="activity-badge"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditActivity(activity);
                              }}
                              title={activity.activity}
                              style={{
                                backgroundColor: getCategoryColor(
                                  activity.category
                                ),
                              }}
                            >
                              {activity.activity}
                            </div>
                          ))}
                          {dayActivities.length > 2 && (
                            <div className="more-activities-badge">
                              +{dayActivities.length - 2} more
                            </div>
                          )}
                        </div>

                        {/* Activity Popover */}
                        {hoveredPopover === day && dayActivities.length > 0 && (
                          <div className="activity-popover">
                            <div className="popover-header-section">
                              {dayActivities.length} Activity
                              {dayActivities.length !== 1 ? "ies" : ""} on Day{" "}
                              {day}
                            </div>
                            {dayActivities.map((activity) => (
                              <div
                                key={activity.id}
                                className="popover-activity-item"
                              >
                                <div className="popover-activity-header">
                                  <span className="popover-icon">
                                    {getCategoryIcon(activity.category)}
                                  </span>
                                  <span className="popover-title">
                                    {activity.activity}
                                  </span>
                                  <span className="popover-time">
                                    <Clock size={12} /> {activity.time}
                                  </span>
                                </div>
                                {activity.location && (
                                  <div className="popover-location">
                                    <MapPin size={12} /> {activity.location}
                                  </div>
                                )}
                                {(activity.budget || activity.travelers) && (
                                  <div className="popover-meta">
                                    {activity.budget && (
                                      <span>${activity.budget}</span>
                                    )}
                                    {activity.travelers && (
                                      <span>
                                        {activity.travelers} traveler
                                        {activity.travelers > 1 ? "s" : ""}
                                      </span>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Itinerary Section */}
          <div className="planner-itinerary-section">
            {/* Search & Filter */}
            <div className="filter-panel">
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="filter-input"
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="all">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Activities List */}
            <div className="activities-list-container">
              <h2 className="itinerary-title">
                Itinerary ({filteredActivities.length})
              </h2>

              {filteredActivities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <p className="empty-text">No activities planned yet</p>
                </div>
              ) : (
                <div className="activities-list">
                  {filteredActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className={`activity-list-item ${
                        activity.completed ? "completed" : ""
                      }`}
                      style={{
                        borderLeftColor: getCategoryColor(activity.category),
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={activity.completed}
                        onChange={() => handleToggleComplete(activity.id)}
                        className="activity-checkbox"
                      />
                      <div className="activity-item-content">
                        <div className="activity-header">
                          <span className="activity-icon">
                            {getCategoryIcon(activity.category)}
                          </span>
                          <span className="activity-name">
                            {activity.activity}
                          </span>
                          <span className="day-badge">Day {activity.day}</span>
                        </div>
                        <div className="activity-details">
                          <div className="detail-item">
                            <Clock size={14} /> {activity.time}
                          </div>
                          {activity.location && (
                            <div className="detail-item">
                              <MapPin size={14} /> {activity.location}
                            </div>
                          )}
                          {activity.budget && (
                            <div className="detail-item">
                              <DollarSign size={14} /> ${activity.budget}
                            </div>
                          )}
                          {activity.travelers && (
                            <div className="detail-item">
                              <Users size={14} /> {activity.travelers}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="activity-actions">
                        <button
                          onClick={() => handleEditActivity(activity)}
                          className="action-btn edit-btn"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="action-btn delete-btn"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor Modal */}
        {showEditor && (
          <ActivityEditor
            activity={editingItem}
            selectedDay={selectedDate}
            categories={CATEGORIES}
            onSave={handleSaveActivity}
            onClose={() => setShowEditor(false)}
          />
        )}
      </div>
    </div>
  );
};

const ActivityEditor = ({
  activity,
  selectedDay,
  categories,
  onSave,
  onClose,
}) => {
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
    onSave(formData);
  };

  return (
    <div className="editor-overlay">
      <div className="editor-modal">
        <div className="editor-header">
          <h2 className="editor-title">
            {activity ? "Edit Activity" : "Add Activity"}
          </h2>
          <button onClick={onClose} className="editor-close-btn">
            ✕
          </button>
        </div>

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
              {categories.map((cat) => (
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

          <div className="editor-footer">
            <button onClick={onClose} className="editor-btn cancel-btn">
              Cancel
            </button>
            <button onClick={handleSubmit} className="editor-btn submit-btn">
              {activity ? "Update" : "Add"} Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
