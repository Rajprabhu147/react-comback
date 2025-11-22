import { create } from "zustand";

export const useNotificationStore = create((set, get) => ({
  notifications: [
    {
      id: "1",
      type: "success",
      title: "Item Created",
      message:
        'Your new item "Beach Trip Planning" has been created successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
      category: "items",
    },
    {
      id: "2",
      type: "info",
      title: "System Update",
      message:
        "A new version of the dashboard is available. Please refresh to update.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      category: "system",
    },
    {
      id: "3",
      type: "warning",
      title: "High Priority Item",
      message: "You have 3 high-priority items that need attention.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: true,
      category: "items",
    },
  ],
  unreadCount: 2,
  filter: "all",

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),

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

  setFilter: (filter) => set({ filter }),
}));
