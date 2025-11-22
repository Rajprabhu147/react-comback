import React, { useState } from "react";
// Layout wrapper that provides page title, subtitle, back button, header actions
import PageLayout from "../components/Layout/PageLayout";
// Tab content components
import AppearanceSettings from "../components/Settings/AppearanceSettings";
import PreferencesSettings from "../components/Settings/PreferencesSettings";
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

  // Tabs metadata used to render the tab bar
  const tabs = [
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
    { id: "data", label: "Data & Privacy", icon: "🔒" },
  ];

  // Handler to reset all settings to defaults
  // Confirms with the user, calls the store action, and shows a toast on success
  const handleResetAll = () => {
    if (
      window.confirm("Are you sure you want to reset all settings to default?")
    ) {
      resetSettings();
      toast.success("All settings have been reset to default");
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
        <Button variant="secondary" onClick={handleResetAll}>
          🔄 Reset All
        </Button>
      }
    >
      <div className="settings-container">
        {/* TABS NAVIGATION */}
        <div className="settings-tabs">
          {tabs.map((tab) => (
            // Each tab button updates local activeTab state when clicked
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {/* small icon for quick recognition */}
              <span className="tab-icon">{tab.icon}</span>
              {/* readable label */}
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENT AREA */}
        <div className="settings-content">
          {/* Conditionally render the selected tab's component */}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "preferences" && <PreferencesSettings />}
          {activeTab === "data" && <DataManagement />}
        </div>
      </div>
    </PageLayout>
  );
};

export default Settings;
