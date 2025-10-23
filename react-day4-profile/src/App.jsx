import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Profiles from "./pages/Profiles";
import AddProfile from "./pages/AddProfile";
import ViewProfile from "./pages/ViewProfile";

export default function App() {
  return (
    <div className="app">
      <header>
        <nav style={{ display: "flex", gap: 20 }} className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/profiles"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profiles
          </NavLink>
          <NavLink
            to="/add"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Add Profile
          </NavLink>
        </nav>
      </header>
      <hr />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/add" element={<AddProfile />} />
        <Route path="/profiles/:id" element={<ViewProfile />} />
      </Routes>
    </div>
  );
}
