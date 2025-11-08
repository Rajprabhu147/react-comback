// src/App.jsx
import { useEffect } from "react";
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

  useEffect(() => {
    // When user becomes signed in, ensure they're sent to the dashboard/root.
    // When they sign out, send them to the auth page.
    // We guard to avoid unnecessary redirects (e.g. if already on /about).
    if (user) {
      // If user is on /auth or rootless page, send to '/'
      if (location.pathname === "/auth" || location.pathname === "/") {
        navigate("/", { replace: true });
      }
      // if you want to always push to dashboard after login uncomment:
      // navigate("/", { replace: true });
    } else {
      // if no user, and not already on /auth or /about - send to /auth
      if (location.pathname !== "/auth" && location.pathname !== "/about") {
        navigate("/auth", { replace: true });
      }
    }
    // add navigate and location to deps to keep effect up-to-date
  }, [user, navigate, location]);

  return (
    <div className="app">
      <nav className="nav">
        <NavLink to="/about">About</NavLink>
        <NavLink to="/">Dashboard</NavLink>
        {!user ? (
          <NavLink to="/auth">Login</NavLink>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        {/* Root route: if user present show Dashboard, otherwise show Auth */}
        <Route path="/" element={user ? <Dashboard /> : <Auth />} />
      </Routes>
    </div>
  );
}
