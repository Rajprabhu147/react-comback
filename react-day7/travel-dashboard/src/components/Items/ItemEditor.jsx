import React, { useState, useEffect, useRef } from "react";
import { useUIStore } from "../../store/uiStore";
import { useCreateItem, useUpdateItem } from "../../hooks/useItems";
import Input from "../Shared/Input";
import Button from "../Shared/Button";

/**
 * ItemEditor - Panel Version for Split Screen
 * - No modal overlay, just a side panel
 * - Cleaner, more modern UX
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

  const [formData, setFormData] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  // Keep track of previous selected item's id to avoid unnecessary setState calls
  const prevSelectedIdRef = useRef(selectedItem?.id ?? null);

  // Sync form data whenever selectedItem changes (only when id actually changes)
  useEffect(() => {
    const prevId = prevSelectedIdRef.current;
    const nextId = selectedItem?.id ?? null;

    if (prevId === nextId) {
      // nothing changed — avoid setState
      return;
    }

    prevSelectedIdRef.current = nextId;

    if (selectedItem) {
      setFormData({
        title: selectedItem.title ?? "",
        description: selectedItem.description ?? "",
        priority: selectedItem.priority ?? "medium",
        status: selectedItem.status ?? "open",
      });
    } else {
      setFormData(DEFAULT_FORM);
    }

    setErrors({});
    // We intentionally depend only on selectedItem?.id to avoid calling setState during unrelated prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItem?.id]);

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
        await updateItem.mutateAsync({
          ...selectedItem,
          ...formData,
        });
      } else {
        await createItem.mutateAsync(formData);
      }

      clearSelection();
      setFormData(DEFAULT_FORM);
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

  if (!selectedItem) return null;

  const isEditing = !!selectedItem.id;
  const isLoading = createItem.isLoading || updateItem.isLoading;

  return (
    <div className="item-editor-panel-content">
      {/* Header */}
      <div className="editor-header">
        <div className="editor-header-content">
          <div className="editor-icon">{isEditing ? "✏️" : "➕"}</div>
          <div>
            <h2 className="editor-title">
              {isEditing ? "Edit Item" : "Create New Item"}
            </h2>
            <p className="editor-subtitle">
              {isEditing ? "Update item details" : "Fill in the details below"}
            </p>
          </div>
        </div>
        <button
          className="editor-close"
          onClick={clearSelection}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="editor-form" noValidate>
        <div className="editor-body">
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

          <div className="form-row">
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
        </div>

        {/* Footer Actions */}
        <div className="editor-footer">
          <Button
            type="button"
            variant="secondary"
            onClick={clearSelection}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isLoading} disabled={isLoading}>
            {isEditing ? "Update Item" : "Create Item"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ItemEditor;
