import React, { useState, useMemo, useEffect } from "react";
import ItineraryItemsRow from "./ItineraryItemsRow";
import ItineraryItemEditor from "./ItineraryItemEditor";
import { Search, Plus, Filter } from "lucide-react";
import "../../styles/itinenary-list.css";

/**
 * ItineraryItemsList Component
 * Displays all trip itinerary activities with filtering and search
 *
 * - Listens for 'itinerary-open-editor' to open the editor with a prefilled date/day
 * - Dispatches 'itinerary-updated' after changes so calendar refreshes
 */

const STORAGE_KEY = "tripItineraryItems";

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
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error loading items from localStorage:", error);
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dayFilter, setDayFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // When external components dispatch 'itinerary-updated', reload items
  useEffect(() => {
    function handleExternalUpdate() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setItems(raw ? JSON.parse(raw) : []);
      } catch (e) {
        console.error("Failed to reload itinerary after external update", e);
      }
    }
    window.addEventListener("itinerary-updated", handleExternalUpdate);
    return () =>
      window.removeEventListener("itinerary-updated", handleExternalUpdate);
  }, []);

  // Listen for calendar open-editor event to prefill editor with date/day
  useEffect(() => {
    function handleOpenEditor(e) {
      try {
        const { dateISO, day } = e.detail || {};
        // Prefill a new item (id left undefined so save logic adds it)
        const prefill = {
          id: undefined,
          date: dateISO || "",
          day: day ?? "",
          time: "",
          activity: "",
          location: "",
          category: "activity",
          notes: "",
          completed: false,
        };
        setEditingItem(prefill);
        setIsEditorOpen(true);
      } catch (err) {
        console.error("Invalid itinerary-open-editor event detail", err);
      }
    }
    window.addEventListener("itinerary-open-editor", handleOpenEditor);
    return () =>
      window.removeEventListener("itinerary-open-editor", handleOpenEditor);
  }, []);

  // Get unique days from items
  const uniqueDays = useMemo(() => {
    return [...new Set(items.map((item) => item.day))].sort((a, b) => a - b);
  }, [items]);

  // Filter items based on search, category, and day
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (item.activity && item.activity.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q)) ||
        (item.notes && item.notes.toLowerCase().includes(q));

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;

      const matchesDay =
        dayFilter === "all" || item.day === parseInt(dayFilter);

      return matchesSearch && matchesCategory && matchesDay;
    });
  }, [items, searchQuery, categoryFilter, dayFilter]);

  // Group filtered items by day
  const itemsByDay = useMemo(() => {
    const grouped = {};
    filteredItems.forEach((item) => {
      if (!grouped[item.day]) grouped[item.day] = [];
      grouped[item.day].push(item);
    });
    return grouped;
  }, [filteredItems]);

  // Check if any filters are active
  const hasActiveFilters =
    searchQuery || categoryFilter !== "all" || dayFilter !== "all";

  // Save items to localStorage whenever they change via this helper
  const saveItemsAndNotify = (newItems) => {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
      // notify others (calendar) that itinerary changed
      window.dispatchEvent(
        new CustomEvent("itinerary-updated", {
          detail: { source: "itinerary-list" },
        })
      );
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
    saveItemsAndNotify(newItems);
  };

  const handleSaveItem = (itemData) => {
    // Decide whether to update or add by checking presence of id in stored items
    try {
      const exists =
        itemData.id != null && items.some((it) => it.id === itemData.id);
      if (exists) {
        // Update existing
        const newItems = items.map((it) =>
          it.id === itemData.id ? { ...itemData } : it
        );
        saveItemsAndNotify(newItems);
      } else {
        // Add new (ensure id)
        const toAdd = { ...itemData, id: itemData.id ?? Date.now() };
        saveItemsAndNotify([...items, toAdd]);
      }
    } catch (err) {
      console.error("Error saving item", err);
    }
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setEditingItem(null);
  };

  const handleToggleComplete = (itemId, isCompleted) => {
    const newItems = items.map((item) =>
      item.id === itemId ? { ...item, completed: isCompleted } : item
    );
    saveItemsAndNotify(newItems);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setDayFilter("all");
  };

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
                    .sort((a, b) => (a.time || "").localeCompare(b.time || ""))
                    .map((item) => (
                      <ItineraryItemsRow
                        key={item.id}
                        item={item}
                        onEdit={() => handleEditItem(item)}
                        onDelete={() => handleDeleteItem(item.id)}
                        onToggleComplete={(val) =>
                          handleToggleComplete(item.id, val)
                        }
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
