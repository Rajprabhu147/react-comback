import React from "react";
import Header from "../components/Layout/Header";
import ItemsList from "../components/Items/ItemList";
import ItemEditor from "../components/Items/ItemEditor";
import AnalyticsCharts from "../components/Analytics/AnalyticsCharts";
import { useRealtimeSubscription } from "../hooks/useRealtime";

const Dashboard = () => {
  useRealtimeSubscription();

  return (
    <div className="app">
      <Header />
      <div className="main-content">
        <div className="grid-dashboard">
          <ItemsList />
          <AnalyticsCharts />
        </div>
      </div>
      <ItemEditor />
    </div>
  );
};

export default Dashboard;
