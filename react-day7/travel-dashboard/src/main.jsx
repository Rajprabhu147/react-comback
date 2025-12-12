import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/theme.css"; // And this
import "./styles/animations.css"; // Add this
import "./index.css";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
