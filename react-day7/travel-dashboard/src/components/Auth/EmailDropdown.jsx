import React, { useState, useEffect, useRef } from "react";
import "../../styles/email-dropdown.css";

const EmailDropdown = ({ value, onChange, error }) => {
  // Stores saved emails from localStorage
  const [recentUsers, setRecentUsers] = useState([]);

  // Controls visibility of dropdown list
  const [showDropdown, setShowDropdown] = useState(false);

  // Stores users filtered by search typing
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Reference for detecting outside clicks
  const dropdownRef = useRef(null);

  /* ------------------------------------------------------
   * Load recent users from localStorage on first render
   * ------------------------------------------------------ */
  useEffect(() => {
    const recent = JSON.parse(localStorage.getItem("recentUsers") || "[]");
    setRecentUsers(recent);
    setFilteredUsers(recent);
  }, []);

  /* ------------------------------------------------------
   * Filter recent users based on what the user types
   * Runs every time `value` or the recent users list changes
   * ------------------------------------------------------ */
  useEffect(() => {
    if (value) {
      const filtered = recentUsers.filter((email) =>
        email.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(recentUsers);
    }
  }, [value, recentUsers]);

  /* ------------------------------------------------------
   * Close dropdown when user clicks outside the component
   * ------------------------------------------------------ */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ------------------------------------------------------
   * Select email from dropdown & fill input field
   * ------------------------------------------------------ */
  const handleSelect = (email) => {
    onChange({ target: { name: "email", value: email } });
    setShowDropdown(false);
  };

  /* ------------------------------------------------------
   * Remove an email from recent users
   * Also updates localStorage
   * ------------------------------------------------------ */
  const handleRemove = (email, e) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    const updated = recentUsers.filter((u) => u !== email);
    localStorage.setItem("recentUsers", JSON.stringify(updated));
    setRecentUsers(updated);
    setFilteredUsers(updated);
  };

  /* ------------------------------------------------------
   * Generate small avatar initials (first 2 letters)
   * ------------------------------------------------------ */
  const getInitials = (email) => {
    const username = email.split("@")[0];
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <div className="email-dropdown-container" ref={dropdownRef}>
      {/* Email label */}
      <label className="form-label">Email</label>

      {/* Input + dropdown arrow */}
      <div className="email-input-wrapper">
        <input
          type="email"
          name="email"
          value={value}
          onChange={onChange}
          onFocus={() => recentUsers.length > 0 && setShowDropdown(true)}
          placeholder="your@email.com"
          className={`form-input ${error ? "error" : ""}`}
          autoComplete="off"
        />

        {/* Show dropdown toggle only when users exist */}
        {recentUsers.length > 0 && (
          <button
            type="button"
            className="dropdown-toggle-btn"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {showDropdown ? "▲" : "▼"}
          </button>
        )}
      </div>

      {/* Dropdown list of recent/filtered users */}
      {showDropdown && filteredUsers.length > 0 && (
        <div className="email-dropdown">
          <div className="dropdown-header-text">Recent Users</div>

          {filteredUsers.map((email) => (
            <div
              key={email}
              className="email-dropdown-item"
              onClick={() => handleSelect(email)}
            >
              <div className="email-avatar">{getInitials(email)}</div>

              <div className="email-text">{email}</div>

              {/* Remove individual stored email */}
              <button
                className="email-remove-btn"
                onClick={(e) => handleRemove(email, e)}
                title="Remove from recent"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && <span className="error-text">{error}</span>}
    </div>
  );
};

export default EmailDropdown;
