/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * ProfilesContext provides { profiles, addProfile, removeProfile, updateProfile, clearProfiles }.
 * We persist profiles to localStorage so data survives page refresh.
 */
const STORAGE_KEY = "rd4_profiles_v1";

//1. create context
const ProfilesContext = createContext(null);

//2. create provider component
export function ProfilesProvider({ children }) {
  //initialize from localStorage with lazy initializer
  const [profiles, setProfiles] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.warn("Failed to read profiles from localStorage:", err);
      return [];
    }
  });
  //LifeCycle method after state change

  //persist whenever profile changes

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (err) {
      console.warn("Failed to write profiles to localStorage:", err);
    }
  }, [profiles]);

  //you can also add helper functions here (e.g., addProfile, deleteProfile)
  const addProfile = (profile) => {
    setProfiles((prev) => [profile, ...prev]);
  };
  const updateProfile = (id, patch) => {
    setProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );
  };

  const removeProfile = (id) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const clearProfiles = () => setProfiles([]);

  const value = {
    profiles,
    setProfiles,
    updateProfile,
    addProfile,
    removeProfile,
    clearProfiles,
  };

  return (
    <ProfilesContext.Provider value={value}>
      {children}
    </ProfilesContext.Provider>
  );
}

//3. Custom hook for consuming the context

export function useProfiles() {
  const context = useContext(ProfilesContext);
  if (!context) {
    throw new Error("useProfiles must be used within a ProfileProvider");
  }
  return context;
}
