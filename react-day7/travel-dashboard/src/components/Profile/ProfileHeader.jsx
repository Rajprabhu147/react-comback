import React from "react";

/**
 * ProfileHeader Component
 *
 * Displays user profile summary with:
 * - Avatar with initials
 * - User name and email
 * - Member since date
 */
const ProfileHeader = ({ user }) => {
  const getInitials = (email) => {
    if (!email) return "U";

    const username = email.split("@")[0];
    const parts = username.split(/[._-]/);

    return parts.length > 1
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : username.substring(0, 2).toUpperCase();
  };

  const getDisplayName = (email) => {
    if (!email) return "User";

    const username = email.split("@")[0];
    const cleanName = username.replace(/[0-9_.-]/g, " ").trim();

    return cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  };

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
      <div className="profile-info">
        <div className="profile-user">
          <div className="profile-avatar">{getInitials(user?.email)}</div>

          <div className="profile-user-details">
            <h2 className="profile-name">{getDisplayName(user?.email)}</h2>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-meta">
          <span className="meta-item">📅 Member since {getMemberSince()}</span>
          <span className="meta-item">🌊 Travel Enthusiast</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
