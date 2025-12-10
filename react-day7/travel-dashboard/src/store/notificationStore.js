import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * useNotificationStore
 *
 * Global Zustand store for managing notifications
 * - Display notifications with filtering
 * - Mark as read / unread
 * - Delete notifications
 * - Add new notifications
 * - Filter by status (all, unread, system)
 * - Persists to localStorage
 */

export const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [
        {
          id: "1",
          type: "success",
          title: "System Updated",
          message: "Your account settings have been successfully saved.",
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          read: false,
          category: "system",
        },
        {
          id: "2",
          type: "info",
          title: "New Feature Available",
          message: "Check out our latest features and improvements.",
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          read: false,
          category: "system",
        },
        {
          id: "3",
          type: "warning",
          title: "Maintenance Scheduled",
          message: "Scheduled maintenance coming on Sunday 2:00 AM.",
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          read: true,
          category: "system",
        },
      ],

      unreadCount: 2,
      filter: "all",

      /**
       * getFilteredNotifications()
       * Returns notifications based on current filter
       */
      getFilteredNotifications: () => {
        const state = get();
        const { notifications, filter } = state;

        if (filter === "unread") {
          return notifications.filter((n) => !n.read);
        }
        if (filter === "system") {
          return notifications.filter((n) => n.category === "system");
        }
        return notifications; // "all"
      },

      /**
       * markAsRead(id)
       * Mark a single notification as read
       */
      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      /**
       * markAllAsRead()
       * Mark all notifications as read
       */
      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
          unreadCount: 0,
        })),

      /**
       * deleteNotification(id)
       * Remove a notification from the list
       */
      deleteNotification: (id) =>
        set((state) => {
          const notification = state.notifications.find((n) => n.id === id);

          return {
            notifications: state.notifications.filter((n) => n.id !== id),
            unreadCount:
              notification && !notification.read
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
          };
        }),

      /**
       * addNotification(notification)
       * Add a new notification to the top of the list
       */
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
              read: false,
            },
            ...state.notifications,
          ],
          unreadCount: state.unreadCount + 1,
        })),

      /**
       * setFilter(filter)
       * Filter notifications by: all | unread | system
       */
      setFilter: (filter) => set({ filter }),

      /**
       * clearAll()
       * Delete all notifications
       */
      clearAll: () =>
        set({
          notifications: [],
          unreadCount: 0,
        }),
    }),
    {
      name: "notification-store",
    }
  )
);
