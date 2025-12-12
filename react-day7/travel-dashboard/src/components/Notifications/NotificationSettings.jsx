import React, { useState } from "react";
import "../../styles/notificationSettings.css";

/**
 * NotificationSettings Component
 *
 * Manages notification preferences:
 * - Email notifications
 * - Push/browser notifications
 * - Notification sound
 *
 * All styling is in NotificationSettings.css
 */

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    notificationSound: true,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleToggle = (key) => {
    try {
      setSettings((prev) => ({
        ...prev,
        [key]: !prev[key],
      }));
      setError(null);
      setSuccess("Setting updated successfully");
      setTimeout(() => setSuccess(null), 3000);

      // Request push notification permission if enabling
      if (
        key === "pushNotifications" &&
        !settings.pushNotifications &&
        "Notification" in window
      ) {
        if (Notification.permission === "default") {
          Notification.requestPermission();
        }
      }
    } catch (err) {
      setError("Failed to update setting");
    }
  };

  return (
    <div className="notification-settings-container">
      <div className="notification-settings-wrapper">
        {/* Card Container */}
        <div className="notification-settings-card">
          {/* Header */}
          <div className="settings-header">
            <h1 className="settings-title">Notification Settings</h1>
            <p className="settings-subtitle">
              Control how you receive notifications
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
              {/* Email Notifications */}
              <div className="setting-item">
                <div className="setting-left">
                  <span className="setting-icon">📧</span>
                  <div className="setting-text">
                    <label className="setting-label">Email Notifications</label>
                    <p className="setting-description">
                      Receive notifications via email to stay informed
                    </p>
                  </div>
                </div>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="setting-item">
                <div className="setting-left">
                  <span className="setting-icon">🔔</span>
                  <div className="setting-text">
                    <label className="setting-label">Push Notifications</label>
                    <p className="setting-description">
                      Get instant push notifications in your browser
                    </p>
                  </div>
                </div>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle("pushNotifications")}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>

              {/* Notification Sound */}
              <div className="setting-item">
                <div className="setting-left">
                  <span className="setting-icon">🔊</span>
                  <div className="setting-text">
                    <label className="setting-label">Notification Sound</label>
                    <p className="setting-description">
                      Play a sound when you receive new notifications
                    </p>
                  </div>
                </div>

                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notificationSound}
                    onChange={() => handleToggle("notificationSound")}
                  />
                  <span className="toggle-slider"></span>
                </label>
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
                  Enable push notifications for instant updates. You can manage
                  browser permissions anytime in your browser settings.
                </p>
              </div>
            </div>

            {/* Status Info */}
            <div className="status-box">
              <p className="status-text">
                <span className="status-label">Current Status:</span> Your
                notification preferences are
                <span className="status-value">automatically saved</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
