import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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

  // Calculate average daily expense
  const averageDailyExpense =
    sortedDailyExpenses.length > 0
      ? totalExpenses / sortedDailyExpenses.length
      : 0;

  // Get highest spending info
  const highestSpending = pieChartData.length > 0 ? pieChartData[0] : null;
  const highestSpendingPercent =
    highestSpending && totalExpenses > 0
      ? (highestSpending.amount / totalExpenses) * 100
      : 0;

  // Calculate overspending pattern data for scatter chart
  const scatterData = sortedDailyExpenses.map((day) => {
    const dayNum = parseInt(day.day.split(" ")[1]);
    const amount = day.amount;
    const isOverspending = amount > averageDailyExpense;
    return {
      day: dayNum,
      amount: amount,
      isOverspending: isOverspending,
      variance: amount - averageDailyExpense,
      fill: isOverspending ? COLORS.danger : COLORS.accent,
    };
  });

  return (
    <div className="charts-container">
      {/* ========== DAILY EXPENSE LOGGER - FULL WIDTH TOP ========== */}
      <div className="chart-card chart-card-wide">
        <DailyExpenseLogger onExpenseChange={handleExpenseChange} />
      </div>

      {/* ========== INFO CARDS ROW ========== */}
      <div className="info-cards-row">
        {/* Total Expenses Card */}
        <div className="info-card total-expenses-card">
          <div className="info-card-icon">💵</div>
          <div className="info-card-content">
            <div className="info-card-label">Total Expenses</div>
            <div className="info-card-value">${totalExpenses.toFixed(2)}</div>
            <div className="info-card-meta">
              <span className="meta-item">{expenses.length} transactions</span>
              <span className="meta-divider">•</span>
              <span className="meta-item">
                {formattedCategoryExpenses.length} categories
              </span>
            </div>
          </div>
        </div>

        {/* Highest Spending Card */}
        <div className="info-card highest-spending-card">
          <div className="info-card-icon">🏆</div>
          <div className="info-card-content">
            <div className="info-card-label">Highest Spending</div>
            <div className="info-card-value">
              {highestSpending ? highestSpending.name : "No data"}
            </div>
            <div className="info-card-amount">
              ${highestSpending ? highestSpending.amount.toFixed(2) : "0.00"}
            </div>
            <div className="percentage-bar-container">
              <div className="percentage-bar">
                <div
                  className="percentage-fill"
                  style={{ width: `${highestSpendingPercent}%` }}
                />
              </div>
              <span className="percentage-text">
                {highestSpendingPercent.toFixed(1)}% of total
              </span>
            </div>
          </div>
        </div>

        {/* Average Daily Expense Card */}
        <div className="info-card average-spending-card">
          <div className="info-card-icon">📊</div>
          <div className="info-card-content">
            <div className="info-card-label">Avg Daily Expense</div>
            <div className="info-card-value">
              ${averageDailyExpense.toFixed(2)}
            </div>
            <div className="info-card-meta">
              <span className="meta-item">
                {sortedDailyExpenses.length} days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========== PIE CHART: EXPENSE BY CATEGORY ========== */}
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

      {/* ========== SCATTER CHART: OVERSPENDING PATTERN ========== */}
      <div className="chart-card">
        <h3 className="chart-title">⚠️ Overspending Pattern Analysis</h3>
        {scatterData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={280}>
              <ScatterChart
                data={scatterData}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--bg-secondary)"
                />
                <XAxis
                  type="number"
                  dataKey="day"
                  name="Day"
                  stroke="var(--text-secondary)"
                  label={{
                    value: "Day",
                    position: "insideBottomRight",
                    offset: -5,
                  }}
                />
                <YAxis
                  type="number"
                  dataKey="amount"
                  name="Amount ($)"
                  stroke="var(--text-secondary)"
                  label={{
                    value: "Expense Amount ($)",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface)",
                    border: "1px solid var(--bg-secondary)",
                    borderRadius: "var(--radius-sm)",
                  }}
                  formatter={(value, name) => {
                    if (name === "amount") {
                      return `$${value.toFixed(2)}`;
                    }
                    return value;
                  }}
                  labelFormatter={(value) => `Day ${value}`}
                />
                <Scatter
                  name="Daily Expenses"
                  data={scatterData}
                  fill={COLORS.accent}
                  shape="circle"
                >
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
                {/* Reference line for average daily expense */}
                {averageDailyExpense > 0 && (
                  <line
                    x1="0"
                    y1={averageDailyExpense}
                    x2="100%"
                    y2={averageDailyExpense}
                    stroke={COLORS.success}
                    strokeDasharray="5 5"
                  />
                )}
              </ScatterChart>
            </ResponsiveContainer>
            <div className="scatter-legend">
              <div className="scatter-legend-item">
                <span
                  className="scatter-color-dot"
                  style={{ backgroundColor: COLORS.accent }}
                />
                <span>
                  Within Budget (≤ Avg: ${averageDailyExpense.toFixed(2)})
                </span>
              </div>
              <div className="scatter-legend-item">
                <span
                  className="scatter-color-dot"
                  style={{ backgroundColor: COLORS.danger }}
                />
                <span>
                  Overspending (&gt; Avg: ${averageDailyExpense.toFixed(2)})
                </span>
              </div>
            </div>
          </>
        ) : (
          <p className="no-data">No expense data available</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCharts;
