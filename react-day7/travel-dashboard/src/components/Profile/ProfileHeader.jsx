import React from "react";

/**
 * ProfileHeader Component
 *
 * Displays the user's profile summary section, including:
 * - Banner background
 * - Avatar + name (NEW)
 * - Profile statistics (Items, Completed, In Progress)
 * - Member since date
 */
const ProfileHeader = ({ user }) => {
  /**
   * Extract initials from email for avatar
   */
  const getInitials = (email) => {
    if (!email) return "U";

    const username = email.split("@")[0];
    const parts = username.split(/[._-]/);

    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }

    return username.substring(0, 2).toUpperCase();
  };

  /**
   * Pretty display name based on email username
   */
  const getDisplayName = (email) => {
    if (!email) return "User";

    const username = email.split("@")[0];
    const cleanName = username.replace(/[0-9_.-]/g, " ").trim();

    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

  /**
   * Convert created_at timestamp → "Month Year"
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
      {/* Banner Background */}
      <div className="profile-banner">
        {/* <div className="banner-gradient"></div> */}
      </div>

      {/* Profile Content */}
      <div className="profile-info">
        {/* Avatar + Name Section */}
        <div className="profile-user">
          <div className="profile-avatar">{getInitials(user?.email)}</div>

          <div className="profile-user-details">
            <h2 className="profile-name">{getDisplayName(user?.email)}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        {/* <div className="profile-stats">
          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Items</div>
          </div>

          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">Completed</div>
          </div>

          <div className="stat-item">
            <div className="stat-value">0</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div> */}

        {/* Meta */}
        <div className="profile-meta">
          <span className="meta-item">📅 Member since {getMemberSince()}</span>
          <span className="meta-item">🌊 Travel Enthusiast</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
