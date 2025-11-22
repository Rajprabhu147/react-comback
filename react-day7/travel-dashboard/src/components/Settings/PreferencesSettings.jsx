import React from "react";
// Zustand settings store hook to read/write user preferences
import { useSettingsStore } from "../../store/settingsStore";
// Toast notifications for quick feedback
import toast from "react-hot-toast";

/**
 * PreferencesSettings
 *
 * UI for general, view, regional and keyboard-shortcut preferences.
 * Reads/writes values from the global settings store so changes persist app-wide.
 */
const PreferencesSettings = () => {
  // Extract preference values and setter functions from the settings store
  const {
    itemsPerPage,
    defaultView,
    autoSave,
    setItemsPerPage,
    setDefaultView,
    setAutoSave,
  } = useSettingsStore();

  // Helper to update itemsPerPage in the store and give user feedback
  const handleItemsPerPageChange = (value) => {
    setItemsPerPage(Number(value));
    toast.success(`Items per page set to ${value}`);
  };

  return (
    <div className="settings-section">
      {/* --- General Preferences block --- */}
      <div className="section-block">
        <h3 className="section-block-title">General Preferences</h3>
        <p className="section-block-description">
          Customize your workflow and default behaviors
        </p>

        <div className="settings-options">
          {/* Auto-save toggle */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Auto-save</div>
              <div className="option-description">
                Automatically save changes without confirmation
              </div>
            </div>
            <label className="toggle-switch">
              {/* Controlled checkbox bound to autoSave from the store */}
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Keyboard Shortcuts toggle (UI-only here) */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Keyboard Shortcuts</div>
              <div className="option-description">
                Enable keyboard shortcuts for faster navigation
              </div>
            </div>
            <label className="toggle-switch">
              {/* defaultChecked used — not wired to store (replace with store binding if you want persistence) */}
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Confirm on Delete toggle (UI-only here) */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Confirm on Delete</div>
              <div className="option-description">
                Show confirmation dialog before deleting items
              </div>
            </div>
            <label className="toggle-switch">
              {/* defaultChecked used — consider binding to store for persistence */}
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* --- View Settings block --- */}
      <div className="section-block">
        <h3 className="section-block-title">View Settings</h3>
        <p className="section-block-description">
          Configure how items are displayed in lists
        </p>

        {/* Default View select — bound to store's defaultView */}
        <div className="form-group">
          <label className="form-label">Default View</label>
          <select
            className="form-select"
            value={defaultView}
            onChange={(e) => setDefaultView(e.target.value)}
          >
            <option value="grid">Grid View</option>
            <option value="list">List View</option>
            <option value="compact">Compact View</option>
          </select>
        </div>

        {/* Items Per Page select — uses handler to update store + show toast */}
        <div className="form-group">
          <label className="form-label">Items Per Page</label>
          <select
            className="form-select"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(e.target.value)}
          >
            <option value="5">5 items</option>
            <option value="10">10 items</option>
            <option value="20">20 items</option>
            <option value="50">50 items</option>
            <option value="100">100 items</option>
          </select>
        </div>

        {/* Sort By Default — UI-only select (not wired to store here) */}
        <div className="form-group">
          <label className="form-label">Sort By Default</label>
          <select className="form-select" defaultValue="updated">
            <option value="created">Date Created</option>
            <option value="updated">Last Updated</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* --- Language & Region block --- */}
      <div className="section-block">
        <h3 className="section-block-title">Language & Region</h3>
        <p className="section-block-description">
          Set your language and regional preferences
        </p>

        {/* Language select — UI-only here (add store binding to persist preference) */}
        <div className="form-group">
          <label className="form-label">Language</label>
          <select className="form-select" defaultValue="en">
            <option value="en">English (US)</option>
            <option value="en-gb">English (UK)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        {/* Timezone select — UI-only; consider using 'auto' detection logic in store */}
        <div className="form-group">
          <label className="form-label">Timezone</label>
          <select className="form-select" defaultValue="auto">
            <option value="auto">Auto-detect</option>
            <option value="utc">UTC</option>
            <option value="pst">Pacific Time (PST)</option>
            <option value="est">Eastern Time (EST)</option>
            <option value="ist">India Standard Time (IST)</option>
          </select>
        </div>

        {/* Date format select — UI-only */}
        <div className="form-group">
          <label className="form-label">Date Format</label>
          <select className="form-select" defaultValue="mdy">
            <option value="mdy">MM/DD/YYYY (US)</option>
            <option value="dmy">DD/MM/YYYY (UK)</option>
            <option value="ymd">YYYY-MM-DD (ISO)</option>
          </select>
        </div>
      </div>

      {/* --- Keyboard Shortcuts block (documentation / hint UI) --- */}
      <div className="section-block">
        <h3 className="section-block-title">Keyboard Shortcuts</h3>
        <p className="section-block-description">
          Learn keyboard shortcuts to work faster
        </p>

        {/* Static list of useful shortcuts (helpful reference) */}
        <div className="shortcuts-list">
          <div className="shortcut-item">
            <span className="shortcut-keys">
              <kbd>Ctrl</kbd> + <kbd>N</kbd>
            </span>
            <span className="shortcut-description">Create new item</span>
          </div>

          <div className="shortcut-item">
            <span className="shortcut-keys">
              <kbd>Ctrl</kbd> + <kbd>S</kbd>
            </span>
            <span className="shortcut-description">Save changes</span>
          </div>

          <div className="shortcut-item">
            <span className="shortcut-keys">
              <kbd>Ctrl</kbd> + <kbd>F</kbd>
            </span>
            <span className="shortcut-description">Search items</span>
          </div>

          <div className="shortcut-item">
            <span className="shortcut-keys">
              <kbd>Esc</kbd>
            </span>
            <span className="shortcut-description">Close dialog</span>
          </div>

          <div className="shortcut-item">
            <span className="shortcut-keys">
              <kbd>?</kbd>
            </span>
            <span className="shortcut-description">Show all shortcuts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesSettings;
