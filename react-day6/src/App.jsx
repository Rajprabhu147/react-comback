// src/App.jsx
import { useEffect, useRef } from "react";
import {
  Routes,
  Route,
  NavLink,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About.jsx";
import { useUser } from "./context/UserContext.jsx";

export default function App() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // Avoid navigation loops by only acting when user id actually changes
  const prevUserIdRef = useRef(null);

  useEffect(() => {
    const prevId = prevUserIdRef.current;
    const curId = user?.id ?? null;

    // Nothing changed -> do nothing
    if (prevId === curId) return;

    // Store new value for next run
    prevUserIdRef.current = curId;

    // User just signed in -> if on auth or root, send to dashboard
    if (curId) {
      if (location.pathname === "/auth" || location.pathname === "/") {
        navigate("/dashboard", { replace: true });
      }
      return;
    }

    // User signed out -> send to auth unless already there or on public About
    if (!curId) {
      if (location.pathname !== "/auth" && location.pathname !== "/about") {
        navigate("/auth", { replace: true });
      }
    }
  }, [user, location.pathname, navigate]);

  // Helper for NavLink active styling
  const linkClass = ({ isActive }) =>
    isActive
      ? "px-3 py-2 rounded-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-600"
      : "px-3 py-2 rounded-md text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors";

  // Derive a short display name from email (falls back to "Guest")
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split("@")?.[0] ||
    (user ? "User" : "Guest");

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="app">
        <header className="mb-6">
          <nav className="nav">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                SkillSync
              </h1>

              <div className="hidden sm:flex items-center gap-2">
                <NavLink to="/about" className={linkClass}>
                  About
                </NavLink>
                <NavLink to="/dashboard" className={linkClass}>
                  Dashboard
                </NavLink>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <button
                    onClick={logout}
                    className="btn"
                    title="Logout"
                    aria-label="Logout"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/auth" className="btn-ghost">
                  Login
                </NavLink>
              )}
            </div>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard"
              element={user ? <Dashboard /> : <Auth />}
            />
            <Route path="/" element={user ? <Dashboard /> : <Auth />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
