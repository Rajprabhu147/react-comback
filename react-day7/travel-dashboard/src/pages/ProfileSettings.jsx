import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import PageLayout from "../components/Layout/PageLayout";
import ProfileHeader from "../components/Profile/ProfileHeader";
import AvatarUpload from "../components/Profile/AvatarUpload";
import PasswordChange from "../components/Profile/PasswordChange";
import DangerZone from "../components/Profile/DangerZone";
import Button from "../components/Shared/Button";
import Input from "../components/Shared/Input";
import toast from "react-hot-toast";
import "../styles/profile.css";

/**
 * ProfileSettings Component
 *
 * Renders the user account settings page.
 * Uses the authenticated user from UserContext
 * and provides UI to:
 * - View/update profile metadata (name, username, bio, etc.)
 * - Change password
 *
 * - View device sessions
 * - Access destructive settings in the Danger Zone
 */
const ProfileSettings = () => {
  // Get logged-in user from Supabase auth context
  const { user } = useUser();

  // Tracks whether editable fields are enabled ("Edit" mode)
  const [isEditing, setIsEditing] = useState(false);

  // Shows loading UI during profile update request
  const [loading, setLoading] = useState(false);

  /**
   * formData stores all editable user metadata fields.
   * It initializes from user.user_metadata if available.
   * These values are not saved permanently until "Save Changes" is clicked.
   */
  const [formData, setFormData] = useState({
    fullName: user?.user_metadata?.full_name || "",
    username: user?.user_metadata?.username || "",
    bio: user?.user_metadata?.bio || "",
    location: user?.user_metadata?.location || "",
    website: user?.user_metadata?.website || "",
    phone: user?.user_metadata?.phone || "",
  });

  /**
   * Generic form handler that updates local state when input changes.
   * Runs for both text inputs and textarea fields.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * handleSave()
   *
   * Triggered when user clicks "Save Changes".
   * - Shows loading indicator
   * - (Currently) simulates a backend call
   * - Should later be replaced with Supabase `updateUser()` to persist metadata
   * - On success, closes edit mode and shows toast
   */
  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate network delay

      /**
       * TODO: Replace with real Supabase update:
       *
       * await supabase.auth.updateUser({
       *   data: formData
       * });
       */

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
   * handleCancel()
   *
   * Restores form fields to original user metadata
   * and exits editing mode.
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
        {/* USER HEADER + AVATAR
           Displays current user's name, email, join date, etc.
           Also provides avatar upload component.
        */}
        <div className="profile-section">
          <ProfileHeader user={user} />
          <AvatarUpload user={user} />
        </div>

        {/* PERSONAL INFORMATION SETTINGS */}
        <div className="profile-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Personal Information</h2>
              <p className="section-description">
                Update your personal details and how others see you
              </p>
            </div>

            {/* EDIT / SAVE BUTTON LOGIC */}
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

          {/* EDITABLE FORM FIELDS */}
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

            {/* BIO FIELD */}
            <div className="form-group">
              <label className="form-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                className="form-textarea"
                rows={4}
              />
              <span className="character-count">
                {formData.bio.length} / 500
              </span>
            </div>

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

        {/* PASSWORD CHANGE SECTION */}
        <div className="profile-section">
          <PasswordChange />
        </div>

        {/* SESSIONS / ACTIVITY LIST
           This is currently a static preview of recent sessions.
           In a real-world app, you'd fetch this data from an API.
         */}
        <div className="profile-section">
          <div className="section-header">
            <div>
              <h2 className="section-title">Activity & Sessions</h2>
              <p className="section-description">
                View your recent activity and active sessions
              </p>
            </div>
          </div>

          <div className="activity-list">
            {/* Current browser session */}
            <div className="activity-item">
              <div className="activity-icon">💻</div>
              <div className="activity-details">
                <div className="activity-title">Current Session</div>
                <div className="activity-meta">
                  Chrome on Windows • Chennai, Tamil Nadu, IN
                </div>
              </div>
              <span className="activity-badge active">Active Now</span>
            </div>

            {/* Example secondary session */}
            <div className="activity-item">
              <div className="activity-icon">📱</div>
              <div className="activity-details">
                <div className="activity-title">Mobile Device</div>
                <div className="activity-meta">
                  Safari on iOS • Last seen 2 hours ago
                </div>
              </div>
              <Button variant="secondary" size="sm">
                Revoke
              </Button>
            </div>
          </div>
        </div>

        {/* ACCOUNT DELETION AREA */}
        <DangerZone user={user} />
      </div>
    </PageLayout>
  );
};

export default ProfileSettings;
