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
      <div className="profile-userinfo">
        <h2 className="profile-name">{getDisplayName(user?.email)}</h2>
        <div className="profile-meta">
          <span className="meta-item">📅 Member since {getMemberSince()}</span>
          <span className="meta-item">🌊 Travel Enthusiast</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
