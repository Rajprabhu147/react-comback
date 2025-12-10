import React, { useState } from "react";

/**
 * NotificationSettings Component
 *
 * Manages notification preferences:
 * - Email notifications
 * - Push/browser notifications
 * - Notification sound
 *
 * This is a demo with local state. In your app, connect it to useSettingsStore.
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <h1 className="text-3xl font-bold text-white">
              Notification Settings
            </h1>
            <p className="text-blue-100 mt-2">
              Control how you receive notifications
            </p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 rounded flex items-start gap-3">
                <span className="text-red-600 text-xl">⚠️</span>
                <div>
                  <p className="font-semibold text-red-900">Error</p>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>
                <div>
                  <p className="font-semibold text-green-900">Success</p>
                  <p className="text-green-700 text-sm">{success}</p>
                </div>
              </div>
            )}

            {/* Settings List */}
            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">📧</span>
                  <div>
                    <label className="block text-base font-semibold text-gray-900">
                      Email Notifications
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Receive notifications via email to stay informed
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">🔔</span>
                  <div>
                    <label className="block text-base font-semibold text-gray-900">
                      Push Notifications
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Get instant push notifications in your browser
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle("pushNotifications")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Notification Sound */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-1">🔊</span>
                  <div>
                    <label className="block text-base font-semibold text-gray-900">
                      Notification Sound
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      Play a sound when you receive new notifications
                    </p>
                  </div>
                </div>

                <label className="relative inline-flex items-center cursor-pointer ml-4 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.notificationSound}
                    onChange={() => handleToggle("notificationSound")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">💡</span>
              <div>
                <p className="font-semibold text-blue-900">Pro Tip</p>
                <p className="text-blue-700 text-sm mt-1">
                  Enable push notifications for instant updates. You can manage
                  browser permissions anytime in your browser settings.
                </p>
              </div>
            </div>

            {/* Status Info */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Current Status:</span> Your
                notification preferences are{" "}
                <span className="text-green-600 font-semibold">
                  automatically saved
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
