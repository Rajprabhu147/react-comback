import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * useSettingsStore
 * ---------------------------------------------------
 * A global Zustand store that manages:
 * - Appearance settings
 * - Notification preferences
 * - Privacy options
 * - User interface and pagination preferences
 *
 * The store is persisted using localStorage under key "app-settings".
 * This means settings remain saved even after page reload.
 */
export const useSettingsStore = create(
  persist(
    (set) => ({
      /* --------------------------------------------------
       * Appearance Settings (UI look & feel)
       * -------------------------------------------------- */

      // App theme (light, dark, auto)
      theme: "light",

      // Compact mode (tighter spacing across UI)
      compactMode: false,

      /* --------------------------------------------------
       * Notification Settings
       * -------------------------------------------------- */

      // Receive email notifications
      emailNotifications: true,

      // Enable push/in-browser notifications
      pushNotifications: true,

      // Play sound on new notifications
      notificationSound: true,

      /* --------------------------------------------------
       * Privacy Settings
       * -------------------------------------------------- */

      // Show user email publicly
      showEmail: false,

      // Display online activity status
      showActivity: true,

      /* --------------------------------------------------
       * User Preferences
       * -------------------------------------------------- */

      // Items displayed per page in lists
      itemsPerPage: 10,

      // Default view for lists: grid | list | compact
      defaultView: "grid",

      // Automatically save changes without confirmation
      autoSave: true,

      /* --------------------------------------------------
       * Update Actions (setters)
       * Each function updates part of the store.
       * -------------------------------------------------- */

      // Update theme
      setTheme: (theme) => set({ theme }),

      // Toggle compact mode UI
      setCompactMode: (compactMode) => set({ compactMode }),

      // Notification toggles
      setEmailNotifications: (emailNotifications) =>
        set({ emailNotifications }),
      setPushNotifications: (pushNotifications) => set({ pushNotifications }),
      setNotificationSound: (notificationSound) => set({ notificationSound }),

      // Privacy toggles
      setShowEmail: (showEmail) => set({ showEmail }),
      setShowActivity: (showActivity) => set({ showActivity }),

      // Preference updates
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      setDefaultView: (defaultView) => set({ defaultView }),
      setAutoSave: (autoSave) => set({ autoSave }),

      /* --------------------------------------------------
       * Reset all settings to default values
       * Useful for "Reset All" button in Settings page
       * -------------------------------------------------- */
      resetSettings: () =>
        set({
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
        }),
    }),

    /* --------------------------------------------------
     * Persist configuration
     * Saves store data to `localStorage` using key "app-settings"
     * Ensures settings remain intact across reloads.
     * -------------------------------------------------- */
    {
      name: "app-settings",
    }
  )
);
