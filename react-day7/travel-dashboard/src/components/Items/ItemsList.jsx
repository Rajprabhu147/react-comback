import React, { useMemo } from "react";
import ItemRow from "./ItemRow";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { useItems } from "../../hooks/useItems";
import { useUIStore } from "../../store/uiStore";
import Input from "../Shared/Input";
import Button from "../Shared/Button";
import SkeletonLoader from "../Shared/SkeletonLoader";
import ItemEditor from "./ItemEditor";

/**
 * ItemsList Component - Split Screen Layout
 * ---------------------------------------------------------
 * Features:
 * - Split screen: Editor on left, List on right
 * - Real-time filtering
 * - Smooth animations
 * - Responsive design
 */

const ItemsList = () => {
  const { data: items = [], isLoading, isError } = useItems();

  const {
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    resetFilters,
    setSelectedItem,
    selectedItem,
  } = useUIStore();

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesPriority =
        priorityFilter === "all" || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [items, searchQuery, statusFilter, priorityFilter]);

  if (isLoading) {
    return <SkeletonLoader type="item" count={5} />;
  }

  if (isError) {
    return (
      <div className="card">
        <p style={{ color: "var(--danger)", textAlign: "center" }}>
          Error loading items. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="items-split-container">
      {/* LEFT SIDE - Item Editor (only shows when item is selected) */}
      <div className={`items-editor-panel ${selectedItem ? "active" : ""}`}>
        {selectedItem && <ItemEditor />}
      </div>

      {/* RIGHT SIDE - Items List */}
      <div className={`items-list-panel ${selectedItem ? "with-editor" : ""}`}>
        {/* Header + Filters */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Items ({filteredItems.length})</h2>
            <Button onClick={() => setSelectedItem({})}>➕ New Item</Button>
          </div>

          {/* Filters Section */}
          <div className="items-filters">
            <Input
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
            />

            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="closed">Closed</option>
            </select>

            <select
              className="form-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <Button variant="secondary" onClick={resetFilters}>
              Reset
            </Button>
          </div>
        </div>

        {/* Items List or Empty State */}
        {filteredItems.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-icon">📭</div>
            <h3 className="empty-state-title">No items found</h3>
            <p className="empty-state-description">
              {searchQuery || statusFilter !== "all" || priorityFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first item to get started"}
            </p>
            <Button onClick={() => setSelectedItem({})}>Create Item</Button>
          </div>
        ) : (
          <div className="items-list stagger-children">
            {filteredItems.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemsList;
