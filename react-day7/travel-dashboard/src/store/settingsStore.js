import { create } from "zustand";
import { supabase } from "../lib/supabaseClient"; // adjust path as needed

/**
 * useSettingsStore
 * Global Zustand store for managing application settings
 *
 * Manages:
 * - Appearance settings (theme: light/dark/coastal, compact mode, font size, animations)
 * - Notification preferences (email, push, sound)
 * - Privacy options (show email, activity)
 * - User interface preferences (items per page, view type, auto save)
 *
 * Features:
 * - Synced with Supabase database for persistence across devices
 * - Falls back to localStorage if DB is unavailable
 * - Error handling and state tracking
 */

export const useSettingsStore = create((set, get) => ({
  /* ===== Appearance Settings ===== */
  theme: "light", // light, dark, coastal
  compactMode: false,
  fontSize: 14,
  animations: true,

  /* ===== Notification Settings ===== */
  emailNotifications: true,
  pushNotifications: true,
  notificationSound: true,

  /* ===== Privacy Settings ===== */
  showEmail: false,
  showActivity: true,

  /* ===== User Preferences ===== */
  itemsPerPage: 10,
  defaultView: "grid",
  autoSave: true,

  /* ===== State Tracking ===== */
  loading: false,
  error: null,
  synced: false,

  /**
   * initializeSettings
   * Fetches user settings from Supabase on app load
   * Falls back to localStorage if user is not authenticated
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
        // User settings exist, load them
        set({
          theme: data.theme || "light",
          compactMode: data.compact_mode || false,
          fontSize: data.font_size || 14,
          animations: data.animations !== false,
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
            font_size: 14,
            animations: true,
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
   * updateSettingInDB
   * Helper function to sync a single setting to the database
   * Maps frontend field names to database column names
   */
  updateSettingInDB: async (field, value) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.warn("User not authenticated, settings not synced to database");
        return;
      }

      // Map frontend field names to database column names
      const dbFieldMap = {
        theme: "theme",
        compactMode: "compact_mode",
        fontSize: "font_size",
        animations: "animations",
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
      if (!dbField) {
        console.warn(`Unknown setting field: ${field}`);
        return;
      }

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

  /* ===== Appearance Setters ===== */

  /**
   * setTheme
   * Updates theme and syncs to database
   * Supported themes: light, dark, coastal
   */
  setTheme: (theme) => {
    const validTheme = ["light", "dark", "coastal"].includes(theme)
      ? theme
      : "light";
    set({ theme: validTheme });
    get().updateSettingInDB("theme", validTheme);
  },

  /**
   * setCompactMode
   * Toggles compact mode and syncs to database
   */
  setCompactMode: (compactMode) => {
    set({ compactMode });
    get().updateSettingInDB("compactMode", compactMode);
  },

  /**
   * setFontSize
   * Updates font size (12-20px) and syncs to database
   */
  setFontSize: (fontSize) => {
    const validSize = Math.max(12, Math.min(20, fontSize));
    set({ fontSize: validSize });
    get().updateSettingInDB("fontSize", validSize);
  },

  /**
   * setAnimations
   * Toggles animations and syncs to database
   */
  setAnimations: (animations) => {
    set({ animations });
    get().updateSettingInDB("animations", animations);
  },

  /* ===== Notification Setters ===== */

  /**
   * setEmailNotifications
   * Toggles email notifications and syncs to database
   */
  setEmailNotifications: (emailNotifications) => {
    set({ emailNotifications });
    get().updateSettingInDB("emailNotifications", emailNotifications);
  },

  /**
   * setPushNotifications
   * Toggles push notifications and syncs to database
   * Requests browser permission if enabling
   */
  setPushNotifications: (pushNotifications) => {
    set({ pushNotifications });
    get().updateSettingInDB("pushNotifications", pushNotifications);

    // Request browser permission if enabling
    if (pushNotifications && "Notification" in window) {
      Notification.requestPermission();
    }
  },

  /**
   * setNotificationSound
   * Toggles notification sound and syncs to database
   */
  setNotificationSound: (notificationSound) => {
    set({ notificationSound });
    get().updateSettingInDB("notificationSound", notificationSound);
  },

  /* ===== Privacy Setters ===== */

  /**
   * setShowEmail
   * Toggles email visibility on public profile and syncs to database
   */
  setShowEmail: (showEmail) => {
    set({ showEmail });
    get().updateSettingInDB("showEmail", showEmail);
  },

  /**
   * setShowActivity
   * Toggles activity status visibility and syncs to database
   */
  setShowActivity: (showActivity) => {
    set({ showActivity });
    get().updateSettingInDB("showActivity", showActivity);
  },

  /* ===== Preference Setters ===== */

  /**
   * setItemsPerPage
   * Updates items per page (5, 10, 20, 50, 100) and syncs to database
   */
  setItemsPerPage: (itemsPerPage) => {
    set({ itemsPerPage });
    get().updateSettingInDB("itemsPerPage", itemsPerPage);
  },

  /**
   * setDefaultView
   * Updates default view type (grid, list, compact) and syncs to database
   */
  setDefaultView: (defaultView) => {
    set({ defaultView });
    get().updateSettingInDB("defaultView", defaultView);
  },

  /**
   * setAutoSave
   * Toggles auto-save and syncs to database
   */
  setAutoSave: (autoSave) => {
    set({ autoSave });
    get().updateSettingInDB("autoSave", autoSave);
  },

  /**
   * resetSettings
   * Resets all settings to their default values and syncs to database
   */
  resetSettings: async () => {
    const defaults = {
      theme: "light",
      compactMode: false,
      fontSize: 14,
      animations: true,
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

      if (!user) {
        console.warn("User not authenticated, settings reset locally only");
        return;
      }

      const { error } = await supabase
        .from("user_settings")
        .update({
          theme: "light",
          compact_mode: false,
          font_size: 14,
          animations: true,
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

      set({ error: null });
    } catch (err) {
      set({ error: err.message });
      console.error("Failed to reset settings:", err);
      throw err;
    }
  },
}));
