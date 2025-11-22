import React from "react";
// PageLayout wraps the screen with a consistent dashboard layout (title, back button, header actions)
import PageLayout from "../components/Layout/PageLayout";
// Renders a single notification item
import NotificationItem from "../components/Notifications/NotificationItem";
// Renders category filters (All, Unread, Items, System)
import NotificationFilters from "../components/Notifications/NotificationFilters";
// Sidebar component that shows notification preferences/settings
import NotificationSettings from "../components/Notifications/NotificationSettings";
// Zustand store hook managing all notification data + actions
import { useNotificationStore } from "../store/notificationStore";
// Reusable button component
import Button from "../components/Shared/Button";
// Styles for notifications page
import "../styles/notifications.css";

const Notifications = () => {
  // Extract notification state + actions from global store
  const { notifications, filter, unreadCount, markAllAsRead } =
    useNotificationStore();

  // Apply filter logic to notifications list
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread") return !notif.read; // Show only unread
    if (filter === "items") return notif.category === "items"; // Show item-related activity
    if (filter === "system") return notif.category === "system"; // Show system alerts
    return true; // Show all by default
  });

  return (
    <PageLayout
      // Page title shown at the top of the dashboard
      title="Notifications"
      // Dynamic subtitle reflecting unread notification count
      subtitle={`You have ${unreadCount} unread notification${
        unreadCount !== 1 ? "s" : ""
      }`}
      // Shows a back arrow button on the top-left
      showBackButton={true}
      // Optional right-side header button (only if unread notifications exist)
      headerAction={
        unreadCount > 0 && (
          <Button onClick={markAllAsRead}>✓ Mark All as Read</Button>
        )
      }
    >
      <div className="notifications-container">
        <div className="notifications-layout">
          {/* MAIN NOTIFICATION DISPLAY SECTION */}
          <div className="notifications-main">
            {/* Filter buttons (All, Unread, Items, System) */}
            <NotificationFilters />

            <div className="notifications-list">
              {/* If filtered notifications exist, show them */}
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))
              ) : (
                // If no notifications match the filter, show an empty state UI
                <div className="notifications-empty">
                  <div className="empty-icon">🔔</div>
                  <h3 className="empty-title">No Notifications</h3>
                  <p className="empty-description">
                    {filter === "unread"
                      ? "You're all caught up! No unread notifications."
                      : "No notifications to display."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR ON THE RIGHT WITH SETTINGS */}
          <div className="notifications-sidebar">
            {/* Settings for notification preferences (sound, email alerts, etc.) */}
            <NotificationSettings />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Notifications;
