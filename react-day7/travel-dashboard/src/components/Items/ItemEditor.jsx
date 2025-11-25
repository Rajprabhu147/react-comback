import React, { useState } from "react";
import { useUIStore } from "../../store/uiStore";
import { useCreateItem, useUpdateItem } from "../../hooks/useItems";
import Input from "../Shared/Input";
import Button from "../Shared/Button";

/**
 * ItemEditor Component
 * - Modal used for creating or editing items.
 * - Initializes form state from `selectedItem` when mounted.
 * - Uses modal `key` to force remount when selectedItem changes (keeps initializer in sync).
 */

const ItemEditor = () => {
  const { selectedItem, clearSelection } = useUIStore();

  const createItem = useCreateItem(); // mutation for creating new items
  const updateItem = useUpdateItem(); // mutation for updating items

  // Initialize form data from selectedItem on mount.
  // Using function form prevents reading selectedItem on every render.
  const [formData, setFormData] = useState(() => ({
    title: selectedItem?.title ?? "",
    description: selectedItem?.description ?? "",
    priority: selectedItem?.priority ?? "medium",
    status: selectedItem?.status ?? "open",
  }));

  const [errors, setErrors] = useState({});

  /**
   * Simple validation — Title required
   */
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Submit handler — creates or updates depending on selectedItem.id
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      if (selectedItem?.id) {
        // Edit existing item
        await updateItem.mutateAsync({
          ...selectedItem,
          ...formData,
        });
      } else {
        // Create new item
        await createItem.mutateAsync(formData);
      }

      // Close modal and reset form
      clearSelection();
      setFormData({
        title: "",
        description: "",
        priority: "medium",
        status: "open",
      });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  /**
   * Input change handler
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // If no item is selected → do NOT render the modal at all.
  if (!selectedItem) return null;

  const isEditing = !!selectedItem?.id;
  const isLoading = createItem.isLoading || updateItem.isLoading;

  return (
    // Overlay closes modal when clicked
    <div className="modal-overlay modern-overlay" onClick={clearSelection}>
      {/* 
        Key forces React to remount this modal when selectedItem.id changes.
        That allows the initializer above to re-run with the new selectedItem,
        avoiding the need to call setState synchronously in an effect.
      */}
      <div
        key={selectedItem?.id ?? "new"}
        className="modal modern-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Edit Item" : "Create New Item"}
          </h2>

          {/* Close button */}
          <Button variant="secondary" size="sm" onClick={clearSelection}>
            ✕
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <Input
              label="Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter item title"
            />

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter item description"
                rows={4}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Priority *</label>
              <select
                className="form-select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="modal-footer">
            <Button
              type="button"
              variant="secondary"
              onClick={clearSelection}
              disabled={isLoading}
            >
              Cancel
            </Button>

            <Button type="submit" loading={isLoading} disabled={isLoading}>
              {isEditing ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ItemEditor;
