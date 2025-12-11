import { create } from "zustand";
import { supabase } from "../lib/supabaseClient";

/**
 * useSettingsStore
 *
 * Global Zustand store that manages:
 * - Theme (light/dark) - Applied to document
 * - Compact mode - CSS class applied
 * - Notification preferences - Actually uses sound & permissions
 * - UI preferences - Used in pagination & view toggling
 * - Auto-save - Automatically saves trip activities
 *
 * All settings synced with Supabase and applied to UI in real-time
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
  defaultView: "grid", // "grid" or "list"
  autoSave: true,

  /* State tracking */
  loading: false,
  error: null,
  synced: false,

  /**
   * initializeSettings()
   * Fetch user settings from Supabase and apply them to UI
   */
  initializeSettings: async () => {
    set({ loading: true, error: null });
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        // Not authenticated - use localStorage
        const saved = localStorage.getItem("app-settings");
        if (saved) {
          const parsed = JSON.parse(saved);
          set({ ...parsed, loading: false, synced: false });
          get().applyTheme(parsed.theme);
          get().applyCompactMode(parsed.compactMode);
        } else {
          set({ loading: false, synced: false });
          get().applyTheme("light");
        }
        return;
      }

      // Fetch from Supabase
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        const settings = {
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
        };

        set(settings);

        // Apply theme and compact mode to UI
        get().applyTheme(settings.theme);
        get().applyCompactMode(settings.compactMode);

        // Request push notification permission if enabled
        if (settings.pushNotifications) {
          get().requestPushPermission();
        }
      } else {
        // First-time user - create default settings
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
        get().applyTheme("light");
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
   * applyTheme(theme)
   * Apply theme to document (light/dark)
   */
  applyTheme: (theme) => {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      document.documentElement.style.colorScheme = "dark";
    } else {
      document.documentElement.setAttribute("data-theme", "light");
      document.documentElement.style.colorScheme = "light";
    }
  },

  /**
   * applyCompactMode(compact)
   * Apply compact mode CSS class to body
   */
  applyCompactMode: (compact) => {
    if (compact) {
      document.body.classList.add("compact-mode");
    } else {
      document.body.classList.remove("compact-mode");
    }
  },

  /**
   * playNotificationSound()
   * Play notification sound if enabled
   */
  playNotificationSound: () => {
    const state = get();
    if (!state.notificationSound) return;

    try {
      // Use Web Audio API to create a simple beep
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // 800 Hz frequency
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (err) {
      console.error("Failed to play notification sound:", err);
    }
  },

  /**
   * requestPushPermission()
   * Properly request browser push notification permission
   */
  requestPushPermission: () => {
    if (!("Notification" in window)) {
      console.warn("Browser does not support notifications");
      return;
    }

    if (Notification.permission === "granted") {
      // Already granted
      return;
    }

    if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          // Show test notification
          new Notification("Notifications enabled!", {
            body: "You will receive activity notifications",
            icon: "🔔",
          });
        }
      });
    }
  },

  /**
   * updateSettingInDB(field, value)
   * Sync a single setting to database
   */
  updateSettingInDB: async (field, value) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        // Save to localStorage if not authenticated
        const saved = localStorage.getItem("app-settings") || "{}";
        const settings = JSON.parse(saved);
        settings[field] = value;
        localStorage.setItem("app-settings", JSON.stringify(settings));
        return;
      }

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
    get().applyTheme(theme);
    get().updateSettingInDB("theme", theme);
  },

  setCompactMode: (compactMode) => {
    set({ compactMode });
    get().applyCompactMode(compactMode);
    get().updateSettingInDB("compactMode", compactMode);
  },

  /* Notification Setters */
  setEmailNotifications: (emailNotifications) => {
    set({ emailNotifications });
    get().updateSettingInDB("emailNotifications", emailNotifications);
  },

  setPushNotifications: (pushNotifications) => {
    set({ pushNotifications });

    if (pushNotifications) {
      get().requestPushPermission();
    }

    get().updateSettingInDB("pushNotifications", pushNotifications);
  },

  setNotificationSound: (notificationSound) => {
    set({ notificationSound });
    get().updateSettingInDB("notificationSound", notificationSound);

    // Play test sound if enabling
    if (notificationSound) {
      setTimeout(() => get().playNotificationSound(), 300);
    }
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
   * Reset all settings to defaults
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
    get().applyTheme("light");
    get().applyCompactMode(false);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        localStorage.setItem("app-settings", JSON.stringify(defaults));
        return;
      }

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
