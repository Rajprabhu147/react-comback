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

  // avoid navigation loops by only acting when user id actually changes
  const prevUserIdRef = useRef(null);

  useEffect(() => {
    const prevId = prevUserIdRef.current;
    const curId = user?.id ?? null;

    // nothing changed -> do nothing
    if (prevId === curId) return;

    // store new value for next run
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

  // helper for NavLink active styling
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium ${
      isActive
        ? "text-white bg-gradient-to-r from-indigo-600 to-violet-600"
        : "text-slate-700 hover:text-indigo-600"
    }`;

  // derive a short display name from email (falls back to "Guest")
  const displayName =
    user?.user_metadata?.full_name ||
    user?.email?.split?.("@")?.[0] ||
    (user ? "User" : "Guest");

  return (
    <div className="app">
      <header className="nav flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xl font-bold text-indigo-600">
            <h1 className="header">SkillSync</h1>
          </div>
          <nav className="hidden sm:flex items-center gap-2 ml-4">
            <NavLink to="/about" className={linkClass}>
              About
            </NavLink>
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* small responsive nav for mobile */}
          <div className="sm:hidden">
            <NavLink
              to="/dashboard"
              className="text-sm text-slate-700 hover:text-indigo-600 px-2"
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/about"
              className="text-sm text-slate-700 hover:text-indigo-600 px-2"
            >
              About
            </NavLink>
          </div>

          {user ? (
            <>
              <div className="hidden sm:flex flex-col text-right mr-2">
                <span className="text-sm font-semibold">{displayName}</span>
                <span className="text-xs text-slate-500">Welcome back</span>
              </div>

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
      </header>

      <main className="mt-6">
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={user ? <Dashboard /> : <Auth />} />
          <Route path="/" element={user ? <Dashboard /> : <Auth />} />
        </Routes>
      </main>
    </div>
  );
}
