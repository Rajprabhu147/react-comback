import React from "react";
import Button from "../Shared/Button";
import { useUIStore } from "../../store/uiStore";
import { useDeleteItem } from "../../hooks/useItems";

/**
 * ItemRow Component
 * -----------------------------------------------------------
 * This component renders one single item in the list.
 * It shows:
 * - Title
 * - Description
 * - Status badge
 * - Priority badge
 * - Last updated date
 *
 * It also includes:
 * - Edit button → sets selected item (opens edit modal)
 * - Delete button → deletes item after confirmation
 */

const ItemRow = ({ item }) => {
  // Zustand store method to select an item for editing
  const setSelectedItem = useUIStore((state) => state.setSelectedItem);

  // Mutation hook to delete an item
  const deleteItem = useDeleteItem();

  /**
   * Handle item deletion
   * - stopPropagation prevents triggering parent click events
   * - asks for confirmation
   * - if confirmed, calls deleteItem.mutate(id)
   */
  const handleDelete = (e) => {
    e.stopPropagation();

    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteItem.mutate(item.id);
    }
  };

  /**
   * Handle edit click
   * - stopPropagation avoids row click handlers firing
   * - sets selected item for the edit modal
   */
  const handleEdit = (e) => {
    e.stopPropagation();
    setSelectedItem(item);
  };

  return (
    <div className="item-row hover-lift fade-in">
      {/* Header with title + actions */}
      <div className="item-header">
        <h3 className="item-title">{item.title}</h3>

        <div className="item-actions">
          {/* Edit button */}
          <Button variant="secondary" size="sm" onClick={handleEdit}>
            ✏️ Edit
          </Button>

          {/* Delete button with loading spinner */}
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            loading={deleteItem.isLoading}
          >
            🗑️ Delete
          </Button>
        </div>
      </div>

      {/* Optional description */}
      {item.description && (
        <p className="item-description">{item.description}</p>
      )}

      {/* Metadata row */}
      <div className="item-meta">
        {/* Status badge (open, closed…) */}
        <span className={`badge badge-${item.status}`}>{item.status}</span>

        {/* Priority badge (low, medium, high) */}
        <span className={`badge badge-${item.priority}`}>{item.priority}</span>

        {/* Updated date */}
        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
          Updated: {new Date(item.updated_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default ItemRow;
