import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Create context for authentication state
// Default = undefined to force usage inside provider
const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  // Stores the authenticated user object
  const [user, setUser] = useState(null);

  // Indicates whether auth state is still loading
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------------------
   * Load initial session & listen for authentication changes
   * --------------------------------------------------------- */
  useEffect(() => {
    // Fetch the initial session from Supabase
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null); // Set user if exists
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Subscribe to auth state changes (login, logout, refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Clean up listener on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  /* ---------------------------------------------------------
   * Authentication Functions
   * --------------------------------------------------------- */

  // Create a new account with email/password
  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Login with email/password
  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Google OAuth login
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin, // Redirect back to app
        queryParams: {
          access_type: "offline",
          prompt: "consent", // Forces Google refresh token
        },
      },
    });
    if (error) throw error;
    return data;
  };

  // Logout user
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  // Values exposed to the rest of the app
  const value = {
    user,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

/* ---------------------------------------------------------
 * Custom Hook: Safely access UserContext
 * --------------------------------------------------------- */
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
