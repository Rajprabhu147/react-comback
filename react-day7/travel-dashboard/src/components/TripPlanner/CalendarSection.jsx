import React, { useState, useEffect } from "react";
import "../../styles/appearanceSettings.css";

/**
 * AppearanceSettings Component
 *
 * Manages appearance preferences:
 * - Theme selection (Light, Dark, Auto)
 * - Font size adjustment
 * - Accent color customization
 *
 * All styling is in AppearanceSettings.css
 */

const AppearanceSettings = ({ themeStore }) => {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [fontSize, setFontSize] = useState(16);
  const [accentColor, setAccentColor] = useState("#3b82f6");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Apply theme directly to DOM
  const applyThemeDirect = (theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
    } else if (theme === "light") {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
    } else if (theme === "auto") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      if (prefersDark) {
        root.classList.add("dark-theme");
        root.classList.remove("light-theme");
      } else {
        root.classList.add("light-theme");
        root.classList.remove("dark-theme");
      }
    }
  };

  // Sync with external theme store
  useEffect(() => {
    if (!themeStore) return;

    const unsubscribe = themeStore.subscribe((theme) => {
      console.log("📌 Theme changed in store:", theme);
      applyThemeDirect(theme);
      // Update local state only to reflect the change in UI
      setCurrentTheme(theme);
    });

    // Cleanup subscription
    return () => unsubscribe?.();
  }, [themeStore]);

  const handleThemeChange = (newTheme) => {
    try {
      setCurrentTheme(newTheme);
      applyThemeDirect(newTheme);
      themeStore?.setState(newTheme);
      setError(null);
      setSuccess("Theme updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to change theme:", err);
      setError("Failed to change theme");
    }
  };

  const handleFontSizeChange = (e) => {
    const newSize = parseInt(e.target.value);
    try {
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}px`;
      setError(null);
      setSuccess("Font size updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to change font size:", err);
      setError("Failed to change font size");
    }
  };

  const handleAccentColorChange = (e) => {
    const newColor = e.target.value;
    try {
      setAccentColor(newColor);
      document.documentElement.style.setProperty("--accent-color", newColor);
      setError(null);
      setSuccess("Accent color updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to change accent color:", err);
      setError("Failed to change accent color");
    }
  };

  return (
    <div className="appearance-settings-container">
      <div className="appearance-settings-wrapper">
        {/* Card Container */}
        <div className="appearance-settings-card">
          {/* Header */}
          <div className="settings-header">
            <h1 className="settings-title">Appearance Settings</h1>
            <p className="settings-subtitle">
              Customize how your dashboard looks
            </p>
          </div>

          {/* Content */}
          <div className="settings-content">
            {/* Error Message */}
            {error && (
              <div className="alert alert-error">
                <span className="alert-icon">⚠️</span>
                <div className="alert-body">
                  <p className="alert-title">Error</p>
                  <p className="alert-message">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="alert alert-success">
                <span className="alert-icon">✓</span>
                <div className="alert-body">
                  <p className="alert-title">Success</p>
                  <p className="alert-message">{success}</p>
                </div>
              </div>
            )}

            {/* Settings List */}
            <div className="settings-list">
              {/* Theme Selection */}
              <div className="setting-item">
                <div className="setting-left">
                  <span className="setting-icon">🎨</span>
                  <div className="setting-text">
                    <label className="setting-label">Theme</label>
                    <p className="setting-description">
                      Choose your preferred theme
                    </p>
                  </div>
                </div>

                <div className="theme-selector">
                  {["light", "dark", "auto"].map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                      className={`theme-btn ${
                        currentTheme === theme ? "active" : ""
                      }`}
                    >
                      {theme.charAt(0).toUpperCase() + theme.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Adjustment */}
              <div className="setting-item">
                <div className="setting-left">
                  <span className="setting-icon">📝</span>
                  <div className="setting-text">
                    <label className="setting-label">Font Size</label>
                    <p className="setting-description">
                      Adjust text size for better readability
                    </p>
                  </div>
                </div>

                <div className="font-size-control">
                  <input
                    type="range"
                    min="12"
                    max="20"
                    value={fontSize}
                    onChange={handleFontSizeChange}
                    className="font-size-slider"
                  />
                  <span className="font-size-display">{fontSize}px</span>
                </div>
              </div>

              {/* Accent Color */}
              <div className="setting-item">
                <div className="setting-left">
                  <span className="setting-icon">🎭</span>
                  <div className="setting-text">
                    <label className="setting-label">Accent Color</label>
                    <p className="setting-description">
                      Choose your accent color
                    </p>
                  </div>
                </div>

                <div className="color-picker-container">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={handleAccentColorChange}
                    className="color-picker"
                  />
                  <span className="color-value">{accentColor}</span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="settings-divider"></div>

            {/* Info Section */}
            <div className="info-box">
              <span className="info-icon">💡</span>
              <div className="info-content">
                <p className="info-title">Pro Tip</p>
                <p className="info-text">
                  Use the Auto theme to automatically switch between light and
                  dark based on your system preferences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
