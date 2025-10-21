import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home";
import Profiles from "./pages/Profiles";
import AddProfile from "./pages/AddProfile";
import ViewProfile from "./pages/ViewProfile";

export default function App() {
  const [profiles, setProfiles] = useState([]);
  return (
    <div style={{ padding: 20 }} className="app">
      <header>
        <nav style={{ display: "flex", gap: 20 }} className="nav">
          <Link
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </Link>
          <Link
            to="/profiles"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Profiles
          </Link>
          <Link
            to="/add"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Add Profile
          </Link>
        </nav>
      </header>
      <hr />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profiles" element={<Profiles profiles={profiles} />} />
        <Route path="/add" element={<AddProfile setProfiles={setProfiles} />} />
        <Route
          path="/profiles/:id"
          element={<ViewProfile profiles={profiles} />}
        />
      </Routes>
    </div>
  );
}
