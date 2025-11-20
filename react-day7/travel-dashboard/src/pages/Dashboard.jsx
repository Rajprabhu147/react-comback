import React from "react";
import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";
import ItemsList from "../components/Items/ItemsList";
import ItemEditor from "../components/Items/ItemEditor";
import AnalyticsCharts from "../components/Analytics/AnalyticsCharts";
import { useRealtimeSubscription } from "../hooks/useRealtime";
import { useUIStore } from "../store/uiStore";

const Dashboard = () => {
  useRealtimeSubscription();
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <div className="grid-dashboard">
            <ItemsList />
            <AnalyticsCharts />
          </div>
        </main>
      </div>
      <ItemEditor />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => useUIStore.getState().toggleSidebar()}
        />
      )}
    </div>
  );
};

export default Dashboard;
