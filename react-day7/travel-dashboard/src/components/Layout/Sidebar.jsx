/* eslint-disable no-unused-vars */
import React from "react";
import { useUIStore } from "../../store/uiStore";
import { useItems } from "../../hooks/useItems";
import { useStatusStats, usePriorityStats } from "../../hooks/useStats";
import "../../styles/sidebar.css";

/**
 * Sidebar component — safe version
 * - avoids mutating arrays from hooks
 * - guards relative time helper against invalid input
 * - includes CSS class hooks for entrance & staggered animations
 */

const Sidebar = () => {
  const {
    statusFilter,
    priorityFilter,
    setStatusFilter,
    setPriorityFilter,
    sidebarOpen,
    toggleSidebar,
  } = useUIStore();

  const { data: items = [] } = useItems();
  // statusStats and priorityStats are fetched for potential usage;
  const { data: statusStats = [] } = useStatusStats();
  const { data: priorityStats = [] } = usePriorityStats();

  // Quick computed stats
  const totalItems = items.length;
  const openItems = items.filter((item) => item.status === "open").length;
  const inProgressItems = items.filter(
    (item) => item.status === "in-progress"
  ).length;
  const closedItems = items.filter((item) => item.status === "closed").length;
  const highPriorityItems = items.filter(
    (item) => item.priority === "high"
  ).length;

  const menuItems = [
    {
      id: "all",
      icon: "📊",
      label: "All Items",
      count: totalItems,
      active: statusFilter === "all" && priorityFilter === "all",
      onClick: () => {
        setStatusFilter("all");
        setPriorityFilter("all");
      },
    },
    {
      id: "open",
      icon: "🔵",
      label: "Open",
      count: openItems,
      active: statusFilter === "open",
      onClick: () => setStatusFilter("open"),
      color: "var(--primary)",
    },
    {
      id: "in-progress",
      icon: "🟡",
      label: "In Progress",
      count: inProgressItems,
      active: statusFilter === "in-progress",
      onClick: () => setStatusFilter("in-progress"),
      color: "var(--warning)",
    },
    {
      id: "closed",
      icon: "🟢",
      label: "Closed",
      count: closedItems,
      active: statusFilter === "closed",
      onClick: () => setStatusFilter("closed"),
      color: "var(--success)",
    },
  ];

  const priorityItems = [
    {
      id: "high",
      icon: "🔴",
      label: "High Priority",
      count: highPriorityItems,
      active: priorityFilter === "high",
      onClick: () => setPriorityFilter("high"),
      color: "var(--danger)",
    },
    {
      id: "medium",
      icon: "🟠",
      label: "Medium Priority",
      count: items.filter((item) => item.priority === "medium").length,
      active: priorityFilter === "medium",
      onClick: () => setPriorityFilter("medium"),
      color: "var(--warning)",
    },
    {
      id: "low",
      icon: "🟢",
      label: "Low Priority",
      count: items.filter((item) => item.priority === "low").length,
      active: priorityFilter === "low",
      onClick: () => setPriorityFilter("low"),
      color: "var(--success)",
    },
  ];

  // Make a shallow copy before sorting so we don't mutate the original items array from the hook
  const recentActivity = [...items]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);

  // Collapsed sidebar (icon-only)
  if (!sidebarOpen) {
    return (
      <div className="sidebar-collapsed fade-in-left">
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Open sidebar"
          type="button"
        >
          <span className="toggle-icon">➡️</span>
        </button>

        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar-collapsed-item ${
              item.active ? "active" : ""
            } hover-lift`}
            onClick={item.onClick}
            title={item.label}
            type="button"
          >
            <span className="sidebar-icon" aria-hidden>
              {item.icon}
            </span>
            <span className="sidebar-badge">{item.count}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <aside className="sidebar fade-in-left" aria-label="Sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header scale-in">
        <div className="sidebar-brand">
          <span className="brand-icon">🌊</span>
          <span className="brand-text">Dashboard</span>
        </div>
        <button
          className="sidebar-toggle"
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
          type="button"
        >
          <span className="toggle-icon">⬅️</span>
        </button>
      </div>

      {/* Quick Stats */}
      <div className="sidebar-section">
        <div className="sidebar-stats-grid stagger-children">
          <div className="sidebar-stat-card hover-lift">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-number">{totalItems}</div>
              <div className="stat-text">Total</div>
            </div>
          </div>

          <div className="sidebar-stat-card hover-lift">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-number">{highPriorityItems}</div>
              <div className="stat-text">Urgent</div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Status */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span className="section-icon">📋</span>
          <h3 className="sidebar-title">By Status</h3>
        </div>

        <nav
          className="sidebar-nav stagger-children"
          aria-label="Status filters"
        >
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${
                item.active ? "active" : ""
              } hover-lift`}
              onClick={item.onClick}
              type="button"
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              <span className="sidebar-count" style={{ color: item.color }}>
                {item.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Navigation - Priority */}
      <div className="sidebar-section">
        <div className="sidebar-section-header">
          <span className="section-icon">🎯</span>
          <h3 className="sidebar-title">By Priority</h3>
        </div>

        <nav
          className="sidebar-nav stagger-children"
          aria-label="Priority filters"
        >
          {priorityItems.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item ${
                item.active ? "active" : ""
              } hover-lift`}
              onClick={item.onClick}
              type="button"
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
              <span className="sidebar-count" style={{ color: item.color }}>
                {item.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Recent Activity */}
      <div className="sidebar-section sidebar-activity">
        <div className="sidebar-section-header">
          <span className="section-icon">⏱️</span>
          <h3 className="sidebar-title">Recent Activity</h3>
        </div>

        <div className="activity-list">
          {recentActivity.length > 0 ? (
            recentActivity.map((item) => (
              <div key={item.id} className="activity-item hover-lift">
                <div
                  className="activity-dot"
                  style={{
                    background:
                      item.priority === "high"
                        ? "var(--danger)"
                        : item.priority === "medium"
                        ? "var(--warning)"
                        : "var(--success)",
                  }}
                />
                <div className="activity-content">
                  <div className="activity-title">{item.title}</div>

                  <div className="activity-meta">
                    <span className={`activity-badge badge-${item.status}`}>
                      {item.status}
                    </span>

                    <span className="activity-time">
                      {getRelativeTime(item.updated_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="activity-empty">
              <span className="empty-icon">📭</span>
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="sidebar-section sidebar-progress">
        <div className="sidebar-section-header">
          <span className="section-icon">📈</span>
          <h3 className="sidebar-title">Progress Overview</h3>
        </div>

        <div className="progress-item">
          <div className="progress-header">
            <span className="progress-label">Completion Rate</span>
            <span className="progress-value">
              {totalItems > 0
                ? Math.round((closedItems / totalItems) * 100)
                : 0}
              %
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  totalItems > 0 ? (closedItems / totalItems) * 100 : 0
                }%`,
                background:
                  "linear-gradient(90deg, var(--accent), var(--success))",
              }}
            />
          </div>
        </div>

        <div className="progress-item">
          <div className="progress-header">
            <span className="progress-label">In Progress</span>
            <span className="progress-value">
              {totalItems > 0
                ? Math.round((inProgressItems / totalItems) * 100)
                : 0}
              %
            </span>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${
                  totalItems > 0 ? (inProgressItems / totalItems) * 100 : 0
                }%`,
                background:
                  "linear-gradient(90deg, var(--sun), var(--warning))",
              }}
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="sidebar-footer">
        <button
          className="sidebar-action-btn hover-lift"
          onClick={() => {
            setStatusFilter("all");
            setPriorityFilter("all");
          }}
          type="button"
        >
          <span className="action-icon">🔄</span>
          <span className="action-text">Reset Filters</span>
        </button>
      </div>
    </aside>
  );
};

// Helper: safe relative time
const getRelativeTime = (dateString) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  if (isNaN(date)) return "Unknown";
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export default Sidebar;
