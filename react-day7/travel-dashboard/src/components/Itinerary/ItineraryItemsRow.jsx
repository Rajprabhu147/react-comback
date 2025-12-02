import React from "react";
import { Clock, MapPin, DollarSign, Users, Trash2, Edit2 } from "lucide-react";
import "../../styles/itinerary-row.css";

/**
 * ItineraryItemsRow Component
 * Displays a single itinerary activity with all details
 */

const CATEGORY_COLORS = {
  sightseeing: "#05668d",
  dining: "#ffd166",
  accommodation: "#02c39a",
  transport: "#ef4444",
  shopping: "#10b981",
  activity: "#8b5cf6",
};

const CATEGORY_ICONS = {
  sightseeing: "🏛️",
  dining: "🍽️",
  accommodation: "🏨",
  transport: "🚗",
  shopping: "🛍️",
  activity: "⚡",
};

const ItineraryItemsRow = ({ item, onEdit, onDelete }) => {
  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(item);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this activity?")) {
      onDelete(item.id);
    }
  };

  const categoryIcon = CATEGORY_ICONS[item.category] || "📍";
  const categoryColor = CATEGORY_COLORS[item.category] || "#05668d";

  return (
    <div className="itinerary-row" style={{ borderLeftColor: categoryColor }}>
      {/* Category Icon & Time */}
      <div className="row-left">
        <span className="category-icon">{categoryIcon}</span>
        <div className="time-badge">
          <Clock size={14} />
          <span>{item.time}</span>
        </div>
      </div>

      {/* Activity Details */}
      <div className="row-content">
        <h4 className="activity-title">{item.activity}</h4>

        <div className="activity-meta">
          {item.location && (
            <div className="meta-item">
              <MapPin size={14} />
              <span>{item.location}</span>
            </div>
          )}

          {item.budget && (
            <div className="meta-item">
              <DollarSign size={14} />
              <span>${item.budget}</span>
            </div>
          )}

          {item.travelers && (
            <div className="meta-item">
              <Users size={14} />
              <span>
                {item.travelers} traveler{item.travelers > 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>

        {item.notes && <p className="activity-notes">{item.notes}</p>}
      </div>

      {/* Actions */}
      <div className="row-actions">
        <button
          onClick={handleEdit}
          className="action-btn edit"
          title="Edit activity"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={handleDelete}
          className="action-btn delete"
          title="Delete activity"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ItineraryItemsRow;
