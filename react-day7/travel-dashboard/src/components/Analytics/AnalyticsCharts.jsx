import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import CalendarHeatmap from "react-calendar-heatmap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "react-calendar-heatmap/dist/styles.css";
import "leaflet/dist/leaflet.css";

import {
  useStatusStats,
  usePriorityStats,
  useEventsTimeSeries,
  useActivityHeatmap,
  useLocationStats,
} from "../../hooks/useStats";
import TravelChecklist from "../Checklist/TravelChecklist";
import "../../styles/charts.css";
import SkeletonLoader from "../Shared/SkeletonLoader";

// Fix for default marker icons in Leaflet
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

/**
 * Color palette for charts
 */
const COLORS = {
  primary: "#05668d",
  accent: "#02c39a",
  sun: "#ffd166",
  danger: "#ef4444",
  success: "#10b981",
};

/**
 * AnalyticsCharts Component
 * ----------------------------------------------------------
 * Displays 6 categories of analytics:
 * 1. Pie chart for Item Status distribution
 * 2. Bar chart for Priority distribution
 * 3. Line chart for activity events (last 7 days)
 * 4. Calendar Heatmap for activity density
 * 5. Map for location distribution
 * 6. Pre-Trip Checklist
 */

const AnalyticsCharts = () => {
  // Load stats
  const { data: statusStats = [], isLoading: statusLoading } = useStatusStats();
  const { data: priorityStats = [], isLoading: priorityLoading } =
    usePriorityStats();
  const { data: eventsData = [], isLoading: eventsLoading } =
    useEventsTimeSeries();
  const { data: heatmapData = [], isLoading: heatmapLoading } =
    useActivityHeatmap();
  const { data: locationData = [], isLoading: locationLoading } =
    useLocationStats();

  // Show skeleton loaders while any dataset is loading
  if (
    statusLoading ||
    priorityLoading ||
    eventsLoading ||
    heatmapLoading ||
    locationLoading
  ) {
    return (
      <div className="charts-container">
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="chart" />
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  // Colors for priority chart
  const priorityColors = {
    low: COLORS.success,
    medium: COLORS.sun,
    high: COLORS.danger,
  };

  // Get date range for calendar (last 6 months)
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  return (
    <div className="charts-container">
      {/* ========== PIE CHART: STATUS DISTRIBUTION ========== */}
      <div className="chart-card">
        <h3 className="chart-title">Items by Status</h3>

        {statusStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusStats}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.status}: ${entry.count}`}
              >
                {statusStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      Object.values(COLORS)[
                        index % Object.values(COLORS).length
                      ]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "40px 0",
            }}
          >
            No data available
          </p>
        )}
      </div>

      {/* ========== BAR CHART: PRIORITY DISTRIBUTION ========== */}
      <div className="chart-card">
        <h3 className="chart-title">Items by Priority</h3>

        {priorityStats.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityStats}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--bg-secondary)"
              />
              <XAxis dataKey="priority" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />

              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--bg-secondary)",
                  borderRadius: "var(--radius-sm)",
                }}
              />

              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {priorityStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={priorityColors[entry.priority] || COLORS.primary}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "40px 0",
            }}
          >
            No data available
          </p>
        )}
      </div>

      {/* ========== LINE CHART: EVENT ACTIVITY (LAST 7 DAYS) ========== */}
      <div className="chart-card">
        <h3 className="chart-title">Activity (Last 7 Days)</h3>

        {eventsData.length > 0 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={eventsData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--bg-secondary)"
              />

              <XAxis
                dataKey="day"
                stroke="var(--text-secondary)"
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />

              <YAxis stroke="var(--text-secondary)" />

              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--bg-secondary)",
                  borderRadius: "var(--radius-sm)",
                }}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />

              <Line
                type="monotone"
                dataKey="event_count"
                stroke={COLORS.primary}
                strokeWidth={2}
                dot={{ fill: COLORS.primary, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "40px 0",
            }}
          >
            No activity data available
          </p>
        )}
      </div>

      {/* ========== CALENDAR HEATMAP: ACTIVITY DENSITY ========== */}
      <div className="chart-card chart-card-wide">
        <h3 className="chart-title">Activity Heatmap (Last 6 Months)</h3>

        {heatmapData.length > 0 ? (
          <div className="calendar-heatmap-container">
            <CalendarHeatmap
              startDate={startDate}
              endDate={endDate}
              values={heatmapData}
              classForValue={(value) => {
                if (!value || value.count === 0) {
                  return "color-empty";
                }
                if (value.count < 3) return "color-scale-1";
                if (value.count < 6) return "color-scale-2";
                if (value.count < 9) return "color-scale-3";
                return "color-scale-4";
              }}
              tooltipDataAttrs={(value) => {
                if (!value || !value.date) {
                  return null;
                }
                return {
                  "data-tip": `${value.date}: ${value.count || 0} activities`,
                };
              }}
              showWeekdayLabels={true}
            />
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "40px 0",
            }}
          >
            No activity data available
          </p>
        )}
      </div>

      {/* ========== MAP: LOCATION DISTRIBUTION ========== */}
      <div className="chart-card chart-card-wide">
        <h3 className="chart-title">Trip Locations</h3>

        {locationData.length > 0 ? (
          <div className="map-container">
            <MapContainer
              center={[20, 0]}
              zoom={2}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {locationData.map((location, index) => (
                <Marker
                  key={index}
                  position={[location.latitude, location.longitude]}
                >
                  <Popup>
                    <strong>{location.name}</strong>
                    <br />
                    {location.count} {location.count === 1 ? "trip" : "trips"}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <p
            style={{
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "40px 0",
            }}
          >
            No location data available
          </p>
        )}
      </div>

      {/* ========== TRAVEL CHECKLIST ========== */}
      <div className="chart-card">
        <TravelChecklist />
      </div>
    </div>
  );
};

export default AnalyticsCharts;
