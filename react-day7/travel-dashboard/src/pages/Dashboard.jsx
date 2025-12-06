import React from "react";
import Header from "../components/Layout/Header";
import FilterBar from "../components/Layout/FilterBar";
import ItineraryItemsList from "../components/Itinerary/ItineraryItemsList";
import AnalyticsCharts from "../components/Analytics/AnalyticsCharts";
import TripPlanner from "../pages/TripPlanner";
import { useRealtimeSubscription } from "../hooks/useRealtime";
import "../styles/dashboard.css";

/**
 * Dashboard Component
 * Three-column layout:
 * - Left: Items/Itinerary (wider)
 * - Right Top: Calendar
 * - Right Bottom: Analytics Charts
 */

const Dashboard = () => {
  useRealtimeSubscription();

  // Trips data (replace with actual data source)
  const trips = [];

  return (
    <div className="app">
      <Header />

      {/* Filter Bar - Top Layer */}
      <FilterBar />

      <div className="app-container">
        <main className="main-content">
          <div className="dashboard-layout">
            {/* Left Column - Itinerary Items */}
            <section className="items-section">
              {/* <ItineraryItemsList />{" "} */}
              <section className="calendar-section">
                <TripPlanner trips={trips} />
              </section>
            </section>

            {/* Right Column - Calendar & Analytics */}
            <div className="right-panel">
              {/* Calendar Section */}

              {/* Analytics Section */}
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
