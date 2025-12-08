import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Button from "../Shared/Button";
import { useNotificationStore } from "../../store/notificationStore";
// import { useUIStore } from "../../store/uiStore";
import "../../styles/components.css";
import "../../styles/header.css";

const Header = () => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getShortUsername = (email) => {
    if (!email) return "User";
    const username = email.split("@")[0];
    if (username.length > 15) {
      return username.substring(0, 15) + "...";
    }
    return username;
  };

  const getDisplayName = (email) => {
    if (!email) return "User";
    const username = email.split("@")[0];
    const cleanName = username.replace(/[0-9_.-]/g, " ").trim();
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

  const getInitials = (email) => {
    if (!email) return "U";
    const username = email.split("@")[0];
    const parts = username.split(/[._-]/);
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  const handleSignOut = async () => {
    setShowDropdown(false);
    await signOut();
    navigate("/login");
  };

  const handleNavigation = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Mobile Menu Button */}
        {/* <button
          className="mobile-menu-btn"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? "✕" : "☰"}
        </button> */}

        <div className="header-logo" onClick={() => navigate("/")}>
          <span className="logo-icon">🗺️</span>
          <span className="logo-text">Sutri</span>
        </div>

        <div className="header-actions">
          {/* Notifications Bell */}
          <button
            className="header-icon-btn"
            onClick={() => navigate("/notifications")}
            title="Notifications"
          >
            <span className="icon-wrapper">
              🔔
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </span>
          </button>

          {/* User Profile Dropdown */}
          <div className="header-user" ref={dropdownRef}>
            <button
              className="user-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">{getInitials(user?.email)}</div>
              <div className="user-info">
                <span className="user-name">{getDisplayName(user?.email)}</span>
                <span className="user-email">
                  {getShortUsername(user?.email)}
                </span>
              </div>
              <span className="dropdown-arrow">{showDropdown ? "▲" : "▼"}</span>
            </button>

            {showDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {getInitials(user?.email)}
                  </div>
                  <div className="dropdown-info">
                    <div className="dropdown-name">
                      {getDisplayName(user?.email)}
                    </div>
                    <div className="dropdown-email" title={user?.email}>
                      {user?.email}
                    </div>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <button
                  className={`dropdown-item ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                  onClick={() => handleNavigation("/profile")}
                >
                  <span className="item-icon">👤</span>
                  <span>Profile Settings</span>
                </button>

                <button
                  className={`dropdown-item ${
                    location.pathname === "/notifications" ? "active" : ""
                  }`}
                  onClick={() => handleNavigation("/notifications")}
                >
                  <span className="item-icon">🔔</span>
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span className="dropdown-badge">{unreadCount}</span>
                  )}
                </button>

                <button
                  className={`dropdown-item ${
                    location.pathname === "/settings" ? "active" : ""
                  }`}
                  onClick={() => handleNavigation("/settings")}
                >
                  <span className="item-icon">⚙️</span>
                  <span>Settings</span>
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item danger"
                  onClick={handleSignOut}
                >
                  <span className="item-icon">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
