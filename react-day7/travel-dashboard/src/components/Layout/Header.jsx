import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import "../../styles/header.css";

const Header = ({ onCreateItem }) => {
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Get avatar URL from user context
  const avatarUrl = user?.user_metadata?.avatar_url;
  const fullName = user?.user_metadata?.full_name || "User";
  const email = user?.email || "";
  const initials = fullName[0]?.toUpperCase() || email[0]?.toUpperCase() || "?";

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo" onClick={() => navigate("/")}>
          <span className="logo-icon">✈️</span>
          <span className="logo-text">Smart Trip</span>
        </div>

        {/* CENTER - CREATE BUTTON (if provided) */}
        {onCreateItem && (
          <div className="header-center">
            <button className="header-create-btn" onClick={onCreateItem}>
              <span className="btn-icon">+</span>
              Create New Item
            </button>
          </div>
        )}

        {/* Right Actions */}
        <div className="header-actions">
          {/* Notifications */}
          <button
            className="header-icon-btn"
            onClick={() => navigate("/notifications")}
          >
            🔔
            <span className="notification-badge">3</span>
          </button>

          {/* User Profile */}
          <div className="header-user">
            <button
              className="user-profile-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {/* AVATAR - Updates when user changes it */}
              <div className="user-avatar">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  initials
                )}
              </div>

              <div className="user-info">
                <span className="user-name">{fullName}</span>
                <span className="user-email">{email}</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={fullName}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="dropdown-info">
                    <div className="dropdown-name">{fullName}</div>
                    <div className="dropdown-email">{email}</div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                    setDropdownOpen(false);
                  }}
                >
                  <span className="item-icon">👤</span>
                  Profile Settings
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/notifications");
                    setDropdownOpen(false);
                  }}
                >
                  <span className="item-icon">🔔</span>
                  Notifications
                  <span className="dropdown-badge">3</span>
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/settings");
                    setDropdownOpen(false);
                  }}
                >
                  <span className="item-icon">⚙️</span>
                  Settings
                </button>

                <div className="dropdown-divider"></div>

                <button className="dropdown-item danger" onClick={handleLogout}>
                  <span className="item-icon">🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {dropdownOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99,
          }}
          onClick={() => setDropdownOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
