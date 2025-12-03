import React, { useState } from "react";
import {
  Clock,
  MapPin,
  DollarSign,
  Users,
  Trash2,
  Edit2,
  Check,
  GripVertical,
} from "lucide-react";
import "../../styles/kanban-card.css";

/**
 * KanbanItineraryCard Component
 * Displays activity as a card in Kanban board
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

const KanbanItineraryCard = ({ item, onEdit, onDelete, onToggleComplete }) => {
  const [isChecked, setIsChecked] = useState(item.completed || false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    const newState = !isChecked;
    setIsChecked(newState);
    if (onToggleComplete) {
      onToggleComplete(item.id, newState);
    }
  };

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
    <div
      className={`kanban-card ${isChecked ? "completed" : ""}`}
      style={{ "--category-color": categoryColor }}
    >
      {/* Card Header with Icon */}
      <div className="card-header">
        <div className="card-icon">{categoryIcon}</div>
        <div className="card-checkbox">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleCheckboxChange}
            className="card-checkbox-input"
            id={`card-${item.id}`}
          />
          <label htmlFor={`card-${item.id}`} className="card-checkbox-label">
            <Check size={12} />
          </label>
        </div>
      </div>

      {/* Card Body */}
      <div className="card-body">
        {/* Time */}
        <div className="card-time">
          <Clock size={12} />
          <span>{item.time}</span>
        </div>

        {/* Activity Title */}
        <h3 className="card-title">{item.activity}</h3>

        {/* Location */}
        {item.location && (
          <div className="card-location">
            <MapPin size={12} />
            <span>{item.location}</span>
          </div>
        )}

        {/* Meta Info */}
        {(item.budget || item.travelers) && (
          <div className="card-meta">
            {item.budget && (
              <span className="meta-badge budget">
                <DollarSign size={10} />${item.budget}
              </span>
            )}
            {item.travelers && (
              <span className="meta-badge travelers">
                <Users size={10} />
                {item.travelers}
              </span>
            )}
          </div>
        )}

        {/* Checklist Preview */}
        {item.notes && (
          <div className={`card-checklist ${isExpanded ? "expanded" : ""}`}>
            {item.notes.split("\n").map((line, idx) => (
              <div key={idx} className="checklist-item-small">
                <input
                  type="checkbox"
                  id={`note-${item.id}-${idx}`}
                  className="checklist-checkbox-small"
                />
                <label htmlFor={`note-${item.id}-${idx}`}>{line}</label>
              </div>
            ))}
          </div>
        )}

        {/* Notes Preview */}
        {item.notes && !isExpanded && (
          <button
            className="expand-btn"
            onClick={() => setIsExpanded(true)}
            title="Show checklist"
          >
            {item.notes.split("\n").length} items
          </button>
        )}

        {isExpanded && (
          <button
            className="expand-btn collapse"
            onClick={() => setIsExpanded(false)}
            title="Hide checklist"
          >
            Hide
          </button>
        )}
      </div>

      {/* Card Footer with Actions */}
      <div className="card-footer">
        <button
          onClick={handleEdit}
          className="card-action-btn edit"
          title="Edit activity"
        >
          <Edit2 size={14} />
        </button>
        <button
          onClick={handleDelete}
          className="card-action-btn delete"
          title="Delete activity"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default KanbanItineraryCard;
