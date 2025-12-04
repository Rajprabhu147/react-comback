import React, { useState, useEffect } from "react";
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
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import DailyExpenseLogger from "../Expense/DailyExpenseLogger.jsx";
import "../../styles/charts.css";

/**
 * Enhanced Analytics Charts Component
 * Integrates Daily Expense Logger with expense analytics
 */

const COLORS = {
  primary: "#05668d",
  accent: "#02c39a",
  sun: "#ffd166",
  danger: "#ef4444",
  success: "#10b981",
  purple: "#8b5cf6",
};

const EXPENSE_CATEGORY_COLORS = {
  food: "#ffd166",
  transport: "#ef4444",
  accommodation: "#02c39a",
  activities: "#8b5cf6",
  shopping: "#10b981",
  other: "#05668d",
};

const AnalyticsCharts = () => {
  // Load expenses from localStorage
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem("dailyExpenses");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Handle expense updates from logger
  const handleExpenseChange = (newExpenses) => {
    setExpenses(newExpenses);
  };

  // Calculate expense distribution by category
  const expenseByCategory = expenses.reduce((acc, exp) => {
    const existing = acc.find((e) => e.category === exp.category);
    if (existing) {
      existing.amount += exp.amount;
      existing.count += 1;
    } else {
      acc.push({
        category: exp.category,
        amount: exp.amount,
        count: 1,
      });
    }
    return acc;
  }, []);

  // Format category names
  const formattedCategoryExpenses = expenseByCategory.map((exp) => {
    const categoryMap = {
      food: "🍽️ Food",
      transport: "🚗 Transport",
      accommodation: "🏨 Accommodation",
      activities: "⚡ Activities",
      shopping: "🛍️ Shopping",
      other: "📌 Other",
    };
    return {
      ...exp,
      name: categoryMap[exp.category] || exp.category,
    };
  });

  // Calculate daily expenses
  const dailyExpenses = expenses.reduce((acc, exp) => {
    const existing = acc.find((d) => d.day === exp.day);
    if (existing) {
      existing.amount += exp.amount;
      existing.count += 1;
    } else {
      acc.push({
        day: `Day ${exp.day}`,
        amount: exp.amount,
        count: 1,
      });
    }
    return acc;
  }, []);

  // Sort by day
  const sortedDailyExpenses = dailyExpenses.sort((a, b) => {
    const dayA = parseInt(a.day.split(" ")[1]);
    const dayB = parseInt(b.day.split(" ")[1]);
    return dayA - dayB;
  });

  // Calculate category breakdown for pie chart
  const pieChartData = formattedCategoryExpenses.sort(
    (a, b) => b.amount - a.amount
  );

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pieColors = [
    EXPENSE_CATEGORY_COLORS.food,
    EXPENSE_CATEGORY_COLORS.transport,
    EXPENSE_CATEGORY_COLORS.accommodation,
    EXPENSE_CATEGORY_COLORS.activities,
    EXPENSE_CATEGORY_COLORS.shopping,
    EXPENSE_CATEGORY_COLORS.other,
  ];

  return (
    <div className="charts-container">
      {/* ========== TRIP TYPE DISTRIBUTION (PIE) ========== */}
      <div className="chart-card">
        <h3 className="chart-title">💰 Expense by Category</h3>
        {pieChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieChartData}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(entry) => `${entry.name}: $${entry.amount.toFixed(0)}`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No expense data available</p>
        )}
      </div>

      {/* ========== EXPENSE BY CATEGORY (BAR) ========== */}
      <div className="chart-card">
        <h3 className="chart-title">📊 Expense Breakdown</h3>
        {formattedCategoryExpenses.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={formattedCategoryExpenses}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--bg-secondary)"
              />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--bg-secondary)",
                  borderRadius: "var(--radius-sm)",
                }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {formattedCategoryExpenses.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={pieColors[index % pieColors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No expense data available</p>
        )}
      </div>

      {/* ========== DAILY EXPENSES (LINE) ========== */}
      <div className="chart-card">
        <h3 className="chart-title">📈 Daily Expense Trend</h3>
        {sortedDailyExpenses.length > 0 ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={sortedDailyExpenses}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--bg-secondary)"
              />
              <XAxis dataKey="day" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip
                contentStyle={{
                  background: "var(--surface)",
                  border: "1px solid var(--bg-secondary)",
                  borderRadius: "var(--radius-sm)",
                }}
                formatter={(value) => `$${value.toFixed(2)}`}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke={COLORS.accent}
                strokeWidth={3}
                dot={{ fill: COLORS.accent, r: 5 }}
                activeDot={{ r: 7 }}
                name="Daily Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">No expense data available</p>
        )}
      </div>

      {/* ========== DAILY EXPENSE LOGGER ========== */}
      <div className="chart-card chart-card-wide">
        <DailyExpenseLogger onExpenseChange={handleExpenseChange} />
      </div>

      {/* ========== EXPENSE SUMMARY ========== */}
      <div className="chart-card">
        <h3 className="chart-title">💵 Total Expenses</h3>
        <div className="summary-card">
          <div className="summary-value">${totalExpenses.toFixed(2)}</div>
          <div className="summary-label">Total Trip Spending</div>
          <div className="summary-meta">
            <span>{expenses.length} transactions</span>
            <span>{formattedCategoryExpenses.length} categories</span>
          </div>
        </div>
      </div>

      {/* ========== HIGHEST SPENDING CATEGORY ========== */}
      <div className="chart-card">
        <h3 className="chart-title">🏆 Highest Spending</h3>
        {pieChartData.length > 0 ? (
          <div className="highest-spending">
            <div className="highest-item">
              <span className="highest-category">{pieChartData[0].name}</span>
              <span className="highest-amount">
                ${pieChartData[0].amount.toFixed(2)}
              </span>
            </div>
            <div className="spending-percentage">
              <div className="percentage-bar">
                <div
                  className="percentage-fill"
                  style={{
                    width: `${(pieChartData[0].amount / totalExpenses) * 100}%`,
                  }}
                />
              </div>
              <span className="percentage-text">
                {((pieChartData[0].amount / totalExpenses) * 100).toFixed(1)}%
                of total
              </span>
            </div>
          </div>
        ) : (
          <p className="no-data">No expense data available</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCharts;
