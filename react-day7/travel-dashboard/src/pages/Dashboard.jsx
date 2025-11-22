import React from "react";
// Used for navigation redirection (not used directly in this file but commonly needed in dashboards)
import { useNavigate } from "react-router-dom";
// Global layout components
import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";
// Dashboard content components
import ItemsList from "../components/Items/ItemsList";
import ItemEditor from "../components/Items/ItemEditor";
import AnalyticsCharts from "../components/Analytics/AnalyticsCharts";
// Hook that listens to real-time Supabase changes for items or other entities
import { useRealtimeSubscription } from "../hooks/useRealtime";
// Global UI store (Zustand) for layout state like sidebar toggling
import { useUIStore } from "../store/uiStore";

const Dashboard = () => {
  // Activate real-time syncing so items update instantly when changed in Supabase
  useRealtimeSubscription();

  // Read whether sidebar is currently open (for mobile overlay behaviour)
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  // A function from the UI store to toggle sidebar visibility
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <div className="app">
      {/* Top navigation bar that includes logo, actions, user menu */}
      <Header />

      <div className="app-container">
        {/* Persistent Left Sidebar for navigation */}
        <Sidebar />

        {/* Main content area of the dashboard */}
        <main className="main-content">
          {/* Dashboard grid layout containing items on the left and charts on the right */}
          <div className="grid-dashboard">
            {/* List of items/tasks created by user */}
            <ItemsList />

            {/* Analytics charts showing statistics & insights */}
            <AnalyticsCharts />
          </div>
        </main>
      </div>

      {/* Component that opens as a modal/drawer to add or edit items */}
      <ItemEditor />

      {/* 
        Mobile overlay that appears when the sidebar is open on screens smaller than 1024px.
        Clicking the dark background will close the mobile sidebar.
      */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </div>
  );
};

export default Dashboard;
