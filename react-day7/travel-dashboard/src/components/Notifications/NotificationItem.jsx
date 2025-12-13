import React from "react";
import { useNotificationStore } from "../../store/notificationStore";

/**
 * NotificationItem
 *
 * Renders a single notification entry with:
 * - icon based on type
 * - title, message and relative timestamp
 * - actions: mark-as-read and delete
 *
 * This component reads notification actions from the global notification store
 * so user interactions update the central app state.
 */
const NotificationItem = ({ notification }) => {
  // Pull actions from the global notification store (Zustand)
  // markAsRead(id) -> marks notification as read in store
  // deleteNotification(id) -> removes the notification from store
  const { markAsRead, deleteNotification } = useNotificationStore();

  // Map notification 'type' to a simple emoji icon for quick visual scanning.
  // Types handled: success, warning, error, info (default).
  const getIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "warning":
        return "⚠️";
      case "error":
        return "❌";
      case "info":
      default:
        return "ℹ️";
    }
  };

  // Convert an ISO timestamp (or Date string) into a human-friendly relative time.
  // Returns "Just now", "Xm ago", "Xh ago", "Xd ago", or a locale date for older items.
  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return time.toLocaleDateString();
  };

  return (
    // Root element: adds 'unread' class when notification.read is falsy to enable visual highlight.
    <div className={`notification-item ${!notification.read ? "unread" : ""}`}>
      {/* Left icon column: visual indicator of notification type */}
      <div className="notification-icon">{getIcon(notification.type)}</div>

      {/* Main content: header (title + time), message body, and action buttons */}
      <div className="notification-content">
        <div className="notification-header">
          {/* Notification title (brief) */}
          <h4 className="notification-title">{notification.title}</h4>

          {/* Relative timestamp for quick context */}
          <span className="notification-time">
            {getTimeAgo(notification.timestamp)}
          </span>
        </div>

        {/* Longer message / description of the notification */}
        <p className="notification-message">{notification.message}</p>

        {/* Actions: Mark as Read (if unread) and Delete */}
        <div className="notification-actions">
          {/* Only show "Mark as Read" when the notification is unread */}
          {!notification.read && (
            <button
              className="notification-action-btn"
              onClick={() => markAsRead(notification.id)} // calls store action to update state
            >
              Mark as Read
            </button>
          )}

          {/* Delete button always available; removes the notification from the store */}
          <button
            className="notification-action-btn danger"
            onClick={() => deleteNotification(notification.id)}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Small visual dot / indicator for unread notifications (renders only when unread) */}
      {!notification.read && <div className="unread-indicator"></div>}
    </div>
  );
};

export default NotificationItem;
