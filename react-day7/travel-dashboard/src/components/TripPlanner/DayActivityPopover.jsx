// src/components/TripPlanner/DayActivityPopover.jsx

import React from "react";
import { Clock, MapPin } from "lucide-react";
import { getCategoryIcon } from "./constants";

const DayActivityPopover = ({ day, activities, onEditActivity }) => {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="activity-popover">
      <div className="popover-header-section">
        {activities.length} Activity
        {activities.length !== 1 ? "ies" : ""} on Day {day}
      </div>
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="popover-activity-item"
          onClick={(e) => {
            e.stopPropagation();
            onEditActivity(activity);
          }}
          style={{ cursor: "pointer" }}
        >
          <div className="popover-activity-header">
            <span className="popover-icon">
              {getCategoryIcon(activity.category)}
            </span>
            <span className="popover-title">{activity.activity}</span>
            <span className="popover-time">
              <Clock size={12} /> {activity.time}
            </span>
          </div>
          {activity.location && (
            <div className="popover-location">
              <MapPin size={12} /> {activity.location}
            </div>
          )}
          {(activity.budget || activity.travelers) && (
            <div className="popover-meta">
              {activity.budget && <span>${activity.budget}</span>}
              {activity.travelers && (
                <span>
                  {activity.travelers} traveler
                  {activity.travelers > 1 ? "s" : ""}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DayActivityPopover;
