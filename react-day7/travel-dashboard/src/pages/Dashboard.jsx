import React, { useState, useEffect } from "react";
import Header from "../components/Layout/Header";
import Sidebar from "../components/Layout/Sidebar";
import ItemsList from "../components/Items/ItemsList";
import ItemEditor from "../components/Items/ItemEditor";
import AnalyticsCharts from "../components/Analytics/AnalyticsCharts";
import { useRealtimeSubscription } from "../hooks/useRealtime";
import { useUIStore } from "../store/uiStore";
import { useItems } from "../hooks/useItems";

const Dashboard = () => {
  useRealtimeSubscription();

  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSelectedItem = useUIStore((state) => state.setSelectedItem);
  const { data: items = [] } = useItems();

  /**
   * Initialize welcome screen state lazily.
   * This avoids calling setState inside a useEffect.
   */
  const [showWelcome, setShowWelcome] = useState(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    return !hasVisited && items.length === 0;
  });

  /**
   * Persist "hasVisited" only when showWelcome becomes true.
   * No setState inside effect → no lint warnings.
   */
  useEffect(() => {
    if (showWelcome) {
      try {
        localStorage.setItem("hasVisited", "true");
      } catch {
        // ignore storage write errors
      }
    }
  }, [showWelcome]);

  const handleDismissWelcome = () => {
    setShowWelcome(false);
  };

  const handleCreateFirst = () => {
    setShowWelcome(false);
    setSelectedItem({});
  };

  return (
    <div className="app">
      <Header />
      <div className="app-container">
        <Sidebar />

        <main className="main-content">
          {showWelcome && (
            <div className="welcome-overlay">
              <div className="welcome-card scale-in">
                <div className="welcome-icon bounce">🌊</div>

                <h1
                  className="welcome-title gradient-shift"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary), var(--accent))",
                    backgroundSize: "200% 200%",
                  }}
                >
                  Welcome to Travel Dashboard!
                </h1>

                <p className="welcome-description">
                  Your journey begins here. Start by creating your first travel
                  item and organize all your adventures in one beautiful place.
                </p>

                <div className="welcome-features stagger-children">
                  <div className="welcome-feature">
                    <span className="feature-icon">📝</span>
                    <span className="feature-text">Create & Manage Items</span>
                  </div>
                  <div className="welcome-feature">
                    <span className="feature-icon">📊</span>
                    <span className="feature-text">Track Progress</span>
                  </div>
                  <div className="welcome-feature">
                    <span className="feature-icon">⚡</span>
                    <span className="feature-text">Real-time Updates</span>
                  </div>
                </div>

                <div className="welcome-actions">
                  <button
                    className="btn btn-primary"
                    onClick={handleCreateFirst}
                  >
                    🚀 Create Your First Item
                  </button>

                  <button
                    className="btn btn-secondary"
                    onClick={handleDismissWelcome}
                  >
                    Explore Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Grid */}
          <div className="grid-dashboard">
            <ItemsList />
            <AnalyticsCharts />
          </div>
        </main>
      </div>

      {/* Editor Modal */}
      <ItemEditor />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && window.innerWidth < 1024 && (
        <div className="sidebar-overlay fade-in" onClick={toggleSidebar} />
      )}
    </div>
  );
};

export default Dashboard;
