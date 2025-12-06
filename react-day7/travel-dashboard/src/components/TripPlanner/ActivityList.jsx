// src/components/TripPlanner/ActivityList.jsx

import React from "react";
import ActivityListItem from "./ActivityListItem";

const ActivityList = ({ activities, onEdit, onDelete, onToggleComplete }) => {
  if (activities.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p className="empty-text">No activities planned yet</p>
      </div>
    );
  }

  return (
    <div className="activities-list">
      {activities.map((activity) => (
        <ActivityListItem
          key={activity.id}
          activity={activity}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleComplete={onToggleComplete}
        />
      ))}
    </div>
  );
};

export default ActivityList;
