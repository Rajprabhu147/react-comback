// src/components/Settings/AppearanceSettings.jsx
import React, { useEffect } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { useUIStore } from "../../store/uiStore";
import toast from "react-hot-toast";
import "../../styles/appearanceSettings.css";

/**
 * AppearanceSettings Component
 * Manages theme, display options, and font size preferences
 *
 * Features:
 * - 3 themes (light, dark, coastal)
 * - Compact mode toggle
 * - Sidebar visibility control
 * - Animations toggle
 * - Font size adjustment
 * - All settings persist to database via Zustand store
 */
const AppearanceSettings = () => {
  const {
    theme,
    compactMode,
    fontSize,
    animations,
    setTheme,
    setCompactMode,
    setFontSize,
    setAnimations,
  } = useSettingsStore();

  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  const themes = [
    {
      id: "light",
      label: "Light",
      icon: "☀️",
      description: "Classic light theme",
    },
    {
      id: "dark",
      label: "Dark",
      icon: "🌙",
      description: "Easy on the eyes",
    },
    {
      id: "coastal",
      label: "Coastal",
      icon: "🌊",
      description: "Soft coastal blues",
    },
  ];

  /**
   * Apply theme to HTML element
   * Sets data-theme attribute directly on document.documentElement
   */
  useEffect(() => {
    const applyTheme = () => {
      const html = document.documentElement;

      if (theme === "light") {
        // Remove attribute for light theme (uses default CSS)
        html.removeAttribute("data-theme");
        console.log("Theme applied: light (attribute removed)");
      } else {
        // Set attribute for dark or coastal
        html.setAttribute("data-theme", theme);
        console.log(`Theme applied: ${theme}`, {
          htmlAttribute: html.getAttribute("data-theme"),
        });
      }
    };

    applyTheme();
  }, [theme]);

  /**
   * Apply compact mode class to body for CSS-based responsive adjustments
   */
  useEffect(() => {
    if (compactMode) {
      document.body.classList.add("compact-mode");
    } else {
      document.body.classList.remove("compact-mode");
    }
  }, [compactMode]);

  /**
   * Apply font size to document root
   */
  useEffect(() => {
    const validSize = fontSize || 14;
    document.documentElement.style.fontSize = `${validSize}px`;
  }, [fontSize]);

  /**
   * Handles theme selection with store update and user feedback
   */
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    toast.success(
      `${newTheme[0].toUpperCase() + newTheme.slice(1)} theme applied`
    );
  };

  /**
   * Handles compact mode toggle
   */
  const handleCompactModeChange = (isCompact) => {
    setCompactMode(isCompact);
    toast.success(isCompact ? "Compact mode enabled" : "Compact mode disabled");
  };

  /**
   * Handles font size change
   */
  const handleFontSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setFontSize(newSize);
    toast.success(`Font size set to ${newSize}px`);
  };

  /**
   * Handles animations toggle
   */
  const handleAnimationsChange = (e) => {
    setAnimations(e.target.checked);
    toast.success(
      e.target.checked ? "Animations enabled" : "Animations disabled"
    );
  };

  return (
    <div className="appearance-settings">
      {/* Theme Selection Section */}
      <div className="appearance-block">
        <h3 className="appearance-block-title">Theme</h3>
        <p className="appearance-block-description">
          Choose how you want the dashboard to look
        </p>

        <div className="theme-grid">
          {themes.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`theme-card ${isActive ? "active" : ""}`}
                onClick={() => handleThemeChange(t.id)}
                aria-pressed={isActive}
                aria-label={`Select ${t.label} theme: ${t.description}`}
                title={t.description}
              >
                <div className="theme-icon" aria-hidden="true">
                  {t.icon}
                </div>

                <div className="theme-info">
                  <div className="theme-label">{t.label}</div>
                  <div className="theme-description">{t.description}</div>
                </div>

                {isActive && (
                  <div className="theme-checkmark" aria-hidden="true">
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Theme Preview */}
        <div className="theme-preview">
          <div className="preview-label">Preview (live)</div>
          <div className="preview-box">
            <div className="preview-header">
              <div className="preview-dot" />
              <div className="preview-dot" />
              <div className="preview-dot" />
            </div>
            <div className="preview-content" aria-hidden="true">
              <div className="preview-sidebar" />
              <div className="preview-main">
                <div className="preview-card" />
                <div className="preview-card" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Display Options Section */}
      <div className="appearance-block">
        <h3 className="appearance-block-title">Display Options</h3>
        <p className="appearance-block-description">
          Customize how content is displayed
        </p>

        <div className="display-options">
          {/* Compact Mode Toggle */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Compact Mode</div>
              <div className="option-description">
                Reduce spacing and padding throughout the interface
              </div>
            </div>
            <label className="toggle-switch" aria-label="Toggle compact mode">
              <input
                type="checkbox"
                checked={!!compactMode}
                onChange={(e) => handleCompactModeChange(!!e.target.checked)}
                aria-describedby="compact-mode-desc"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Sidebar Visibility Toggle */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Sidebar Visibility</div>
              <div className="option-description">
                Show or hide the navigation sidebar
              </div>
            </div>
            <label
              className="toggle-switch"
              aria-label="Toggle sidebar visibility"
            >
              <input
                type="checkbox"
                checked={!!sidebarOpen}
                onChange={() => toggleSidebar()}
                aria-describedby="sidebar-desc"
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Animations Toggle */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Animations</div>
              <div className="option-description">
                Enable smooth transitions and animations
              </div>
            </div>
            <label className="toggle-switch" aria-label="Toggle animations">
              <input
                type="checkbox"
                checked={!!animations}
                onChange={handleAnimationsChange}
                aria-describedby="animations-desc"
              />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      {/* Font Size Section */}
      <div className="appearance-block appearance-block-last">
        <h3 className="appearance-block-title">Font Size</h3>
        <p className="appearance-block-description">
          Adjust the size of text throughout the dashboard
        </p>

        <div className="font-size-controls">
          <input
            type="range"
            min="12"
            max="20"
            value={fontSize || 14}
            className="font-slider"
            aria-label="Base font size"
            aria-valuemin="12"
            aria-valuemax="20"
            aria-valuenow={fontSize || 14}
            aria-valuetext={`${fontSize || 14} pixels`}
            onChange={handleFontSizeChange}
          />
          <div className="font-size-labels">
            <span className="font-size-label">Aa</span>
            <span className="font-size-label font-size-label-medium">Aa</span>
            <span className="font-size-label font-size-label-large">Aa</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
