import React from "react";
// Pull values & setters for appearance-related settings from the global settings store (Zustand)
import { useSettingsStore } from "../../store/settingsStore";
// Pull sidebar state and toggle from UI store to let this component control sidebar visibility
import { useUIStore } from "../../store/uiStore";
// Toast used to show quick success feedback when theme changes
import toast from "react-hot-toast";

/**
 * AppearanceSettings
 *
 * UI for selecting theme, toggling display options (compact mode, sidebar, animations),
 * and adjusting font-size. Persists choices via the global settings store and updates
 * the app's UI state (sidebar visibility) through the UI store.
 */
const AppearanceSettings = () => {
  // read current theme and compactMode flag and setters from the settings store
  const { theme, compactMode, setTheme, setCompactMode } = useSettingsStore();

  // read whether sidebar is open and the toggle action from uiStore
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  // local list of theme options displayed as selectable cards
  const themes = [
    {
      id: "light",
      label: "Light",
      icon: "☀️",
      description: "Classic light theme",
    },
    { id: "dark", label: "Dark", icon: "🌙", description: "Easy on the eyes" },
    {
      id: "auto",
      label: "Auto",
      icon: "🔄",
      description: "Match system preference",
    },
  ];

  // handler: set new theme in store and show a success toast to the user
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(`Theme changed to ${newTheme}`);
  };

  return (
    <div className="settings-section">
      {/* THEME SELECTION BLOCK */}
      <div className="section-block">
        <h3 className="section-block-title">Theme</h3>
        <p className="section-block-description">
          Choose how you want the dashboard to look
        </p>

        {/* Grid of theme option cards */}
        <div className="theme-grid">
          {themes.map((t) => (
            // Each card toggles the theme when clicked; 'active' class highlights the chosen theme
            <button
              key={t.id}
              className={`theme-card ${theme === t.id ? "active" : ""}`}
              onClick={() => handleThemeChange(t.id)}
            >
              {/* Icon for quick visual recognition */}
              <div className="theme-icon">{t.icon}</div>

              {/* Label + short description */}
              <div className="theme-info">
                <div className="theme-label">{t.label}</div>
                <div className="theme-description">{t.description}</div>
              </div>

              {/* Checkmark shown when this theme is active */}
              {theme === t.id && <div className="theme-checkmark">✓</div>}
            </button>
          ))}
        </div>

        {/* Preview box that visually demonstrates the selected theme (static markup; style reflects theme) */}
        <div className="theme-preview">
          <div className="preview-label">Preview:</div>
          <div className="preview-box">
            <div className="preview-header">
              <div className="preview-dot"></div>
              <div className="preview-dot"></div>
              <div className="preview-dot"></div>
            </div>
            <div className="preview-content">
              <div className="preview-sidebar"></div>
              <div className="preview-main">
                <div className="preview-card"></div>
                <div className="preview-card"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISPLAY OPTIONS BLOCK */}
      <div className="section-block">
        <h3 className="section-block-title">Display Options</h3>
        <p className="section-block-description">
          Customize how content is displayed
        </p>

        <div className="settings-options">
          {/* Compact Mode toggle */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Compact Mode</div>
              <div className="option-description">
                Reduce spacing and padding throughout the interface
              </div>
            </div>
            <label className="toggle-switch">
              {/* controlled checkbox bound to compactMode; updates store when toggled */}
              <input
                type="checkbox"
                checked={compactMode}
                onChange={(e) => setCompactMode(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Sidebar visibility toggle */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Sidebar Visibility</div>
              <div className="option-description">
                Show or hide the navigation sidebar
              </div>
            </div>
            <label className="toggle-switch">
              {/* checkbox reflects current sidebarOpen state and calls toggleSidebar to change it */}
              <input
                type="checkbox"
                checked={sidebarOpen}
                onChange={toggleSidebar}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Animations toggle (UI-only here; can be wired to store similarly) */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Animations</div>
              <div className="option-description">
                Enable smooth transitions and animations
              </div>
            </div>
            <label className="toggle-switch">
              {/* defaultChecked used (not connected to store) — replace with store binding if persistence desired */}
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* FONT SIZE BLOCK */}
      <div className="section-block">
        <h3 className="section-block-title">Font Size</h3>
        <p className="section-block-description">
          Adjust the size of text throughout the dashboard
        </p>

        <div className="font-size-controls">
          {/* Range input: allows user to set preferred base font size (not persisted here) */}
          <input
            type="range"
            min="12"
            max="20"
            defaultValue="14"
            className="font-slider"
          />
          <div className="font-size-labels">
            {/* Visual labels showing small -> large examples */}
            <span>Aa</span>
            <span style={{ fontSize: "1.2em" }}>Aa</span>
            <span style={{ fontSize: "1.5em" }}>Aa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
