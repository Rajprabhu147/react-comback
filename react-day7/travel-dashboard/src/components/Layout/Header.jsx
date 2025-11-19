import React from "react";
import { useUser } from "../../context/UserContext";
import Button from "../Shared/Button";
import "../../styles/components.css";

/**
 * Header Component
 * ---------------------------------------------------------
 * This is the top navigation bar of the dashboard.
 * It displays:
 * - The app title/logo
 * - The logged-in user's email and avatar
 * - A Sign Out button
 */

const Header = () => {
  // Get the current user and the signOut function from UserContext
  const { user, signOut } = useUser();

  /**
   * Returns the first letter of the user's email
   * Used to generate a simple circle avatar
   * Example: "raj@gmail.com" -> "R"
   */
  const getInitials = (email) => {
    return email?.charAt(0).toUpperCase() || "U";
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* App title / logo area */}
        <div className="header-logo">🌊 Travel Dashboard</div>

        {/* Right-side user controls */}
        <div className="header-nav">
          <div className="header-user">
            {/* Avatar with first initial of the user's email */}
            <div className="user-avatar">{getInitials(user?.email)}</div>

            {/* User email shown next to avatar */}
            <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
              {user?.email}
            </span>

            {/* Sign Out button using shared Button component */}
            <Button variant="secondary" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
