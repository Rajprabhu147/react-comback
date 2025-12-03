import React, { useState, useMemo } from "react";
import KanbanItineraryCard from "./KanbanItineraryCard";
import ItineraryItemEditor from "./ItineraryItemEditor";
import { Search, Plus, Filter, Calendar } from "lucide-react";
import "../../styles/kanban-card.css";

/**
 * ItineraryItemsList Component - Kanban Board Style
 * Displays itinerary as day-based columns with draggable cards
 */

const CATEGORIES = [
  { value: "all", label: "All Activities" },
  { value: "sightseeing", label: "🏛️ Sightseeing" },
  { value: "dining", label: "🍽️ Dining" },
  { value: "accommodation", label: "🏨 Accommodation" },
  { value: "transport", label: "🚗 Transport" },
  { value: "shopping", label: "🛍️ Shopping" },
  { value: "activity", label: "⚡ Activity" },
];

const ItineraryItemsList = () => {
  // Load items from localStorage on first render
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("tripItineraryItems");
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading items from localStorage:", error);
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Get unique days from items
  const uniqueDays = useMemo(() => {
    return [...new Set(items.map((item) => item.day))].sort((a, b) => a - b);
  }, [items]);

  // Filter items based on search and category
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [items, searchQuery, categoryFilter]);

  // Group filtered items by day
  const itemsByDay = useMemo(() => {
    const grouped = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.day]) {
        grouped[item.day] = [];
      }
      grouped[item.day].push(item);
    });
    // Sort items within each day by time
    Object.keys(grouped).forEach((day) => {
      grouped[day].sort((a, b) => a.time.localeCompare(b.time));
    });
    return grouped;
  }, [filteredItems]);

  // Check if any filters are active
  const hasActiveFilters = searchQuery || categoryFilter !== "all";

  // Save items to localStorage
  const updateItems = (newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem("tripItineraryItems", JSON.stringify(newItems));
    } catch (error) {
      console.error("Error saving items to localStorage:", error);
    }
  };

  const handleAddNewItem = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleDeleteItem = (itemId) => {
    const newItems = items.filter((item) => item.id !== itemId);
    updateItems(newItems);
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      const newItems = items.map((item) =>
        item.id === editingItem.id ? itemData : item
      );
      updateItems(newItems);
    } else {
      updateItems([...items, itemData]);
    }
    setIsEditorOpen(false);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  const handleToggleComplete = (itemId, isCompleted) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, completed: isCompleted } : item
    );
    updateItems(newItems);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
  };

  return (
    <div className="kanban-board-container">
      {/* Header */}
      <div className="board-header">
        <div className="header-title">
          <Calendar size={24} />
          <div className="title-text">
            <h2>Trip Itinerary</h2>
            <p>{filteredItems.length} activities</p>
          </div>
        </div>
        <button onClick={handleAddNewItem} className="add-activity-btn">
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="board-filters">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="filter-select"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat.value} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="reset-filter-btn"
            title="Reset filters"
          >
            <Filter size={16} />
            Reset
          </button>
        )}
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {Object.keys(itemsByDay).length > 0 ? (
          uniqueDays.map((day) => (
            <div key={day} className="kanban-column">
              <div className="column-header">
                <h3 className="column-title">Day {day}</h3>
                <span className="column-count">
                  {itemsByDay[day]?.length || 0}
                </span>
              </div>

              <div className="column-cards">
                {itemsByDay[day]?.map((item) => (
                  <KanbanItineraryCard
                    key={item.id}
                    item={item}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                    onToggleComplete={handleToggleComplete}
                  />
                )) || null}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-board">
            <div className="empty-icon">✈️</div>
            <h3>No activities found</h3>
            <p>
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Start planning your trip!"}
            </p>
            <button onClick={handleAddNewItem} className="empty-action-btn">
              <Plus size={18} />
              Add First Activity
            </button>
          </div>
        )}
      </div>

      {/* Item Editor Modal */}
      {isEditorOpen && (
        <ItineraryItemEditor
          item={editingItem}
          onSave={handleSaveItem}
          onClose={handleCloseEditor}
        />
      )}
    </div>
  );
};

export default ItineraryItemsList;
