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
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  useStatusStats,
  usePriorityStats,
  useEventsTimeSeries,
} from "../../hooks/useStats";
import LoadingSpinner from "../Shared/LoadingSpinner";

const COLORS = {
  primary: "#05668d",
  accent: "#02c39a",
  sun: "#ffd166",
  danger: "#ef4444",
  success: "#10b981",
};

const AnalyticsCharts = () => {
  const { data: statusStats = [], isLoading: statusLoading } = useStatusStats();
  const { data: priorityStats = [], isLoading: priorityLoading } =
    usePriorityStats();
  const { data: eventsData = [], isLoading: eventsLoading } =
    useEventsTimeSeries();

  if (statusLoading || priorityLoading || eventsLoading) {
    return <LoadingSpinner message="Loading analytics..." />;
  }

  const totalItems = statusStats.reduce(
    (sum, stat) => sum + Number(stat.count),
    0
  );
  const totalEvents = eventsData.reduce(
    (sum, event) => sum + Number(event.event_count),
    0
  );

  const priorityColors = {
    low: COLORS.success,
    medium: COLORS.sun,
    high: COLORS.danger,
  };

  return (
    <div className="charts-container">
      {/* Summary Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{totalItems}</div>
          <div className="stat-label">Total Items</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{totalEvents}</div>
          <div className="stat-label">Events (7d)</div>
        </div>
      </div>

      {/* Status Distribution */}
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

      {/* Priority Distribution */}
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

      {/* Activity Timeline */}
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
    </div>
  );
};

export default AnalyticsCharts;
