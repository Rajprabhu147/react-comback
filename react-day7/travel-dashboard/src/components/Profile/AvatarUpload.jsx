import React, { useState, useRef } from "react";
import Button from "../Shared/Button";
import toast from "react-hot-toast";

/**
 * AvatarUpload Component
 *
 * Handles:
 * - Displaying the user's avatar (image or initials)
 * - Uploading a new avatar
 * - Showing upload preview
 * - Basic file validation
 * - Removing the avatar
 *
 * NOTE: Actual upload to Supabase Storage is marked as TODO.
 */
const AvatarUpload = ({ user }) => {
  // Tracks upload loading state
  const [uploading, setUploading] = useState(false);

  // Stores the current avatar URL (initially from user metadata)
  const [avatarUrl, setAvatarUrl] = useState(
    user?.user_metadata?.avatar_url || null
  );

  // Reference to the hidden <input type="file">
  const fileInputRef = useRef(null);

  /**
   * Extract initials from email to show placeholder avatar.
   * Example: "john@example.com" → "JO"
   */
  const getInitials = (email) => {
    if (!email) return "U";
    const username = email.split("@")[0];
    return username.substring(0, 2).toUpperCase();
  };

  /**
   * Triggered when user selects a file.
   * Performs:
   * - File validation (type + size)
   * - Converts image to base64 preview
   * - Upload placeholder logic
   */
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type (only images allowed)
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Limit file size: 5MB max
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setUploading(true);

    try {
      // Convert image file → base64 preview for immediate display
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(file);

      // TODO: Upload to Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from('avatars')
      //   .upload(`${user.id}/${file.name}`, file);

      toast.success("Avatar updated successfully!");
    } catch (error) {
      toast.error("Failed to upload avatar");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  /**
   * Removes current avatar preview.
   * (Later you can extend this to delete from Supabase.)
   */
  const handleRemove = () => {
    setAvatarUrl(null);
    toast.success("Avatar removed");
  };

  return (
    <div className="avatar-upload">
      {/* Avatar preview section */}
      <div className="avatar-preview">
        {avatarUrl ? (
          /* Show uploaded or existing avatar */
          <img src={avatarUrl} alt="Avatar" className="avatar-image" />
        ) : (
          /* Show fallback initials if no avatar image */
          <div className="avatar-placeholder">{getInitials(user?.email)}</div>
        )}

        {/* Hover overlay prompting user to change image */}
        <div className="avatar-overlay">
          <span className="overlay-text">Change Photo</span>
        </div>
      </div>

      {/* Avatar action buttons (upload + remove) */}
      <div className="avatar-actions">
        {/* Hidden file input, triggered by "Upload Photo" button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />

        {/* Upload button triggers file picker */}
        <Button
          onClick={() => fileInputRef.current?.click()}
          loading={uploading}
          disabled={uploading}
        >
          📷 Upload Photo
        </Button>

        {/* Remove button visible only when avatar exists */}
        {avatarUrl && (
          <Button variant="secondary" onClick={handleRemove}>
            🗑️ Remove
          </Button>
        )}

        {/* Small text hint under buttons */}
        <span className="avatar-hint">JPG, PNG or GIF. Max size 5MB.</span>
      </div>
    </div>
  );
};

export default AvatarUpload;
