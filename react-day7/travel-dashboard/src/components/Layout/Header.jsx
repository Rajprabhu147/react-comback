import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import Button from "../Shared/Button";
import { useNotificationStore } from "../../store/notificationStore";
import "../../styles/header.css";

/**
 * Header Component
 *
 * Shows avatar image if available, otherwise shows initials
 * Avatar updates in real-time from UserContext
 *
 * Navigation:
 * - /profile → My Profile (view credentials, expenses, trips, itinerary)
 * - /profile/settings → Profile Settings (edit account, change password)
 * - /notifications → Notifications
 * - /settings → App Settings
 */
const Header = () => {
  const { user, signOut } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const unreadCount = useNotificationStore((state) => state.unreadCount);

  // Get avatar URL from user metadata
  const avatarUrl = user?.user_metadata?.avatar_url;

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

  const isProfileActive = location.pathname === "/profile";
  const isProfileSettingsActive = location.pathname === "/profile/settings";

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
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
              {/* Avatar - Shows image if available, otherwise initials */}
              <div className="user-avatar">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="User Avatar"
                    className="avatar-image"
                  />
                ) : (
                  <span className="avatar-initials">
                    {getInitials(user?.email)}
                  </span>
                )}
              </div>

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
                {/* Dropdown Header with Avatar */}
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="User Avatar"
                        className="avatar-image"
                      />
                    ) : (
                      <span className="avatar-initials">
                        {getInitials(user?.email)}
                      </span>
                    )}
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

                {/* My Profile - VIEW PROFILE DATA */}
                <button
                  className={`dropdown-item ${isProfileActive ? "active" : ""}`}
                  onClick={() => handleNavigation("/profile")}
                >
                  <span className="item-icon">📊</span>
                  <span>My Profile</span>
                  <span className="item-subtitle">View trips & expenses</span>
                </button>

                {/* Profile Settings - EDIT ACCOUNT */}
                <button
                  className={`dropdown-item ${
                    isProfileSettingsActive ? "active" : ""
                  }`}
                  onClick={() => handleNavigation("/profile/settings")}
                >
                  <span className="item-icon">⚙️</span>
                  <span>Account Settings</span>
                  <span className="item-subtitle">Edit profile & password</span>
                </button>

                {/* Notifications */}
                <button
                  className={`dropdown-item ${
                    location.pathname === "/notifications" ? "active" : ""
                  }`}
                  onClick={() => handleNavigation("/notifications")}
                >
                  <span className="item-icon">🔔</span>
                  <span>Notifications Settings</span>
                  <span className="item-subtitle">View Notifications</span>

                  {unreadCount > 0 && (
                    <span className="dropdown-badge">{unreadCount}</span>
                  )}
                </button>

                {/* App Settings */}
                <button
                  className={`dropdown-item ${
                    location.pathname === "/settings" ? "active" : ""
                  }`}
                  onClick={() => handleNavigation("/settings")}
                >
                  <span className="item-icon">🛠️</span>
                  <span>App Settings</span>
                  <span className="item-subtitle">Preferences & theme</span>
                </button>

                <div className="dropdown-divider"></div>

                {/* Sign Out */}
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
