import React, { useState } from "react";
// navigation helper (used after destructive actions like sign-out or delete)
import { useNavigate } from "react-router-dom";
// settings store (Zustand) to read/write privacy related flags
import { useSettingsStore } from "../../store/settingsStore";
import "../../styles/data-management.css";
import Button from "../Shared/Button";
import toast from "react-hot-toast";

const DataManagement = () => {
  // router navigation instance to redirect the user after actions
  const navigate = useNavigate();

  // read and write visibility settings from global settings store
  const { showEmail, showActivity, setShowEmail, setShowActivity } =
    useSettingsStore();

  // local UI state to show progress while exporting or clearing cache
  const [exporting, setExporting] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Export data: simulate gathering all user data, build a JSON file,
  // trigger browser download and show toast feedback.
  const handleExportData = async () => {
    setExporting(true);
    try {
      // simulate latency while creating export
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: replace simulated data with real API calls to fetch user data
      const data = {
        exported_at: new Date().toISOString(),
        user: "user@example.com",
        items: [],
        settings: {},
      };

      // create a downloadable blob and programmatically click an <a> to download
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dashboard-export-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);

      // notify success
      toast.success("Data exported successfully!");
    } catch (error) {
      // log the error and show error toast on failure
      console.error("Export data error:", error);
      toast.error("Failed to export data");
    } finally {
      setExporting(false);
    }
  };

  // Clear browser-side caches: localStorage, sessionStorage and service-worker caches.
  // Provides confirmation and reloads the page to ensure app picks up cleared state.
  const handleClearCache = async () => {
    if (
      !window.confirm("Clear all cached data? This will not delete your items.")
    ) {
      return;
    }

    setClearing(true);
    try {
      // remove specific app key(s) and clear session storage
      localStorage.removeItem("app-settings");
      sessionStorage.clear();

      // if the browser supports Cache API, remove all caches
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }

      toast.success("Cache cleared successfully!");

      // reload after a short delay so user sees confirmation first
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      // log error and notify user
      console.error("Clear cache error:", error);
      toast.error("Failed to clear cache");
    } finally {
      setClearing(false);
    }
  };

  // Placeholder for a backup download feature; currently just shows a toast
  const handleDownloadBackup = () => {
    toast.success("Backup download started");
    // TODO: Implement real backup logic (server-side packaging + secure download)
  };

  return (
    <div className="settings-section">
      {/* Privacy toggles — control what profile information is visible */}
      <div className="section-block">
        <h3 className="section-block-title">Privacy Settings</h3>
        <p className="section-block-description">
          Control what information is visible to others
        </p>

        <div className="settings-options">
          {/* Toggle: show/hide email on public profile — bound to settings store */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Show Email Address</div>
              <div className="option-description">
                Display your email on your public profile
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={showEmail} // reflects current store state
                onChange={(e) => setShowEmail(e.target.checked)} // updates store on change
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Toggle: show/hide activity status — bound to settings store */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Show Activity Status</div>
              <div className="option-description">
                Let others see when you're online
              </div>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={showActivity} // reflects current store state
                onChange={(e) => setShowActivity(e.target.checked)} // updates store
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          {/* Analytics toggle (UI-only here) */}
          <div className="option-item">
            <div className="option-info">
              <div className="option-label">Analytics</div>
              <div className="option-description">
                Help us improve by sharing usage data
              </div>
            </div>
            <label className="toggle-switch">
              {/* defaultChecked used — not persisted to store in this implementation */}
              <input type="checkbox" defaultChecked />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Data Export block — Export / Backup actions */}
      <div className="section-block">
        <h3 className="section-block-title">Data Export</h3>
        <p className="section-block-description">
          Download a copy of all your data
        </p>

        <div className="data-actions">
          {/* Action: Export All Data — wired to handleExportData which triggers download */}
          <div className="data-action-item">
            <div className="data-action-info">
              <div className="data-action-icon">📥</div>
              <div>
                <div className="data-action-title">Export All Data</div>
                <div className="data-action-description">
                  Download all your items, settings, and activity in JSON format
                </div>
              </div>
            </div>
            <Button onClick={handleExportData} loading={exporting}>
              Export Data
            </Button>
          </div>

          {/* Action: Download Backup — placeholder calling a toast */}
          <div className="data-action-item">
            <div className="data-action-info">
              <div className="data-action-icon">💾</div>
              <div>
                <div className="data-action-title">Download Backup</div>
                <div className="data-action-description">
                  Create a complete backup of your account
                </div>
              </div>
            </div>
            <Button variant="secondary" onClick={handleDownloadBackup}>
              Download Backup
            </Button>
          </div>
        </div>
      </div>

      {/* Storage & Cache block — shows usage and provides cache clearing */}
      <div className="section-block">
        <h3 className="section-block-title">Storage & Cache</h3>
        <p className="section-block-description">
          Manage local storage and cached data
        </p>

        {/* Storage summary — static values here, could be calculated dynamically */}
        <div className="storage-info">
          <div className="storage-item">
            <div className="storage-label">Local Storage Used</div>
            <div className="storage-value">2.3 MB</div>
          </div>
          <div className="storage-item">
            <div className="storage-label">Cache Size</div>
            <div className="storage-value">5.7 MB</div>
          </div>
          <div className="storage-item">
            <div className="storage-label">Total Items</div>
            <div className="storage-value">0</div>
          </div>
        </div>

        {/* Clear cache button — calls handleClearCache which clears local/session/cache and reloads */}
        <Button
          variant="secondary"
          onClick={handleClearCache}
          loading={clearing}
          style={{ marginTop: "16px" }}
        >
          🗑️ Clear Cache
        </Button>
      </div>

      {/* Session Management block — view & revoke active sessions */}
      <div className="section-block">
        <h3 className="section-block-title">Session Management</h3>
        <p className="section-block-description">
          View and manage your active sessions
        </p>

        <div className="sessions-list">
          {/* Current session (static example). In a real app these would be fetched/managed server-side */}
          <div className="session-item active">
            <div className="session-icon">💻</div>
            <div className="session-info">
              <div className="session-title">Current Device</div>
              <div className="session-details">
                Chrome 120 • Windows 10 • Chennai, India
              </div>
              <div className="session-time">Active now</div>
            </div>
            <span className="session-badge">Current</span>
          </div>

          {/* Another session example with a Revoke button */}
          <div className="session-item">
            <div className="session-icon">📱</div>
            <div className="session-info">
              <div className="session-title">iPhone 13</div>
              <div className="session-details">
                Safari • iOS 17 • Last seen 2 hours ago
              </div>
              <div className="session-time">Last active: Today at 2:30 PM</div>
            </div>
            <Button variant="secondary" size="sm">
              Revoke
            </Button>
          </div>
        </div>

        {/* Global sign-out across devices (UI only here) */}
        <Button variant="danger" style={{ marginTop: "16px" }}>
          🚪 Sign Out All Devices
        </Button>
      </div>

      {/* Danger Zone — destructive actions related to data/account */}
      <div className="section-block danger-zone">
        <h3 className="section-block-title">⚠️ Danger Zone</h3>
        <p className="section-block-description">
          Irreversible actions that permanently affect your data
        </p>

        <div className="danger-actions">
          {/* Clear All Data — needs server-side implementation to actually delete */}
          <div className="danger-action-item">
            <div>
              <div className="danger-action-title">Clear All Data</div>
              <div className="danger-action-description">
                Permanently delete all your items and activity
              </div>
            </div>
            <Button variant="danger">Clear All Data</Button>
          </div>

          {/* Delete Account — navigates to profile for further confirmation/flow */}
          <div className="danger-action-item">
            <div>
              <div className="danger-action-title">Delete Account</div>
              <div className="danger-action-description">
                Permanently delete your account and all data
              </div>
            </div>
            <Button variant="danger" onClick={() => navigate("/profile")}>
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagement;
