/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from "react";
import "../../styles/email-dropdown.css";

const EmailDropdown = ({ value, onChange, error }) => {
  // Initialize from localStorage synchronously (avoids setState inside mount effect)
  const initialRecent =
    JSON.parse(localStorage.getItem("recentUsers") || "[]") || [];

  // Stores saved emails from localStorage
  const [recentUsers, setRecentUsers] = useState(initialRecent);

  // Controls visibility of dropdown list
  const [showDropdown, setShowDropdown] = useState(false);

  // Reference for detecting outside clicks
  const dropdownRef = useRef(null);

  /* ------------------------------------------------------
   * Keep localStorage in sync whenever recentUsers changes
   * (Appropriate use of an effect: updating external system)
   * ------------------------------------------------------ */
  useEffect(() => {
    try {
      localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
    } catch (error) {
      // fail silently if storage is unavailable
      // optionally: console.warn("Failed to write recentUsers to localStorage", err);
    }
  }, [recentUsers]);

  /* ------------------------------------------------------
   * Derive filtered users from value + recentUsers using useMemo
   * This avoids calling setState inside an effect and gives a stable array
   * ------------------------------------------------------ */
  const filteredUsers = useMemo(() => {
    if (!value) return recentUsers;
    const q = String(value).toLowerCase();
    return recentUsers.filter((email) => email.toLowerCase().includes(q));
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
    // Pass synthetic-like event to match onChange signature used by parent
    onChange({ target: { name: "email", value: email } });
    setShowDropdown(false);
  };

  /* ------------------------------------------------------
   * Remove an email from recent users
   * Also updates localStorage (via the effect above)
   * ------------------------------------------------------ */
  const handleRemove = (email, e) => {
    e.stopPropagation(); // Prevent triggering parent onClick
    setRecentUsers((prev) => prev.filter((u) => u !== email));
  };

  /* ------------------------------------------------------
   * Optionally: add a public function to push a new recent user
   * You can call this from parent after successful login to update the list:
   * setRecentUsers((prev) => [newEmail, ...prev.filter(e => e !== newEmail)].slice(0,5));
   * ------------------------------------------------------ */

  /* ------------------------------------------------------
   * Generate small avatar initials (first 2 letters)
   * ------------------------------------------------------ */
  const getInitials = (email) => {
    const username = email.split("@")[0] || "";
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
            onClick={() => setShowDropdown((s) => !s)}
            aria-label={
              showDropdown ? "Close recent emails" : "Open recent emails"
            }
          >
            {showDropdown ? "▲" : "▼"}
          </button>
        )}
      </div>

      {/* Dropdown list of recent/filtered users */}
      {showDropdown && filteredUsers.length > 0 && (
        <div
          className="email-dropdown"
          role="listbox"
          aria-label="Recent emails"
        >
          <div className="dropdown-header-text">Recent Users</div>

          {filteredUsers.map((email) => (
            <div
              key={email}
              className="email-dropdown-item"
              onClick={() => handleSelect(email)}
              role="option"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleSelect(email);
              }}
            >
              <div className="email-avatar" aria-hidden>
                {getInitials(email)}
              </div>

              <div className="email-text">{email}</div>

              {/* Remove individual stored email */}
              <button
                className="email-remove-btn"
                onClick={(e) => handleRemove(email, e)}
                title="Remove from recent"
                aria-label={`Remove ${email} from recent`}
                type="button"
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
