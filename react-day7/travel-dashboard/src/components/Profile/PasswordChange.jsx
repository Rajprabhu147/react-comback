import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Input from "../Shared/Input";
import Button from "../Shared/Button";
import toast from "react-hot-toast";

/**
 * PasswordChange
 *
 * UI + logic to let a signed-in user change their password and see basic security options.
 * Comments explain what each line / block does and how it affects the app.
 */
const PasswordChange = () => {
  // loading: boolean used to disable UI and show spinners while async actions run
  const [loading, setLoading] = useState(false);

  // showForm: toggles visibility of the change-password form
  const [showForm, setShowForm] = useState(false);

  // formData: local state holding the three password fields
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // errors: object for field-level validation messages (e.g. { newPassword: '...' })
  const [errors, setErrors] = useState({});

  // Generic change handler — updates formData and clears any error for the changed field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // validate(): client-side checks before sending the update request
  // - ensures fields are present
  // - enforces minimum length for new password
  // - ensures new and confirm match
  // - ensures new differs from current
  // returns true if valid, otherwise sets errors state and returns false
  const validate = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handleSubmit: called on form submission
  // - prevents default form submit
  // - validates locally
  // - calls Supabase to update the user's password (supabase.auth.updateUser)
  // - shows success/failure via toast, resets form on success
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      // Supabase call to update logged-in user's password
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword,
      });

      if (error) throw error;

      // Notify user and reset local form state & hide the form
      toast.success("Password changed successfully!");
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowForm(false);
    } catch (error) {
      // Surface a readable message when update fails
      toast.error(error.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Section header: title, description and button to open the form */}
      <div className="section-header">
        <div>
          <h2 className="section-title">Password & Security</h2>
          <p className="section-description">
            Manage your password and security settings
          </p>
        </div>

        {/* Show "Change Password" button only when form is hidden.
            Clicking it toggles showForm to true, revealing the form.
        */}
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>🔒 Change Password</Button>
        )}
      </div>

      {/* Conditionally render the change-password form when showForm is true */}
      {showForm && (
        <form onSubmit={handleSubmit} className="password-form">
          {/* Current password input: required for UX and validation.
              Uses shared Input component and shows field-level error if present.
          */}
          <Input
            label="Current Password"
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            error={errors.currentPassword}
            placeholder="Enter current password"
          />

          {/* New password input: validated for minimum length and difference */}
          <Input
            label="New Password"
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            error={errors.newPassword}
            placeholder="Enter new password"
          />

          {/* Confirm password input: must match newPassword */}
          <Input
            label="Confirm New Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            placeholder="Confirm new password"
          />

          {/* Client-side password requirement hints.
              Each <li> receives 'valid' class when the condition is satisfied.
              These are purely informational and help users craft a stronger password.
          */}
          <div className="password-requirements">
            <p className="requirements-title">Password requirements:</p>
            <ul className="requirements-list">
              <li className={formData.newPassword.length >= 6 ? "valid" : ""}>
                At least 6 characters
              </li>
              <li className={/[A-Z]/.test(formData.newPassword) ? "valid" : ""}>
                One uppercase letter
              </li>
              <li className={/[0-9]/.test(formData.newPassword) ? "valid" : ""}>
                One number
              </li>
            </ul>
          </div>

          {/* Form action buttons:
              - Cancel resets form state and hides the form
              - Update triggers form submission and shows loading state while in progress
              Buttons are disabled while loading to prevent duplicate requests.
          */}
          <div className="form-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                setFormData({
                  currentPassword: "",
                  newPassword: "",
                  confirmPassword: "",
                });
                setErrors({});
              }}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={loading} disabled={loading}>
              Update Password
            </Button>
          </div>
        </form>
      )}

      {/* Additional security UI (placeholders):
          - Two-Factor Authentication block (button placeholder)
          - Login Alerts block with a basic toggle (UI-only by default)
          These are static UI pieces; you can hook them to backend flows later.
      */}
      <div className="security-info">
        <div className="info-item">
          <span className="info-icon">🔐</span>
          <div className="info-content">
            <div className="info-title">Two-Factor Authentication</div>
            <div className="info-description">
              Add an extra layer of security to your account
            </div>
          </div>
          <Button variant="secondary" size="sm">
            Enable
          </Button>
        </div>

        <div className="info-item">
          <span className="info-icon">📧</span>
          <div className="info-content">
            <div className="info-title">Login Alerts</div>
            <div className="info-description">
              Get notified of new sign-ins to your account
            </div>
          </div>
          {/* Toggle is UI-only; defaultChecked means it's on by default */}
          <label className="toggle-switch">
            <input type="checkbox" defaultChecked />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PasswordChange;
