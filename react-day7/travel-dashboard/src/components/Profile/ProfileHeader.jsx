import React from "react";

/**
 * ProfileHeader Component
 *
 * Displays the user's profile summary section, including:
 * - Banner background
 * - Profile statistics (Items, Completed, In Progress)
 * - Member since date
 * - Generic tagline
 *
 * It does NOT fetch data; it only formats and displays what is passed via props.
 */
const ProfileHeader = ({ user }) => {
  /**
   * getInitials(email)
   * Extracts initials from the user's email to generate an avatar placeholder.
   * Example: "john.doe@example.com" → "JD"
   */
  const getInitials = (email) => {
    if (!email) return "U"; // Default initial if no email exists

    const username = email.split("@")[0]; // Extract text before '@'
    const parts = username.split(/[._-]/); // Split by common separators

    // If the username has multiple parts, take first letters of first two
    if (parts.length > 1) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }

    // Otherwise take first two letters of username
    return username.substring(0, 2).toUpperCase();
  };

  /**
   * getDisplayName(email)
   * Converts the email username into a readable display name.
   * Removes numbers & symbols, then capitalizes.
   *
   * Example: "john.doe123" → "John doe"
   */
  const getDisplayName = (email) => {
    if (!email) return "User";

    const username = email.split("@")[0];
    const cleanName = username.replace(/[0-9_.-]/g, " ").trim(); // Replace unwanted characters
    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

  /**
   * getMemberSince()
   * Formats the user's "created_at" timestamp into a readable string.
   * Example: 2024-10-01 → "October 2024"
   */
  const getMemberSince = () => {
    if (!user?.created_at) return "Recently";

    const date = new Date(user.created_at);
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="profile-header">
      {/* Top banner background section */}
      <div className="profile-banner">
        <div className="banner-gradient"></div>
      </div>

      {/* Profile content area */}
      <div className="profile-info">
        {/* Profile statistics section (currently static placeholders) */}
        <div className="profile-stats">
          {/* Total items stat */}
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Items</div>
          </div>

          {/* Completed items stat */}
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Completed</div>
          </div>

          {/* In-progress items stat */}
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        {/* User meta information section */}
        <div className="profile-meta">
          {/* Member since date */}
          <span className="meta-item">📅 Member since {getMemberSince()}</span>

          {/* Static personal tagline */}
          <span className="meta-item">🌊 Travel Enthusiast</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
