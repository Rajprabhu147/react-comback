import React, { useState, useEffect } from "react";
import { useUIStore } from "../../store/uiStore";
import { useCreateItem, useUpdateItem } from "../../hooks/useItems";
import Input from "../Shared/Input";
import Button from "../Shared/Button";

/**
 * ItemEditor Component
 * -----------------------------------------------------------
 * This component is the modal used for:
 *  - Creating a new item
 *  - Editing an existing item
 *
 * It opens when `selectedItem` in the UI store is set.
 * It closes when `clearSelection()` is called.
 *
 * The form includes:
 *  - Title (required)
 *  - Description
 *  - Priority (low/medium/high)
 *  - Status (open/in-progress/closed)
 *
 * On submit:
 *  - If selectedItem.id exists → UPDATE
 *  - Otherwise → CREATE new item
 */

const ItemEditor = () => {
  const { selectedItem, clearSelection } = useUIStore();

  const createItem = useCreateItem(); // mutation for creating new items
  const updateItem = useUpdateItem(); // mutation for updating items

  // Local form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
  });

  const [errors, setErrors] = useState({});

  /**
   * Load item data into form when selectedItem changes.
   * If editing → fill inputs with existing item values.
   * If creating → keep default empty form.
   */
  useEffect(() => {
    if (selectedItem) {
      setFormData({
        title: selectedItem.title || "",
        description: selectedItem.description || "",
        priority: selectedItem.priority || "medium",
        status: selectedItem.status || "open",
      });
    }
  }, [selectedItem]);

  /**
   * Simple validation
   * - Title is required
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
   * Handle Form Submit
   * -------------------------------------------------
   * If editing (selectedItem.id exists):
   *   → call updateItem.mutateAsync()
   * If creating:
   *   → call createItem.mutateAsync()
   * After success:
   *   → close modal + reset form
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
   * Handle user typing into form fields
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field-specific error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * If no item is selected → do NOT render the modal at all.
   */
  if (!selectedItem) return null;

  const isEditing = !!selectedItem?.id;
  const isLoading = createItem.isLoading || updateItem.isLoading;

  return (
    <div className="modal-overlay" onClick={clearSelection}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
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

        {/* Form Start */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title input */}
            <Input
              label="Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              placeholder="Enter item title"
            />

            {/* Description textarea */}
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

            {/* Priority dropdown */}
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

            {/* Status dropdown */}
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
            {/* Cancel button */}
            <Button
              type="button"
              variant="secondary"
              onClick={clearSelection}
              disabled={isLoading}
            >
              Cancel
            </Button>

            {/* Submit button */}
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
