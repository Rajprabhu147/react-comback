import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // adjust path as needed

/**
 * useSettingsStore
 * ---------------------------------------------------
 * A global Zustand store that manages:
 * - Appearance settings (theme, compact mode)
 * - Notification preferences (email, push, sound)
 * - Privacy options (show email, activity)
 * - User interface preferences (items per page, view type)
 *
 * Synced with Supabase database for persistence across devices.
 * Falls back to localStorage if DB is unavailable.
 */

export const useSettingsStore = create((set, get) => ({
  /* Appearance Settings */
  theme: "light",
  compactMode: false,

  /* Notification Settings */
  emailNotifications: true,
  pushNotifications: true,
  notificationSound: true,

  /* Privacy Settings */
  showEmail: false,
  showActivity: true,

  /* User Preferences */
  itemsPerPage: 10,
  defaultView: "grid",
  autoSave: true,

  /* State tracking */
  loading: false,
  error: null,
  synced: false,

  /**
   * initializeSettings()
   * Fetch user settings from Supabase on app load
   */
  initializeSettings: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        // User not authenticated, use localStorage defaults
        const saved = localStorage.getItem("app-settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          set({ ...parsed, loading: false, synced: false });
        } else {
          set({ loading: false, synced: false });
        }
        return;
      }

      // Fetch settings from database
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        set({
          theme: data.theme || "light",
          compactMode: data.compact_mode || false,
          emailNotifications: data.email_notifications !== false,
          pushNotifications: data.push_notifications !== false,
          notificationSound: data.notification_sound !== false,
          showEmail: data.show_email || false,
          showActivity: data.show_activity !== false,
          itemsPerPage: data.items_per_page || 10,
          defaultView: data.default_view || "grid",
          autoSave: data.auto_save !== false,
          loading: false,
          synced: true,
        });
      } else {
        // First time user, create default settings
        await supabase.from("user_settings").insert([
          {
            user_id: user.id,
            theme: "light",
            compact_mode: false,
            email_notifications: true,
            push_notifications: true,
            notification_sound: true,
            show_email: false,
            show_activity: true,
            items_per_page: 10,
            default_view: "grid",
            auto_save: true,
          },
        ]);

        set({ loading: false, synced: true });
      }
    } catch (err) {
      set({
        error: err.message,
        loading: false,
        synced: false,
      });
      console.error("Failed to initialize settings:", err);
    }
  },

  /**
   * updateSettingInDB(field, value)
   * Helper function to sync a single setting to database
   */
  updateSettingInDB: async (field, value) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Map frontend field names to database column names
      const dbFieldMap = {
        theme: "theme",
        compactMode: "compact_mode",
        emailNotifications: "email_notifications",
        pushNotifications: "push_notifications",
        notificationSound: "notification_sound",
        showEmail: "show_email",
        showActivity: "show_activity",
        itemsPerPage: "items_per_page",
        defaultView: "default_view",
        autoSave: "auto_save",
      };

      const dbField = dbFieldMap[field];
      if (!dbField) return;

      const { error } = await supabase
        .from("user_settings")
        .update({ [dbField]: value })
        .eq("user_id", user.id);

      if (error) throw error;

      set({ error: null });
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to update setting:", err);
    }
  },

  /* Appearance Setters */
  setTheme: (theme) => {
    set({ theme });
    get().updateSettingInDB("theme", theme);
  },

  setCompactMode: (compactMode) => {
    set({ compactMode });
    get().updateSettingInDB("compactMode", compactMode);
  },

  /* Notification Setters */
  setEmailNotifications: (emailNotifications) => {
    set({ emailNotifications });
    get().updateSettingInDB("emailNotifications", emailNotifications);
  },

  setPushNotifications: (pushNotifications) => {
    set({ pushNotifications });
    get().updateSettingInDB("pushNotifications", pushNotifications);

    // Request browser permission if enabling
    if (pushNotifications && "Notification" in window) {
      Notification.requestPermission();
    }
  },

  setNotificationSound: (notificationSound) => {
    set({ notificationSound });
    get().updateSettingInDB("notificationSound", notificationSound);
  },

  /* Privacy Setters */
  setShowEmail: (showEmail) => {
    set({ showEmail });
    get().updateSettingInDB("showEmail", showEmail);
  },

  setShowActivity: (showActivity) => {
    set({ showActivity });
    get().updateSettingInDB("showActivity", showActivity);
  },

  /* Preference Setters */
  setItemsPerPage: (itemsPerPage) => {
    set({ itemsPerPage });
    get().updateSettingInDB("itemsPerPage", itemsPerPage);
  },

  setDefaultView: (defaultView) => {
    set({ defaultView });
    get().updateSettingInDB("defaultView", defaultView);
  },

  setAutoSave: (autoSave) => {
    set({ autoSave });
    get().updateSettingInDB("autoSave", autoSave);
  },

  /**
   * resetSettings()
   * Reset all settings to defaults and sync to database
   */
  resetSettings: async () => {
    const defaults = {
      theme: "light",
      compactMode: false,
      emailNotifications: true,
      pushNotifications: true,
      notificationSound: true,
      showEmail: false,
      showActivity: true,
      itemsPerPage: 10,
      defaultView: "grid",
      autoSave: true,
    };

    set(defaults);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_settings")
        .update({
          theme: "light",
          compact_mode: false,
          email_notifications: true,
          push_notifications: true,
          notification_sound: true,
          show_email: false,
          show_activity: true,
          items_per_page: 10,
          default_view: "grid",
          auto_save: true,
        })
        .eq("user_id", user.id);

      if (error) throw error;
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to reset settings:", err);
    }
  },
}));
