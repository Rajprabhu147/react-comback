import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css"; // And this
import "./styles/animations.css"; // Add this
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
