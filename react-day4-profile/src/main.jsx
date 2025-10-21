import React from "react";
import ReactDOM from "react-dom/client";
// import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ProfilesProvider } from "./ProfilesContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <BrowserRouter>
  <ProfilesProvider>
    <App />
  </ProfilesProvider>
  // </BrowserRouter>
);
