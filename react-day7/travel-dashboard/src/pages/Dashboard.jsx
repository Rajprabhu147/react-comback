import React from "react";
import Header from "../components/Layout/Header";
import FilterBar from "../components/Layout/FilterBar";
import ItemsList from "../components/Items/ItemsList";
import ItemEditor from "../components/Items/ItemEditor";
import AnalyticsCharts from "../components/Analytics/AnalyticsCharts";
import { useRealtimeSubscription } from "../hooks/useRealtime";

const Dashboard = () => {
  useRealtimeSubscription();

  return (
    <div className="app">
      <Header />

      {/* Filter Bar - Top Layer */}
      <FilterBar />

      <div className="app-container">
        <main className="main-content">
          <div className="dashboard-layout">
            {/* Items Section - Left Side */}
            <section className="items-section">
              <ItemsList />
            </section>

            {/* Analytics Section - Right Side */}
            <section className="analytics-section">
              <AnalyticsCharts />
            </section>
          </div>
        </main>
      </div>
      <ItemEditor />
    </div>
  );
};

export default Dashboard;
