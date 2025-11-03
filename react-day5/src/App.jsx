import React from "react";
//routing all elements from the react dom
import { Routes, Route, NavLink } from "react-router-dom";
//import toaster
import { Toaster } from "react-hot-toast";
//importing all pages needed
import Home from "./pages/Home";
import About from "./pages/About";
//Styling
import "./App.css";
//Api channeling
import { useTheme } from "./context/ThemeContext";
import TicketsPage from "./pages/Tickets";

//Default app function
export default function App() {
  //useTheme hook for theme change using Context Api
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Toaster position="top-tight" reverseOrder={false} />
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
