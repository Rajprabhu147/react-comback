// src/pages/Dashboard.jsx

import React from "react";
import Header from "../components/Layout/Header";
import FilterBar from "../components/Layout/FilterBar";
import AnalyticsCharts from "../components/Analytics/AnalyticsCharts";
import {
  CalendarSection,
  ItinerarySection,
  MapSection,
  ActivityEditor,
  INITIAL_ACTIVITIES,
} from "../components/TripPlanner";
import { useRealtimeSubscription } from "../hooks/useRealtime";
import "../styles/dashboard.css";

/**
 * Dashboard Component
 * Layout:
 * - Left Panel: TripPlanner with 3 rows
 *   - Row 1: Calendar
 *   - Row 2: Calendar Grid + Itinerary
 *   - Row 3: Map
 * - Right Panel: Analytics Charts
 */

const Dashboard = () => {
  useRealtimeSubscription();

  // ===== STATE =====
  const [currentMonth, setCurrentMonth] = React.useState(new Date(2024, 11, 1));
  const [activities, setActivities] = React.useState(INITIAL_ACTIVITIES);
  const [showEditor, setShowEditor] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [selectedDate, setSelectedDate] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [filterCategory, setFilterCategory] = React.useState("all");

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

  return (
    <div className="app">
      <Header />
      <FilterBar />

      <div className="app-container">
        <main className="main-content">
          <div className="dashboard-layout">
            {/* Left Panel - TripPlanner (3 Rows) */}
            <section className="items-section">
              <div className="trip-planner-wrapper">
                <div className="trip-planner-container">
                  {/* ROW 1: Calendar Controls */}
                  <div className="planner-row-1">
                    <CalendarSection
                      currentMonth={currentMonth}
                      onPrevMonth={handlePrevMonth}
                      onNextMonth={handleNextMonth}
                      onToday={handleToday}
                      activities={activities}
                      onAddActivity={handleAddActivity}
                      onEditActivity={handleEditActivity}
                    />
                  </div>

                  {/* ROW 2: Calendar Grid + Itinerary */}
                  <div className="planner-grid">
                    <div className="planner-row-2-left">
                      {/* Compact Calendar Grid shown through CalendarSection */}
                    </div>
                    <div className="planner-row-2-right">
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
                  </div>

                  {/* ROW 3: Map */}
                  <div className="planner-row-3">
                    <MapSection activities={activities} />
                  </div>
                </div>
              </div>

              {/* Editor Modal */}
              {showEditor && (
                <ActivityEditor
                  activity={editingItem}
                  selectedDay={selectedDate}
                  onSave={handleSaveActivity}
                  onClose={handleCloseEditor}
                />
              )}
            </section>

            {/* Right Panel - Analytics */}
            <div className="right-panel">
              <aside className="analytics-section">
                <AnalyticsCharts />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
