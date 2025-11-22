import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      // Appearance
      theme: "light",
      compactMode: false,

      // Notifications
      emailNotifications: true,
      pushNotifications: true,
      notificationSound: true,

      // Privacy
      showEmail: false,
      showActivity: true,

      // Preferences
      itemsPerPage: 10,
      defaultView: "grid",
      autoSave: true,

      // Actions
      setTheme: (theme) => set({ theme }),
      setCompactMode: (compactMode) => set({ compactMode }),
      setEmailNotifications: (emailNotifications) =>
        set({ emailNotifications }),
      setPushNotifications: (pushNotifications) => set({ pushNotifications }),
      setNotificationSound: (notificationSound) => set({ notificationSound }),
      setShowEmail: (showEmail) => set({ showEmail }),
      setShowActivity: (showActivity) => set({ showActivity }),
      setItemsPerPage: (itemsPerPage) => set({ itemsPerPage }),
      setDefaultView: (defaultView) => set({ defaultView }),
      setAutoSave: (autoSave) => set({ autoSave }),

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
    {
      name: "app-settings",
    }
  )
);
