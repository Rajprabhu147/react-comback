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
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          {/* Items Section - Full Width Below */}
          <section className="items-section">
            <ItemsList />
          </section>

          {/* New Layout: Analytics First, Then Items */}
          <div className="dashboard-layout">
            {/* Analytics Section - Full Width on Top */}
            <section className="analytics-section">
              <AnalyticsCharts />
            </section>
          </div>
        </main>
      </div>
      <ItemEditor />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
    </div>
  );
};

export default Dashboard;
