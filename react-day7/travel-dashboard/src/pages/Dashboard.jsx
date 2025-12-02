import React from "react";
import Header from "../components/Layout/Header";
import FilterBar from "../components/Layout/FilterBar";
import ItemsList from "../components/Items/ItemsList";
import ItemEditor from "../components/Items/ItemEditor";
import AnalyticsCharts from "../components/Analytics/AnalyticsCharts";
import TripsCalendar from "../components/Calendar/TripsCalendar";
import { useRealtimeSubscription } from "../hooks/useRealtime";
import "../styles/dashboard.css";

const Dashboard = () => {
  useRealtimeSubscription();

  // Assuming you have trips data available
  // You may need to fetch this or get it from context/state management
  const trips = []; // Replace with your actual trips data

  return (
    <div className="app">
      <Header />

      {/* Filter Bar - Top Layer */}
      <FilterBar />

      <div className="app-container">
        <main className="main-content">
          <div className="dashboard-layout">
            {/* Items Section - Left Column (Spanning Full Height) */}
            <section className="items-section">
              <ItemsList />
            </section>

            {/* Right Column - Calendar and Analytics Stacked */}
            <div className="right-panel">
              {/* Calendar Section */}
              <section className="calendar-section">
                <TripsCalendar trips={trips} />
              </section>

              {/* Analytics Section */}
              <aside className="analytics-section">
                <AnalyticsCharts />
              </aside>
            </div>
          </div>
        </main>
      </div>

      <ItemEditor />
    </div>
  );
};

export default Dashboard;
