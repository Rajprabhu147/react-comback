import React, { useState } from "react";
// Layout wrapper that provides page title, subtitle, back button, header actions
import PageLayout from "../components/Layout/PageLayout";
// Tab content components
import AppearanceSettings from "../components/Settings/AppearanceSettings";
// import PreferencesSettings from "../components/Settings/PreferencesSettings";
import DataManagement from "../components/Settings/DataManagement";
// Reusable button component
import Button from "../components/Shared/Button";
// Zustand settings store hook (for resetting settings)
import { useSettingsStore } from "../store/settingsStore";
// Toast notifications for user feedback
import toast from "react-hot-toast";
// Page-specific styles
import "../styles/settings.css";

const Settings = () => {
  // Grab resetSettings action from global settings store
  const resetSettings = useSettingsStore((state) => state.resetSettings);

  // Local state to track which tab is active (appearance | preferences | data)
  const [activeTab, setActiveTab] = useState("appearance");

  // State to track reset button loading state
  const [resetting, setResetting] = useState(false);

  // Tabs metadata used to render the tab bar
  const tabs = [
    { id: "appearance", label: "Appearance", icon: "🎨" },
    // { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "data", label: "Data & Privacy", icon: "🔒" },
  ];

  /**
   * handleTabKeyDown
   * Implements keyboard navigation for tab component
   * - Arrow Right/Down: next tab
   * - Arrow Left/Up: previous tab
   * - Home: first tab
   * - End: last tab
   */
  const handleTabKeyDown = (e) => {
    const tabIds = tabs.map((t) => t.id);
    const currentIndex = tabIds.indexOf(activeTab);

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % tabIds.length;
      setActiveTab(tabIds[nextIndex]);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + tabIds.length) % tabIds.length;
      setActiveTab(tabIds[prevIndex]);
    } else if (e.key === "Home") {
      e.preventDefault();
      setActiveTab(tabIds[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      setActiveTab(tabIds[tabIds.length - 1]);
    }
  };

  /**
   * handleResetAll
   * Resets all settings to defaults with confirmation
   * - Shows confirmation dialog
   * - Shows loading state during reset
   * - Handles errors gracefully with toast
   * - Syncs changes to database via store
   */
  const handleResetAll = async () => {
    if (
      !window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      return;
    }

    setResetting(true);
    try {
      await resetSettings();
      toast.success("All settings have been reset to default");
    } catch (error) {
      toast.error("Failed to reset settings: " + error.message);
      console.error("Reset settings error:", error);
    } finally {
      setResetting(false);
    }
  };

  return (
    // PageLayout provides consistent header, back button, and an optional headerAction
    <PageLayout
      title="Settings" // main page title
      subtitle="Customize your dashboard experience" // subtitle under the title
      showBackButton={true} // show a back button in the header
      headerAction={
        // Header action button (Reset All) — placed on the right side of the page header
        <Button
          variant="secondary"
          onClick={handleResetAll}
          disabled={resetting}
          loading={resetting}
          aria-label="Reset all settings to default values"
        >
          🔄 {resetting ? "Resetting..." : "Reset All"}
        </Button>
      }
    >
      <div className="settings-container">
        {/* TABS NAVIGATION */}
        {/* role="tablist" groups all tabs for accessibility */}
        <div className="settings-tabs" role="tablist">
          {tabs.map((tab) => (
            // Each tab button updates local activeTab state when clicked
            // Keyboard navigation supported via arrow keys, Home, and End
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={handleTabKeyDown}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              id={`tab-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
            >
              {/* small icon for quick recognition (marked as decorative for screen readers) */}
              <span className="tab-icon" aria-hidden="true">
                {tab.icon}
              </span>
              {/* readable label */}
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENT AREA */}
        {/* role="tabpanel" groups content with its tab for accessibility */}
        <div
          className="settings-content"
          role="tabpanel"
          id={`${activeTab}-panel`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {/* Conditionally render the selected tab's component */}
          {activeTab === "appearance" && <AppearanceSettings />}
          {/* {activeTab === "preferences" && <PreferencesSettings />} */}
          {activeTab === "data" && <DataManagement />}
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
