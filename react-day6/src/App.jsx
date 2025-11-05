import { Routes, Route, NavLink } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About.jsx";
import { useUser } from "./context/UserContext.jsx";

export default function App() {
  const { user, logout } = useUser();

  return (
    <div className="app">
      <nav className="nav">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/about">About</NavLink>
        {!user ? (
          <NavLink to="/auth">Login</NavLink>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
      </nav>

      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Auth />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </div>
  );
}
