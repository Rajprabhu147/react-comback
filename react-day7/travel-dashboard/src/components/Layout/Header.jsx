import React, { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import Button from "../Shared/Button";
import "../../styles/components.css";
import "../../styles/header.css";

const Header = () => {
  // Access logged-in user and signOut function from UserContext
  const { user, signOut } = useUser();

  // Toggle profile dropdown open/close
  const [showDropdown, setShowDropdown] = useState(false);

  // Reference to dropdown for detecting outside clicks
  const dropdownRef = useRef(null);

  /**
   * Close dropdown when clicking anywhere outside the profile menu.
   * useEffect adds a global click listener and cleans up on unmount.
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /**
   * Helper: Shorten email name for compact UI (e.g., tooltip or small text)
   */
  const getShortUsername = (email) => {
    if (!email) return "User";
    const username = email.split("@")[0];
    return username.length > 15 ? username.substring(0, 15) + "..." : username;
  };

  /**
   * Helper: Extract readable display name from email
   * Removes numbers/symbols and capitalizes the first letter
   */
  const getDisplayName = (email) => {
    if (!email) return "User";
    const username = email.split("@")[0];
    const clean = username.replace(/[0-9_.-]/g, " ").trim();
    return clean.charAt(0).toUpperCase() + clean.slice(1);
  };

  /**
   * Helper: Generate initials for avatar
   * Supports names separated by dot, underscore, or dash.
   */
  const getInitials = (email) => {
    if (!email) return "U";
    const username = email.split("@")[0];
    const parts = username.split(/[._-]/);
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  /**
   * Log the user out and close dropdown
   */
  const handleSignOut = async () => {
    setShowDropdown(false);
    await signOut();
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* App logo section */}
        <div className="header-logo">
          <span className="logo-icon">🌊</span>
          <span className="logo-text">Travel Dashboard</span>
        </div>

        <div className="header-nav">
          {/* User Profile Button + Dropdown */}
          <div className="header-user" ref={dropdownRef}>
            {/* Button that toggles the dropdown */}
            <button
              className="user-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="user-avatar">{getInitials(user?.email)}</div>

              {/* Display name + Short email */}
              <div className="user-info">
                <span className="user-name">{getDisplayName(user?.email)}</span>
                <span className="user-email">
                  {getShortUsername(user?.email)}
                </span>
              </div>

              <span className="dropdown-arrow">{showDropdown ? "▲" : "▼"}</span>
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div className="user-dropdown">
                {/* Dropdown header with avatar + full email */}
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

                {/* Menu Items */}
                <button
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  <span className="item-icon">👤</span> Profile Settings
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  <span className="item-icon">🔔</span> Notifications
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => setShowDropdown(false)}
                >
                  <span className="item-icon">⚙️</span> Settings
                </button>

                <div className="dropdown-divider"></div>

                {/* Sign Out */}
                <button
                  className="dropdown-item danger"
                  onClick={handleSignOut}
                >
                  <span className="item-icon">🚪</span> Sign Out
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

// import React from "react";
// import { useUser } from "../../context/UserContext";
// import Button from "../Shared/Button";
// import "../../styles/components.css";

// /**
//  * Header Component
//  * ---------------------------------------------------------
//  * This is the top navigation bar of the dashboard.
//  * It displays:
//  * - The app title/logo
//  * - The logged-in user's email and avatar
//  *
//  * - A Sign Out button
//  */

// const Header = () => {
//   // Get the current user and the signOut function from UserContext
//   const { user, signOut } = useUser();

//   /**
//    * Returns the first letter of the user's email
//    * Used to generate a simple circle avatar
//    * Example: "raj@gmail.com" -> "R"
//    */
//   const getInitials = (email) => {
//     return email?.charAt(0).toUpperCase() || "U";
//   };

//   return (
//     <header className="header">
//       <div className="header-container">
//         {/* App title / logo area */}
//         <div className="header-logo">🌊 Travel Dashboard</div>

//         {/* Right-side user controls */}
//         <div className="header-nav">
//           <div className="header-user">
//             {/* Avatar with first initial of the user's email */}
//             <div className="user-avatar">{getInitials(user?.email)}</div>

//             {/* User email shown next to avatar */}
//             <span style={{ fontSize: "14px", color: "var(--text-secondary)" }}>
//               {user?.email}
//             </span>

//             {/* Sign Out button using shared Button component */}
//             <Button variant="secondary" size="sm" onClick={signOut}>
//               Sign Out
//             </Button>
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
