import React, { useState } from "react";
// useNavigate lets the app programmatically redirect the user after deletion
import { useNavigate } from "react-router-dom";
// Supabase instance to log the user out after account deletion
import { supabase } from "../../lib/supabaseClient";
// Reusable styled button component
import Button from "../Shared/Button";
// Toast for showing success/error notifications
import toast from "react-hot-toast";

const DangerZone = ({ user }) => {
  // Router hook used to navigate to login page after account deletion
  const navigate = useNavigate();

  // Boolean: whether the delete confirmation modal is visible
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Stores the text the user types in the confirmation field ("DELETE")
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // Boolean showing whether the delete request is currently processing
  const [deleting, setDeleting] = useState(false);

  // Export Data button handler — currently just a placeholder
  // It simulates beginning a data export operation
  const handleExportData = async () => {
    try {
      // TODO: Replace with actual backend export feature
      toast.success("Data export started. You will receive an email shortly.");
    } catch (error) {
      toast.error("Failed to export data");
    }
  };

  // Handles the account deletion logic
  const handleDeleteAccount = async () => {
    // Requires the exact word "DELETE" for safety
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm");
      return;
    }

    // Shows loading state
    setDeleting(true);
    try {
      // TODO: Actual deletion must be handled on a secure backend API
      toast.success("Account deletion initiated");

      // Logs the user out after requesting deletion
      await supabase.auth.signOut();

      // Redirect user to login page
      navigate("/login");
    } catch (error) {
      toast.error("Failed to delete account");
    } finally {
      // Regardless of success or failure, stop loading animation
      setDeleting(false);
    }
  };

  return (
    <div className="profile-section danger-zone">
      {/* Header section for Danger Zone */}
      <div className="section-header">
        <div>
          <h2 className="section-title danger-title">⚠️ Danger Zone</h2>
          <p className="section-description">
            Irreversible actions that affect your account
          </p>
        </div>
      </div>

      {/* Two dangerous actions: Export Data & Delete Account */}
      <div className="danger-actions">
        {/* Export Data row */}
        <div className="danger-item">
          <div className="danger-info">
            <div className="danger-item-title">Export Your Data</div>
            <div className="danger-item-description">
              Download all your data in JSON format
            </div>
          </div>
          {/* Button to trigger export */}
          <Button variant="secondary" onClick={handleExportData}>
            📥 Export Data
          </Button>
        </div>

        {/* Delete Account row */}
        <div className="danger-item">
          <div className="danger-info">
            <div className="danger-item-title">Delete Account</div>
            <div className="danger-item-description">
              Permanently delete your account and all associated data
            </div>
          </div>
          {/* Opens the confirmation modal */}
          <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
            🗑️ Delete Account
          </Button>
        </div>
      </div>

      {/* Confirmation modal for deleting the account */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal danger-modal">
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">⚠️ Delete Account</h2>
              <button
                className="modal-close"
                onClick={() => setShowDeleteConfirm(false)}
              >
                ✕
              </button>
            </div>

            {/* Modal Body: info + text field */}
            <div className="modal-body">
              <div className="warning-box">
                <p>
                  <strong>Warning:</strong> This action cannot be undone.
                </p>
                <p>
                  All your data including items, events, and settings will be
                  permanently deleted.
                </p>
              </div>

              {/* Input where user must type DELETE */}
              <div className="form-group">
                <label className="form-label">
                  Type <strong>DELETE</strong> to confirm:
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                />
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="modal-footer">
              {/* Cancel button resets modal and input */}
              <Button
                variant="secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteConfirmText("");
                }}
                disabled={deleting}
              >
                Cancel
              </Button>

              {/* Delete button: only active when user typed DELETE */}
              <Button
                variant="danger"
                onClick={handleDeleteAccount}
                loading={deleting}
                disabled={deleting || deleteConfirmText !== "DELETE"}
              >
                Delete My Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerZone;
