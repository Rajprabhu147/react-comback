/* eslint-disable react-refresh/only-export-components */
// src/context/UserContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UserContext = createContext();

/**
 * UserProvider
 * Handles authentication session persistence and provides
 * login, signup, and logout utilities globally through Context.
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    // 🔹 Load the session once on mount
    const initSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) console.warn("getSession error:", error);
        if (isMounted) setUser(session?.user ?? null);
      } catch (err) {
        console.error("getSession threw:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initSession();

    // 🔹 Auth state listener (login/signup/logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      try {
        subscription.unsubscribe();
      } catch (err) {
        console.warn("Failed to unsubscribe from auth listener:", err);
      }
    };
  }, []);

  // 🔹 Login user
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      setUser(data?.user ?? null);
      return { data, error: null };
    } catch (err) {
      console.error("login threw:", err);
      return { data: null, error: err };
    }
  };

  // 🔹 Signup user + optional profile creation
  const signup = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const userId = data?.user?.id;
      if (userId) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: userId, email: data.user.email });

        if (insertError) console.warn("Profile insert error:", insertError);
      }

      setUser(data?.user ?? null);
      return { data, error: null };
    } catch (err) {
      console.error("signup threw:", err);
      return { data: null, error: err };
    }
  };

  // 🔹 Logout safely (ignore missing-session errors)
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        const safeToIgnore =
          error.name === "AuthSessionMissingError" ||
          error.message?.includes("Auth session missing");

        if (!safeToIgnore) console.error("signOut error:", error);
      }
    } catch (err) {
      const safeToIgnore =
        err?.name === "AuthSessionMissingError" ||
        String(err).includes("Auth session missing");

      if (!safeToIgnore) console.error("Unexpected signOut error:", err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
}

/**
 * useUser()
 * Custom hook for consuming user context safely.
 */
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a <UserProvider>");
  return ctx;
};
