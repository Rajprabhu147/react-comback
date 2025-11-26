// src/components/Settings/AppearanceSettings.jsx
import React, { useEffect, useRef } from "react";
// Pull values & setters for appearance-related settings from the global settings store (Zustand)
import { useSettingsStore } from "../../store/settingsStore";
// Pull sidebar state and toggle from UI store to let this component control sidebar visibility
import { useUIStore } from "../../store/uiStore";
import toast from "react-hot-toast";

/**
 * AppearanceSettings — updated to integrate with theme.css
 *
 * - themes: light | dark | coastal | contrast | auto
 * - setting a theme updates document.documentElement.dataset.theme (or removes it for 'light')
 * - 'auto' follows prefers-color-scheme and reacts to changes.
 */
const AppearanceSettings = () => {
  const { theme, compactMode, setTheme, setCompactMode } = useSettingsStore();
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);

  // keep ref to media listener so we can remove it when needed
  const mediaListenerRef = useRef(null);

  // All supported themes (match your theme.css)
  const themes = [
    {
      id: "light",
      label: "Light",
      icon: "☀️",
      description: "Classic light theme",
    },
    { id: "dark", label: "Dark", icon: "🌙", description: "Easy on the eyes" },
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

  // helper: apply a concrete theme to document <html>
  const applyConcreteTheme = (themeId) => {
    const root = document.documentElement;
    if (!root) return;
    if (themeId === "light") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", themeId);
    }
  };

  // If user chooses 'auto', set theme according to system preference and add listener.
  const enableAutoTheme = () => {
    const mq =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    if (!mq) {
      // fallback to light if matchMedia not available
      applyConcreteTheme("light");
      return;
    }

    // set initial
    applyConcreteTheme(mq.matches ? "dark" : "light");

    // add listener to respond to system changes
    const listener = (e) => {
      applyConcreteTheme(e.matches ? "dark" : "light");
    };

    // modern addEventListener for MediaQueryList or fallback to addListener
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", listener);
      mediaListenerRef.current = { mq, listener, method: "addEventListener" };
    } else if (typeof mq.addListener === "function") {
      mq.addListener(listener);
      mediaListenerRef.current = { mq, listener, method: "addListener" };
    }
  };

  // remove any previously registered media listener
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

  // when the stored theme changes (from store or initial), apply it
  useEffect(() => {
    removeAutoListener();

    if (theme === "auto") {
      enableAutoTheme();
    } else {
      applyConcreteTheme(theme || "light");
    }

    // cleanup on unmount
    return () => removeAutoListener();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // handler used by UI: sets store then applies
  const handleThemeChange = (newTheme) => {
    // update store
    setTheme(newTheme);

    // if new is auto, enable listener; otherwise remove listener and apply directly
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
          {themes.map((t) => {
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                type="button"
                className={`theme-card ${isActive ? "active" : ""}`}
                onClick={() => handleThemeChange(t.id)}
                aria-pressed={isActive}
                title={t.description}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                <div className="theme-icon" aria-hidden>
                  {t.icon}
                </div>

                <div className="theme-info">
                  <div className="theme-label">{t.label}</div>
                  <div className="theme-description">{t.description}</div>
                </div>

                {isActive && (
                  <div className="theme-checkmark" aria-hidden>
                    ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Preview box: note — preview uses the actual global theme (we change <html> directly),
            so the preview shows live changes immediately. */}
        <div className="theme-preview" style={{ marginTop: 18 }}>
          <div className="preview-label">Preview (live)</div>
          <div className="preview-box">
            <div className="preview-header">
              <div className="preview-dot" />
              <div className="preview-dot" />
              <div className="preview-dot" />
            </div>
            <div className="preview-content" aria-hidden>
              <div className="preview-sidebar" />
              <div className="preview-main">
                <div className="preview-card" />
                <div className="preview-card" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DISPLAY OPTIONS BLOCK */}
      <div className="section-block" style={{ marginTop: 18 }}>
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
            <label className="toggle-switch" aria-label="Toggle compact mode">
              <input
                type="checkbox"
                checked={!!compactMode}
                onChange={(e) => setCompactMode(!!e.target.checked)}
              />
              <span className="toggle-slider" />
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
            <label className="toggle-switch" aria-label="Toggle sidebar">
              <input
                type="checkbox"
                checked={!!sidebarOpen}
                onChange={() => toggleSidebar()}
              />
              <span className="toggle-slider" />
            </label>
          </div>

          {/* Animations toggle (UI-only) */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Animations</div>
              <div className="option-description">
                Enable smooth transitions and animations
              </div>
            </div>
            <label className="toggle-switch" aria-label="Toggle animations">
              {/* If you persist animations setting later, replace defaultChecked with store binding */}
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider" />
            </label>
          </div>
        </div>
      </div>

      {/* FONT SIZE BLOCK */}
      <div className="section-block" style={{ marginTop: 18 }}>
        <h3 className="section-block-title">Font Size</h3>
        <p className="section-block-description">
          Adjust the size of text throughout the dashboard
        </p>

        <div className="font-size-controls">
          <input
            type="range"
            min="12"
            max="20"
            defaultValue="14"
            className="font-slider"
            aria-label="Base font size"
            onChange={(e) => {
              // quick, immediate font-size adjustment applied to root for demo.
              // if you want persistence, save to store instead.
              document.documentElement.style.fontSize = `${e.target.value}px`;
            }}
          />
          <div className="font-size-labels">
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
