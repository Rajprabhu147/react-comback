import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import PageLayout from "../components/Layout/PageLayout";
import ProfileHeader from "../components/Profile/ProfileHeader";
import PasswordChange from "../components/Profile/PasswordChange";
import DangerZone from "../components/Profile/DangerZone";
import Button from "../components/Shared/Button";
import Input from "../components/Shared/Input";
import toast from "react-hot-toast";
import "../styles/profile.css";

/**
 * ProfileSettings Component
 *
 * FIXED FEATURES:
 * - Avatar upload with save button
 * - Avatar updates in header after save
 * - Tighter spacing throughout
 * - Coordinated CSS
 *
 * NOTE: activity-* classes renamed to login-* to avoid collisions
 */
const ProfileSettings = () => {
  const { user, updateUser } = useUser(); // Add updateUser if available in context

  // Profile editing state
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Avatar upload state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    user?.user_metadata?.avatar_url || null
  );
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Form data for profile fields
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    username: user?.user_metadata?.username || "",
    bio: user?.user_metadata?.bio || "",
    location: user?.user_metadata?.location || "",
    website: user?.user_metadata?.website || "",
    phone: user?.user_metadata?.phone || "",
  });

  /**
   * Handle text input changes
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle avatar file selection
   */
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      setAvatarFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  /**
   * Save avatar to server and update user context
   */
  const handleAvatarSave = async () => {
    if (!avatarFile) {
      toast.error("Please select an image first");
      return;
    }

    setAvatarLoading(true);
    try {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For now, use the preview URL (in production, use uploaded URL)
      const avatarUrl = avatarPreview;

      // Update user context with new avatar
      if (updateUser) {
        updateUser({
          ...user,
          user_metadata: {
            ...user.user_metadata,
            avatar_url: avatarUrl,
          },
        });
      }

      toast.success("Avatar updated successfully!");
      setAvatarFile(null);
    } catch (error) {
      toast.error("Failed to update avatar");
      console.error(error);
    } finally {
      setAvatarLoading(false);
    }
  };

  /**
   * Remove avatar
   */
  const handleAvatarRemove = () => {
    setAvatarFile(null);
    setAvatarPreview(null);

    // Update user context
    if (updateUser) {
      updateUser({
        ...user,
        user_metadata: {
          ...user.user_metadata,
          avatar_url: null,
        },
      });
    }

    toast.success("Avatar removed");
  };

  /**
   * Save profile changes
   */
  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel profile editing
   */
  const handleCancel = () => {
    setFormData({
      fullName: user?.user_metadata?.full_name || "",
      username: user?.user_metadata?.username || "",
      bio: user?.user_metadata?.bio || "",
      location: user?.user_metadata?.location || "",
      website: user?.user_metadata?.website || "",
      phone: user?.user_metadata?.phone || "",
    });
    setIsEditing(false);
  };

  return (
    <PageLayout
      title="Profile Settings"
      subtitle="Manage your account information and preferences"
      showBackButton={true}
    >
      <div className="profile-container">
        {/* PROFILE HEADER & AVATAR */}
        <div className="profile-section profile-header-section">
          <ProfileHeader user={user} />

          {/* AVATAR UPLOAD WITH SAVE BUTTON */}
          <div className="avatar-upload">
            <div
              className="avatar-preview"
              onClick={() => document.getElementById("avatar-input").click()}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-placeholder">
                  {user?.user_metadata?.full_name?.[0]?.toUpperCase() ||
                    user?.email?.[0]?.toUpperCase() ||
                    "?"}
                </div>
              )}
              <div className="avatar-overlay">
                <span className="overlay-text">
                  {avatarPreview ? "Change Photo" : "Upload Photo"}
                </span>
              </div>
            </div>

            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />

            <div className="avatar-actions">
              <div className="avatar-buttons">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    document.getElementById("avatar-input").click()
                  }
                >
                  📤 Choose Photo
                </Button>
                {avatarFile && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAvatarSave}
                    loading={avatarLoading}
                    disabled={avatarLoading}
                  >
                    💾 Save Avatar
                  </Button>
                )}
                {avatarPreview && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={handleAvatarRemove}
                    disabled={avatarLoading}
                  >
                    🗑️ Remove
                  </Button>
                )}
              </div>
              <p className="avatar-hint">
                JPG, PNG or GIF. Max size 5MB. Recommended 400x400px.
              </p>
            </div>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="profile-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Personal Information</h2>
              <p className="section-description">
                Update your personal details and how others see you
              </p>
            </div>

            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                ✏️ Edit Profile
              </Button>
            ) : (
              <div className="action-buttons">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  loading={loading}
                  disabled={loading}
                >
                  Save Changes
                </Button>
              </div>
            )}
          </div>

          <div className="profile-form">
            {/* EMAIL — READ ONLY */}
            <div className="form-row">
              <Input
                label="Email Address"
                type="email"
                value={user?.email}
                disabled
                className="disabled-input"
              />
              <span className="verified-badge">✓ Verified</span>
            </div>

            {/* Full name + username */}
            <div className="form-row">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your full name"
              />
              <Input
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Choose a username"
              />
            </div>

            {/* BIO */}
            {/* <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className="form-textarea"
                rows={3}
                maxLength={500}
              />
              <span className="character-count">
                {formData.bio.length} / 500
              </span>
            </div>
 */}
            {/* LOCATION + WEBSITE */}
            <div className="form-row">
              <Input
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="City, Country"
              />
              <Input
                label="Website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="https://yourwebsite.com"
              />
            </div>

            {/* PHONE */}
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="+1 (555) 000-0000"
            />
          </div>
        </div>

        {/* PASSWORD CHANGE */}
        <div className="profile-section">
          <PasswordChange />
        </div>

        {/* LOGIN ACTIVITY & SESSIONS */}
        <div className="profile-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Login Activity</h2>
              <p className="section-description">
                View your recent login activity and active sessions
              </p>
            </div>
          </div>

          <div className="login-activity">
            <div className="login-item">
              <div className="login-icon">💻</div>
              <div className="login-details">
                <div className="login-title">Current Session</div>
                <div className="login-meta">
                  Chrome on Windows • Chennai, Tamil Nadu, IN — Active Now
                </div>
              </div>
            </div>

            <div className="login-item">
              <div className="login-icon">📱</div>
              <div className="login-details">
                <div className="login-title">Mobile Device</div>
                <div className="login-meta">
                  Safari on iOS • Last seen 2 hours ago
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Revoke
              </Button>
            </div>
          </div>
        </div>

        {/* DANGER ZONE */}
        <DangerZone user={user} />
      </div>
    </PageLayout>
  );
};

export default ProfileSettings;
