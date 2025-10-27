import React from "react";
//routing all elements from the react dom
import { Routes, Route, NavLink } from "react-router-dom";
//importing all pages needed
import Home from "./pages/Tickets";
import About from "./pages/About";
//Styling
import "./App.css";
//Api channeling
import { useTheme } from "./context/ThemeContext";

//Default app function
export default function App() {
  //useTheme hook for theme change using Context Api
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <header className="header">
        <h1>Ticket Tracker</h1>

        <nav>
          {/*Navigation Link Routing using NavLink in ReactDom */}
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/tickets">Tickets</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        {/*button for changing the color theme for the whole app */}
        <button onClick={toggleTheme} className="theme-btn">
          {theme === "light" ? "Dark" : "Light"} mode
        </button>
      </header>
      {/**Main Section */}
      <main className="main">
        <Routes>
          {/**Routing section  */}
          <Route path="/" element={<Home />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
}
