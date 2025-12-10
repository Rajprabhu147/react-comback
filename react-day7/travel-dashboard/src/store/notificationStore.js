import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // adjust path as needed

/**
 * useNotificationStore
 *
 * Global Zustand store for managing notifications with Supabase integration
 * - Fetch notifications from database
 * - Display notifications with filtering
 * - Mark as read / unread (synced to DB)
 * - Delete notifications (synced to DB)
 * - Add new notifications (synced to DB)
 * - Filter by status (all, unread, system)
 * - Real-time updates from Supabase
 */

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  filter: "all",
  loading: false,
  error: null,

  /**
   * initializeStore()
   * Fetch initial notifications and set up real-time listener
   */
  initializeStore: async () => {
    set({ loading: true, error: null });
    try {
      // Fetch user ID from auth session
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) throw new Error("User not authenticated");

      // Fetch notifications from database
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const unreadCount = data.filter((n) => !n.read).length;
      set({ notifications: data || [], unreadCount, loading: false });

      // Set up real-time listener
      const channel = supabase
        .channel(`notifications:${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const state = get();

            if (payload.eventType === "INSERT") {
              set({
                notifications: [payload.new, ...state.notifications],
                unreadCount: state.unreadCount + 1,
              });
            } else if (payload.eventType === "UPDATE") {
              const updatedNotifications = state.notifications.map((n) =>
                n.id === payload.new.id ? payload.new : n
              );
              const newUnreadCount = updatedNotifications.filter(
                (n) => !n.read
              ).length;
              set({
                notifications: updatedNotifications,
                unreadCount: newUnreadCount,
              });
            } else if (payload.eventType === "DELETE") {
              const deletedNotification = state.notifications.find(
                (n) => n.id === payload.old.id
              );
              set({
                notifications: state.notifications.filter(
                  (n) => n.id !== payload.old.id
                ),
                unreadCount:
                  deletedNotification && !deletedNotification.read
                    ? Math.max(0, state.unreadCount - 1)
                    : state.unreadCount,
              });
            }
          }
        )
        .subscribe();

      return channel;
    } catch (err) {
      set({
        error: err.message,
        loading: false,
      });
      console.error("Failed to initialize notifications:", err);
    }
  },

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
  markAsRead: async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to mark as read:", err);
    }
  },

  /**
   * markAllAsRead()
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);

      if (error) throw error;
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to mark all as read:", err);
    }
  },

  /**
   * deleteNotification(id)
   * Remove a notification from the list
   */
  deleteNotification: async (id) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("id", id);

      if (error) throw error;
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to delete notification:", err);
    }
  },

  /**
   * addNotification(notification)
   * Add a new notification to the database
   */
  addNotification: async (notification) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.from("notifications").insert([
        {
          user_id: user.id,
          type: notification.type || "info",
          title: notification.title,
          message: notification.message,
          category: notification.category || "system",
          read: false,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to add notification:", err);
    }
  },

  /**
   * setFilter(filter)
   * Filter notifications by: all | unread | system
   */
  setFilter: (filter) => set({ filter }),

  /**
   * clearAll()
   * Delete all notifications
   */
  clearAll: async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("notifications")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      set({ notifications: [], unreadCount: 0 });
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to clear all notifications:", err);
    }
  },
}));
