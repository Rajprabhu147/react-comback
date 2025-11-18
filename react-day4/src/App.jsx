import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Todos from "./pages/Todos";
import About from "./pages/About";

export default function App() {
  return (
    <div className="app-root">
      <header className="app-header">
        <h1>Todo App</h1>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/todos"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Todos
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            About
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todos" element={<Todos />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <small>
          <p>©{new Date().getFullYear()}- Raj Prabhu Rajasekaran</p>
        </small>
      </footer>
    </div>
  );
}
