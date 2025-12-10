import React from "react";

/**
 * NotificationSettings Component
 *
 * Manages notification preferences:
 * - Email notifications
 * - Push/browser notifications
 * - Notification sound
 *
 * Syncs changes to Supabase via the settings store.
 */

// Mock store for demo - replace with your actual import
const mockSettingsStore = {
  emailNotifications: true,
  pushNotifications: true,
  notificationSound: true,
  error: null,
  setEmailNotifications: (val) => console.log("Email notifications:", val),
  setPushNotifications: (val) => console.log("Push notifications:", val),
  setNotificationSound: (val) => console.log("Notification sound:", val),
};

const NotificationSettings = () => {
  // In your actual app, use:
  // const { ... } = useSettingsStore();

  const {
    emailNotifications,
    pushNotifications,
    notificationSound,
    setEmailNotifications,
    setPushNotifications,
    setNotificationSound,
    error,
  } = mockSettingsStore;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Notification Settings
        </h3>
        <p className="text-gray-600 mt-1">
          Control how you receive notifications
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Settings List */}
      <div className="space-y-4">
        {/* Email Notifications Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Email Notifications
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Receive notifications via email
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Push Notifications Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Push Notifications
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Get push notifications in browser
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={pushNotifications}
              onChange={(e) => setPushNotifications(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {/* Notification Sound Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
          <div>
            <label className="block text-sm font-semibold text-gray-900">
              Notification Sound
            </label>
            <p className="text-sm text-gray-600 mt-1">
              Play sound for new notifications
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={notificationSound}
              onChange={(e) => setNotificationSound(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      {/* Tip Section */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
        <span className="text-xl">💡</span>
        <div>
          <p className="text-sm font-semibold text-blue-900">Pro Tip</p>
          <p className="text-sm text-blue-700 mt-1">
            Enable push notifications for instant updates across all your
            devices
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
