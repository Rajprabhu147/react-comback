import React, { useMemo } from "react";
import ItemRow from "./ItemRow";
import LoadingSpinner from "../Shared/LoadingSpinner";
import { useItems } from "../../hooks/useItems";
import { useUIStore } from "../../store/uiStore";
import Input from "../Shared/Input";
import Button from "../Shared/Button";
import SkeletonLoader from "../Shared/SkeletonLoader";

/**
 * ItemsList Component
 * ---------------------------------------------------------
 * This component handles:
 * - Fetching items
 * - Showing loading / error states
 * - Search, Status, and Priority filtering
 * - Rendering a list of ItemRow components
 * - Showing an empty state when no results match
 * - Opening the "New Item" modal
 */

const ItemsList = () => {
  // Fetch items (data, loading, and error state)
  const { data: items = [], isLoading, isError } = useItems();

  // Get UI filter + search state from Zustand store
  const {
    searchQuery,
    statusFilter,
    priorityFilter,
    setSearchQuery,
    setStatusFilter,
    setPriorityFilter,
    resetFilters,
    setSelectedItem,
  } = useUIStore();

  /**
   * Filtering Logic (Memoized)
   * ---------------------------------------------------
   * The filtering happens inside useMemo so it's fast
   * and does not re-run unless items or filters change.
   *
   * Filters applied:
   * - Search text (title or description)
   * - Status filter
   * - Priority filter
   */
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Matches search (title or description)
      const matchesSearch =
        !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());

      // Matches status filter
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      // Matches priority filter
      const matchesPriority =
        priorityFilter === "all" || item.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [items, searchQuery, statusFilter, priorityFilter]);
  // Inside component
  if (isLoading) {
    return <SkeletonLoader type="item" count={5} />;
  }
  // Loading state
  if (isLoading) {
    return <LoadingSpinner message="Loading items..." />;
  }

  // Error state
  if (isError) {
    return (
      <div className="card">
        <p style={{ color: "var(--danger)", textAlign: "center" }}>
          Error loading items. Please try again.
        </p>
      </div>
    );
  }

  /**
   * Render Main Component
   * ---------------------------------------------------------
   * Includes:
   * - Card header with "New Item" button
   * - Filters: Search, Status, Priority, Reset
   * - Items list OR empty state message
   */
  return (
    <div className="items-container">
      {/* Header + Filters */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Items ({filteredItems.length})</h2>

          {/* Clicking this opens the "New Item" modal */}
          <Button onClick={() => setSelectedItem({})}>➕ New Item</Button>
        </div>

        {/* Filters Section */}
        <div className="items-filters">
          {/* Search input */}
          <Input
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1 }}
          />

          {/* Status filter dropdown */}
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

          {/* Priority filter dropdown */}
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

          {/* Reset all filters */}
          <Button variant="secondary" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      {/* If no items match filters → show empty state */}
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
        // Render item rows
        <div className="items-list stagger-children">
          {filteredItems.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsList;
