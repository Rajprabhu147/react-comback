import React, { useState, useEffect } from "react";
import { useUIStore } from "../../store/uiStore";
import { useCreateItem, useUpdateItem } from "../../hooks/useItems";
import Input from "../Shared/Input";
import Button from "../Shared/Button";

/**
 * ItemEditor
 * - Modal for creating or editing items.
 * - Syncs form state with `selectedItem` whenever it changes without calling setState synchronously inside effects.
 */

const DEFAULT_FORM = {
  title: "",
  description: "",
  priority: "medium",
  status: "open",
};

const ItemEditor = () => {
  const { selectedItem, clearSelection } = useUIStore();

  const createItem = useCreateItem();
  const updateItem = useUpdateItem();

  // Initialize state lazily based on selectedItem so initial render is correct
  const [formData, setFormData] = useState(() => {
    if (selectedItem) {
      return {
        title: selectedItem.title ?? "",
        description: selectedItem.description ?? "",
        priority: selectedItem.priority ?? "medium",
        status: selectedItem.status ?? "open",
      };
    }
    return { ...DEFAULT_FORM };
  });

  const [errors, setErrors] = useState({});

  // Sync form data whenever selectedItem changes — update asynchronously to satisfy lint rule.
  useEffect(() => {
    let rafId = null;

    rafId = requestAnimationFrame(() => {
      if (selectedItem) {
        setFormData({
          title: selectedItem.title ?? "",
          description: selectedItem.description ?? "",
          priority: selectedItem.priority ?? "medium",
          status: selectedItem.status ?? "open",
        });
      } else {
        // Reset when no item selected (create mode / closed)
        setFormData({ ...DEFAULT_FORM });
      }
      setErrors({});
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [selectedItem]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

      clearSelection();
      setFormData({ ...DEFAULT_FORM });
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // If no item is selected → do NOT render the modal
  if (!selectedItem) return null;

  const isEditing = !!selectedItem.id;
  const isLoading = createItem.isLoading || updateItem.isLoading;

  return (
    <div className="modal-overlay modern-overlay" onClick={clearSelection}>
      <div className="modal modern-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {isEditing ? "Edit Item" : "Create New Item"}
          </h2>

          <Button variant="secondary" size="sm" onClick={clearSelection}>
            ✕
          </Button>
        </div>

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
