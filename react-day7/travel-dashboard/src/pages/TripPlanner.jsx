// src/pages/TripPlanner.jsx

import React, { useState } from "react";
import {
  CalendarSection,
  ItinerarySection,
  MapSection,
  ActivityEditor,
  INITIAL_ACTIVITIES,
} from "../components/TripPlanner";
import "../styles/trip-planner.css";

const TripPlanner = () => {
  // ===== STATE =====
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 11, 1));
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [showEditor, setShowEditor] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // ===== CALENDAR HANDLERS =====
  const handlePrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );

  const handleNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );

  const handleToday = () => setCurrentMonth(new Date());

  // ===== ACTIVITY HANDLERS =====
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

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingItem(null);
  };

  // ===== RENDER =====
  return (
    <div className="trip-planner-wrapper">
      <div className="trip-planner-container">
        {/* ROW 1 & 2: CALENDAR + ITINERARY */}
        <div className="planner-grid">
          <CalendarSection
            currentMonth={currentMonth}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleToday}
            activities={activities}
            onAddActivity={handleAddActivity}
            onEditActivity={handleEditActivity}
          />

          <ItinerarySection
            activities={activities}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            filterCategory={filterCategory}
            onFilterChange={setFilterCategory}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
            onToggleComplete={handleToggleComplete}
          />
        </div>

        {/* ROW 3: MAP */}
        <MapSection activities={activities} />
      </div>

      {/* EDITOR MODAL */}
      {showEditor && (
        <ActivityEditor
          activity={editingItem}
          selectedDay={selectedDate}
          onSave={handleSaveActivity}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default TripPlanner;
