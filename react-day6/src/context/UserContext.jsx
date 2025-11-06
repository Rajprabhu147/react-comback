import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { supabase } from "../lib/supabaseClient";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let mounted = true;

    // load current session once
    (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("supabase getSession error:", error);
          return;
        }
        if (!mounted) return;
        setUser(data?.session?.user ?? null);
      } catch (err) {
        console.error("unexpected error loading session:", err);
      }
    })();

    // subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // session can be null when signed out
      setUser(session?.user ?? null);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      return await supabase.auth.signInWithPassword({ email, password });
    } catch (err) {
      console.error("login error:", err);
      throw err;
    }
  }, []);

  const signup = useCallback(async (email, password) => {
    try {
      return await supabase.auth.signUp({ email, password });
    } catch (err) {
      console.error("signup error:", err);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error("signOut error:", err);
      throw err;
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
