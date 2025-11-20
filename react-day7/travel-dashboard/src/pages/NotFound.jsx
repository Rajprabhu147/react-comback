import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Shared/Button";
import "../styles/notfound.css";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-animation">
          <div className="wave-container">
            <span className="wave">🌊</span>
            <span className="wave wave-delay-1">🌊</span>
            <span className="wave wave-delay-2">🌊</span>
          </div>
          <div className="notfound-number">404</div>
        </div>

        <h1 className="notfound-title">Page Not Found</h1>
        <p className="notfound-description">
          Oops! Looks like you've drifted too far from shore. The page you're
          looking for doesn't exist.
        </p>

        <div className="notfound-actions">
          <Button onClick={() => navigate("/")}>🏠 Go Home</Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ⬅️ Go Back
          </Button>
        </div>

        <div className="notfound-suggestions">
          <h3 className="suggestions-title">Here are some helpful links:</h3>
          <div className="suggestions-list">
            <a href="/" className="suggestion-link">
              <span className="suggestion-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a href="/#analytics" className="suggestion-link">
              <span className="suggestion-icon">📈</span>
              <span>Analytics</span>
            </a>
            <a href="/#items" className="suggestion-link">
              <span className="suggestion-icon">📝</span>
              <span>Items</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
