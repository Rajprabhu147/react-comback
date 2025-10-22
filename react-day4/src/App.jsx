import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Todos from "./pages/Todos";
import About from "./pages/About";
import { TodosProvider } from "./context/TodosContext";

export default function App() {
  return (
    <TodosProvider>
      <div className="app">
        <nav className="nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Home
          </NavLink>
          <NavLink
            to="/todos"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Todos
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            About
          </NavLink>
        </nav>

        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/todos" element={<Todos />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </TodosProvider>
  );
}
