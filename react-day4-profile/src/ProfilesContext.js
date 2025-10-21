import { createContext, useContext, useState } from "react";

//1. create context
const ProfilesContext = createContext();

//2. create provider component
export function ProfilesProvider({ children }) {
  const [profiles, setProfiles] = useState([]);

  //you can also add helper functions here (e.g., addProfile, deleteProfile)
  const addProfile = (profile) => {
    setProfiles((prev) => [...prev, profile]);
  };

  const removeProfile = (id) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const value = {
    profiles,
    setProfiles,
    addProfile,
    removeProfile,
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
    throw new Error("useProfiles must be used with in a ProfileProvider");
  }
  return context;
}
