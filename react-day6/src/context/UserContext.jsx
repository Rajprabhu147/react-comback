/* eslint-disable react-refresh/only-export-components */
// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) console.warn("getSession error:", error);
        if (mounted) setUser(data?.session?.user ?? null);
      } catch (err) {
        console.error("getSession threw:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      try {
        listener.subscription.unsubscribe();
      } catch (e) {}
    };
  }, []);

  const login = async (email, password) => {
    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log("signInWithPassword response:", response);
      return response;
    } catch (err) {
      console.error("login threw:", err);
      return { error: err };
    }
  };

  const signup = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { data: null, error };
      const userId = data?.user?.id;
      if (userId) {
        await supabase
          .from("profiles")
          .insert({ id: userId, email: data.user.email })
          .select()
          .maybeSingle();
      }
      return { data, error: null };
    } catch (err) {
      console.error("signup threw:", err);
      return { error: err };
    }
  };

  // logout without useNavigate — just clear session safely
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        if (
          error.name === "AuthSessionMissingError" ||
          (error.message && error.message.includes("Auth session missing"))
        ) {
          console.warn("No active session when signing out — ignoring.");
        } else {
          console.error("signOut error:", error);
        }
      }
    } catch (err) {
      if (
        err?.name === "AuthSessionMissingError" ||
        String(err).includes("Auth session missing")
      ) {
        console.warn("signOut threw AuthSessionMissingError — ignoring.");
      } else {
        console.error("Unexpected signOut error:", err);
      }
    } finally {
      setUser(null);
      // do NOT call navigate here because this provider may be outside Router
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
