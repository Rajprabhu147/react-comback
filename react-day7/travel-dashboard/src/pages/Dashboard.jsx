import React from "react";
import AnalyticsCharts from "./AnalyticsCharts";
import ItineraryItemsList from "./ItineraryItemsList";
import ItineraryItemEditor from "./ItineraryItemEditor";
import TripsCalendar from "./components/TripsCalendar";
import { ItineraryProvider } from "./context/ItineraryContext";
import "./calendar.css";
import "./charts.css";

const Dashboard = () => {
  const tripStartISO = null; // Replace with real trip start date if available

  return (
    <ItineraryProvider tripStartISO={tripStartISO}>
      <div className="dashboard-grid">
        <div className="dashboard-left">
          <AnalyticsCharts />
          <ItineraryItemEditor />
          <ItineraryItemsList />
        </div>

        <aside className="dashboard-right">
          <TripsCalendar />
        </aside>
      </div>
    </ItineraryProvider>
  );
};

export default Dashboard;
