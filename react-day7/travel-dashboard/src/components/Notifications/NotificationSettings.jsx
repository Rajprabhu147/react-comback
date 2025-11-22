import React from "react";
import { useSettingsStore } from "../../store/settingsStore";

/**
 * NotificationSettings Component
 *
 * This component allows the user to control how they want to receive notifications.
 * It interacts with the global settings store (Zustand) and updates preferences such as:
 * - Email notifications
 * - Push/browser notifications
 * - Notification sound
 *
 * It displays toggle switches for each setting and updates the store when changed.
 */
const NotificationSettings = () => {
  // Extract notification settings + setter functions from Zustand store
  const {
    emailNotifications,
    pushNotifications,
    notificationSound,
    setEmailNotifications,
    setPushNotifications,
    setNotificationSound,
  } = useSettingsStore();

  return (
    // Main settings card container
    <div className="notification-settings-card">
      {/* Card title */}
      <h3 className="settings-title">Notification Settings</h3>

      {/* Short description under title */}
      <p className="settings-description">
        Control how you receive notifications
      </p>

      {/* List of toggle settings */}
      <div className="settings-list">
        {/* Email Notifications Toggle */}
        <div className="setting-item">
          {/* Label + description */}
          <div className="setting-info">
            <div className="setting-label">Email Notifications</div>
            <div className="setting-description">
              Receive notifications via email
            </div>
          </div>

          {/* Toggle switch (controlled by Zustand state) */}
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={emailNotifications} // reflect current value
              onChange={(e) => setEmailNotifications(e.target.checked)} // update global store
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Push Notifications Toggle */}
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">Push Notifications</div>
            <div className="setting-description">
              Get push notifications in browser
            </div>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>

        {/* Notification Sound Toggle */}
        <div className="setting-item">
          <div className="setting-info">
            <div className="setting-label">Notification Sound</div>
            <div className="setting-description">
              Play sound for new notifications
            </div>
          </div>

          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={notificationSound}
              onChange={(e) => setNotificationSound(e.target.checked)}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>

      {/* Helpful tip displayed at bottom */}
      <div className="settings-tip">
        <span className="tip-icon">💡</span>
        <span className="tip-text">
          Tip: Enable push notifications for instant updates
        </span>
      </div>
    </div>
  );
};

export default NotificationSettings;
