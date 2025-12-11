// src/components/Settings/AppearanceSettings.jsx
import React, { useEffect, useRef } from "react";
import { useSettingsStore } from "../../store/settingsStore";
import { useUIStore } from "../../store/uiStore";
import toast from "react-hot-toast";
import "../../styles/AppearanceSettings.css";

/**
 * AppearanceSettings Component
 * Manages theme, display options, and font size preferences
 *
 * Features:
 * - Multiple themes (light, dark, coastal, contrast, auto)
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

  const mediaListenerRef = useRef(null);

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
    {
      id: "contrast",
      label: "High Contrast",
      icon: "⚫️",
      description: "High contrast accessibility",
    },
    {
      id: "auto",
      label: "Auto",
      icon: "🔄",
      description: "Match system preference",
    },
  ];

  /**
   * Applies a concrete theme by setting data-theme attribute on <html>
   * Light theme removes the attribute to use default CSS variables
   */
  const applyConcreteTheme = (themeId) => {
    const root = document.documentElement;
    if (!root) return;

    if (themeId === "light") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", themeId);
    }

    console.log(`Theme applied: ${themeId}`, {
      htmlAttribute: root.getAttribute("data-theme"),
    });
  };

  /**
   * Enables auto theme detection based on system preference
   * Listens for changes to system theme preference
   */
  const enableAutoTheme = () => {
    const mq =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    if (!mq) {
      applyConcreteTheme("light");
      return;
    }

    applyConcreteTheme(mq.matches ? "dark" : "light");

    const listener = (e) => {
      applyConcreteTheme(e.matches ? "dark" : "light");
    };

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", listener);
      mediaListenerRef.current = { mq, listener, method: "addEventListener" };
    } else if (typeof mq.addListener === "function") {
      mq.addListener(listener);
      mediaListenerRef.current = { mq, listener, method: "addListener" };
    }
  };

  /**
   * Removes the media query listener when switching away from auto theme
   */
  const removeAutoListener = () => {
    const saved = mediaListenerRef.current;
    if (!saved) return;

    const { mq, listener, method } = saved;
    if (
      method === "addEventListener" &&
      typeof mq.removeEventListener === "function"
    ) {
      mq.removeEventListener("change", listener);
    } else if (
      method === "addListener" &&
      typeof mq.removeListener === "function"
    ) {
      mq.removeListener(listener);
    }

    mediaListenerRef.current = null;
  };

  /**
   * Apply theme changes when store value updates
   */
  useEffect(() => {
    removeAutoListener();

    if (theme === "auto") {
      enableAutoTheme();
    } else {
      applyConcreteTheme(theme || "light");
    }

    return () => removeAutoListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    removeAutoListener();

    if (newTheme === "auto") {
      enableAutoTheme();
      toast.success("Theme set to Auto (following system preference)");
    } else {
      applyConcreteTheme(newTheme);
      toast.success(
        `${newTheme[0].toUpperCase() + newTheme.slice(1)} theme applied`
      );
    }
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
