// src/components/TripPlanner/ActivityListItem.jsx

import React from "react";
import { Edit2, Trash2, Clock, MapPin, DollarSign, Users } from "lucide-react";
import { getCategoryIcon, getCategoryColor } from "./constants";

const ActivityListItem = ({ activity, onEdit, onDelete, onToggleComplete }) => {
  return (
    <div
      className={`activity-list-item ${activity.completed ? "completed" : ""}`}
      style={{
        borderLeftColor: getCategoryColor(activity.category),
      }}
    >
      <input
        type="checkbox"
        checked={activity.completed}
        onChange={() => onToggleComplete(activity.id)}
        className="activity-checkbox"
      />
      <div className="activity-item-content">
        <div className="activity-header">
          <span className="activity-icon">
            {getCategoryIcon(activity.category)}
          </span>
          <span className="activity-name">{activity.activity}</span>
          <span className="day-badge">Day {activity.day}</span>
        </div>
        <div className="activity-details">
          <div className="detail-item">
            <Clock size={14} /> {activity.time}
          </div>
          {activity.location && (
            <div className="detail-item">
              <MapPin size={14} /> {activity.location}
            </div>
          )}
          {activity.budget && (
            <div className="detail-item">
              <DollarSign size={14} /> ${activity.budget}
            </div>
          )}
          {activity.travelers && (
            <div className="detail-item">
              <Users size={14} /> {activity.travelers}
            </div>
          )}
        </div>
      </div>
      <div className="activity-actions">
        <button
          onClick={() => onEdit(activity)}
          className="action-btn edit-btn"
          title="Edit"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(activity.id)}
          className="action-btn delete-btn"
          title="Delete"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default ActivityListItem;
