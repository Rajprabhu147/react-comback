// src/context/UserContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Debug: confirm envs are loaded (remove these logs after debugging)
    try {
      console.log(
        "SUPABASE URL (prefix):",
        import.meta.env.VITE_SUPABASE_URL?.slice(0, 40)
      );
      console.log(
        "ANON KEY (prefix):",
        import.meta.env.VITE_SUPABASE_ANON_KEY?.slice(0, 8)
      );
    } catch (e) {
      // ignore in environments where import.meta is absent
    }

    // async IIFE to await session
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.warn("getSession error:", error);
        }
        setUser(data?.session?.user ?? null);
      } catch (err) {
        console.error("getSession threw:", err);
      } finally {
        setLoading(false);
      }
    })();

    // Listen for auth state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("onAuthStateChange:", event, session);
        setUser(session?.user ?? null);
      }
    );

    return () => {
      // unsubscribe listener
      try {
        listener.subscription.unsubscribe();
      } catch (e) {
        // some SDK versions expose different cleanup shapes; tolerate the error
        console.warn("unsubscribe failed:", e);
      }
    };
  }, []);

  // login returns the full response so the caller can check data/error/body
  const login = async (email, password) => {
    if (!email || !password) {
      return { error: new Error("Email and password required") };
    }

    try {
      const response = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Log the exact response (data & error). This will reveal server JSON (400 message etc).
      console.log("signInWithPassword response:", response);

      // Some SDK responses include status/body in response.error / response.data; return raw
      return response; // { data, error }
    } catch (err) {
      // Network/SDK thrown error (not normal supabase error shape)
      console.error("signInWithPassword threw:", err);
      return { error: err };
    }
  };

  const signup = async (email, password) => {
    if (!email || !password) {
      return { error: new Error("Email and password required") };
    }

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      console.log("signUp response:", { data, error });

      if (error) return { data: null, error };

      const userId = data?.user?.id;
      if (!userId) {
        // no user — maybe email confirmation required or some config; return what we have
        return { data, error: null };
      }

      // Create profile row if it doesn't already exist
      const { data: existing, error: existingErr } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .maybeSingle();

      if (existingErr) {
        console.warn("profiles select error:", existingErr);
      }

      if (!existing) {
        const { error: insertErr } = await supabase
          .from("profiles")
          .insert({ id: userId, email: data.user.email })
          .select();

        if (insertErr) {
          // handle unique violation gracefully (someone else inserted profile)
          console.warn("profiles.insert error:", insertErr);
        } else {
          console.log("profile created for user:", userId);
        }
      } else {
        console.log("profile already exists for user:", userId);
      }

      return { data, error: null };
    } catch (err) {
      console.error("signup threw:", err);
      return { error: err };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) console.warn("signOut error:", error);
      setUser(null);
    } catch (err) {
      console.error("signOut threw:", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
