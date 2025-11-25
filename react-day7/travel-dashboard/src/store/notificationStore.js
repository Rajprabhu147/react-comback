import { create } from "zustand";

/**
 * useNotificationStore
 * -------------------------------------------------------
 * Global Zustand store that manages:
 * - Notifications data
 * - Filtering (all, unread, items, system)
 * - Marking as read
 * - Deleting notifications
 * - Adding new in-app notifications
 *
 * This store is used throughout the dashboard to display and
 * update notification state in real-time.
 */
export const useNotificationStore = create((set) => ({
  /* -------------------------------------------------------
   * Default Notification List (sample data for demo)
   * Each notification includes:
   * - id
   * - type (success, warning, error, info)
   * - title + message
   * - timestamp (ISO string)
   * - read status
   * - category (items/system)
   * ------------------------------------------------------- */
  notifications: [
    {
      id: "1",
      type: "success",
      title: "Item Created",
      message:
        'Your new item "Beach Trip Planning" has been created successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      read: false,
      category: "items",
    },
    {
      id: "2",
      type: "info",
      title: "System Update",
      message:
        "A new version of the dashboard is available. Please refresh to update.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      read: false,
      category: "system",
    },
    {
      id: "3",
      type: "warning",
      title: "High Priority Item",
      message: "You have 3 high-priority items that need attention.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: true,
      category: "items",
    },
  ],

  // Tracks number of unread notifications
  unreadCount: 2,

  // Active filter applied on notifications (all | unread | items | system)
  filter: "all",

  /* -------------------------------------------------------
   * markAsRead(id)
   * Marks a single notification as read
   * Reduces unreadCount by 1 (but never below 0)
   * ------------------------------------------------------- */
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  /* -------------------------------------------------------
   * markAllAsRead()
   * Marks every notification as read
   * Sets unreadCount to 0
   * ------------------------------------------------------- */
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

  /* -------------------------------------------------------
   * deleteNotification(id)
   * Removes a notification from the list
   * Reduces unreadCount only if deleted notification was unread
   * ------------------------------------------------------- */
  deleteNotification: (id) =>
    set((state) => {
      // Find deleted notification to check if it was unread
      const notification = state.notifications.find((n) => n.id === id);

      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount:
          notification && !notification.read
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
      };
    }),

  /* -------------------------------------------------------
   * addNotification(notification)
   * Adds a new notification to the top of the list
   * Automatically sets:
   * - new id
   * - timestamp
   * - read = false
   * Increases unreadCount by 1
   * ------------------------------------------------------- */
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        {
          ...notification,
          id: Date.now().toString(), // Unique ID
          timestamp: new Date().toISOString(),
          read: false,
        },
        ...state.notifications,
      ],
      unreadCount: state.unreadCount + 1,
    })),

  /* -------------------------------------------------------
   * setFilter(filter)
   * Updates which notifications the UI should display
   * ------------------------------------------------------- */
  setFilter: (filter) => set({ filter }),
}));
