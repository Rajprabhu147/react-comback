import React, { useState, useMemo } from "react";
import ItineraryItemsRow from "./ItineraryItemsRow";
import ItineraryItemEditor from "./ItineraryItemEditor";
import { Search, Plus, Filter } from "lucide-react";
import "../../styles/itinerary-list.css";

/**
 * ItineraryItemsList Component
 * Displays all trip itinerary activities with filtering and search
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
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Get unique days from items
  const uniqueDays = useMemo(() => {
    return [...new Set(items.map((item) => item.day))].sort((a, b) => a - b);
  }, [items]);

  // Filter items based on search, category, and day
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.notes.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      const matchesDay = dayFilter === "all" || item.day === parseInt(dayFilter);

      return matchesSearch && matchesCategory && matchesDay;
    });
  }, [items, searchQuery, categoryFilter, dayFilter]);

  // Group filtered items by day
  const itemsByDay = useMemo(() => {
    const grouped = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.day]) {
        grouped[item.day] = [];
      }
      grouped[item.day].push(item);
    });
    return grouped;
  }, [filteredItems]);

  const handleAddNewItem = () => {
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const handleDeleteItem = (itemId) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const handleSaveItem = (itemData) => {
    if (editingItem) {
      // Update existing item
      setItems(
        items.map((item) => (item.id === editingItem.id ? itemData : item))
      );
    } else {
      // Add new item
      setItems([...items, itemData]);
    }
    setIsEditorOpen(false);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setDayFilter("all");
  };

  const hasActiveFilters =
    searchQuery || categoryFilter !== "all" || dayFilter !== "all";

  return (
    <div className="itinerary-items-list">
      {/* Header */}
      <div className="list-header">
        <div className="header-title">
          <h2>Trip Itinerary</h2>
          <span className="count-badge">{filteredItems.length}</span>
        </div>
        <button onClick={handleAddNewItem} className="add-btn">
          <Plus size={18} />
          Add Activity
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="search-filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search activities, locations..."
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

        <select
          value={dayFilter}
          onChange={(e) => setDayFilter(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Days</option>
          {uniqueDays.map((day) => (
            <option key={day} value={day}>
              Day {day}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="reset-btn"
            title="Reset all filters"
          >
            <Filter size={16} />
            Reset
          </button>
        )}
      </div>

      {/* Activities List */}
      <div className="activities-container">
        {Object.keys(itemsByDay).length > 0 ? (
          Object.entries(itemsByDay)
            .sort(([dayA], [dayB]) => parseInt(dayA) - parseInt(dayB))
            .map(([day, dayItems]) => (
              <div key={day} className="day-section">
                <h3 className="day-title">
                  Day {day}
                  <span className="day-count">{dayItems.length}</span>
                </h3>
                <div className="day-activities">
                  {dayItems
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((item) => (
                      <ItineraryItemsRow
                        key={item.id}
                        item={item}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                      />
                    ))}
                </div>
              </div>
            ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">✈️</div>
            <h3>No activities found</h3>
            <p>
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "Start planning your trip!"}
            </p>
            <button onClick={handleAddNewItem} className="empty-btn">
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