import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Button from "../Shared/Button";
import { useNotificationStore } from "../../store/notificationStore";
import "../../styles/components.css";
import "../../styles/header.css";

/**
 * Header Component
 * ----------------------------------------------------------
 * The top navigation bar in the dashboard.
 * Contains:
 * - logo (click → dashboard)
 * - notifications bell with unread badge
 * - user dropdown (profile/settings/signout)
 * - handles click outside to close dropdown
 */
const Header = () => {
  // Access the current authenticated user & signOut function
  const { user, signOut } = useUser();

  // Used for page navigation
  const navigate = useNavigate();

  // Tracks current URL (used to highlight active menu in dropdown)
  const location = useLocation();

  // Controls visibility of user dropdown menu
  const [showDropdown, setShowDropdown] = useState(false);

  // Reference to dropdown element (for click-outside detection)
  const dropdownRef = useRef(null);

  // Retrieve unread notification count from global store
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  /**
   * useEffect → Close dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is outside the dropdown element → close it
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    // Attach listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup listener on unmount
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Utility → Get shortened email username
   * Used for smaller UI displays
   */
  const getShortUsername = (email) => {
    if (!email) return "User";
    const username = email.split("@")[0];
    return username.length > 15 ? username.substring(0, 15) + "..." : username;
  };

  /**
   * Utility → Convert email username into display name
   * Removes numbers & special characters
   */
  const getDisplayName = (email) => {
    if (!email) return "User";
    const username = email.split("@")[0];
    const cleanName = username.replace(/[0-9_.-]/g, " ").trim();
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

  /**
   * Utility → Generate initials for avatar circle
   */
  const getInitials = (email) => {
    if (!email) return "U";
    const username = email.split("@")[0];
    const parts = username.split(/[._-]/);

    // If the username has separators (like 'raj.prabhu')
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }

    // Otherwise, take the first 2 letters
    return username.substring(0, 2).toUpperCase();
  };

  /**
   * Logout → Sign user out and redirect to login page
   */
  const handleSignOut = async () => {
    setShowDropdown(false); // close dropdown
    await signOut();
    navigate("/login"); // go to login page
  };

  /**
   * Handles navigation & closes dropdown at the same time
   */
  const handleNavigation = (path) => {
    setShowDropdown(false);
    navigate(path);
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo section — clicking returns to dashboard */}
        <div className="header-logo" onClick={() => navigate("/")}>
          <span className="logo-icon">🌊</span>
          <span className="logo-text">Travel Dashboard</span>
        </div>

        <div className="header-actions">
          {/* Notifications Bell Icon */}
          <button
            className="header-icon-btn"
            onClick={() => navigate("/notifications")}
            title="Notifications"
          >
            <span className="icon-wrapper">
              🔔
              {/* If there are unread notifications, show badge */}
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </span>
          </button>

          {/* User dropdown menu */}
          <div className="header-user" ref={dropdownRef}>
            {/* Button showing user avatar + short info */}
            <button
              className="user-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {/* Avatar initials */}
              <div className="user-avatar">{getInitials(user?.email)}</div>

              {/* Display name + short email */}
              <div className="user-info">
                <span className="user-name">{getDisplayName(user?.email)}</span>
                <span className="user-email">
                  {getShortUsername(user?.email)}
                </span>
              </div>

              {/* Arrow indicating dropdown state */}
              <span className="dropdown-arrow">{showDropdown ? "▲" : "▼"}</span>
            </button>

            {/* The actual dropdown menu */}
            {showDropdown && (
              <div className="user-dropdown">
                {/* Dropdown header (bigger profile details) */}
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

                {/* Profile link */}
                <button
                  className={`dropdown-item ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                  onClick={() => handleNavigation("/profile")}
                >
                  <span className="item-icon">👤</span>
                  <span>Profile Settings</span>
                </button>

                {/* Notifications link */}
                <button
                  className={`dropdown-item ${
                    location.pathname === "/notifications" ? "active" : ""
                  }`}
                  onClick={() => handleNavigation("/notifications")}
                >
                  <span className="item-icon">🔔</span>
                  <span>Notifications</span>

                  {/* Show unread badge inside dropdown */}
                  {unreadCount > 0 && (
                    <span className="dropdown-badge">{unreadCount}</span>
                  )}
                </button>

                {/* Settings link */}
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

                {/* Logout button */}
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
