// src/components/TripPlanner/ActivityEditor.jsx

import React from "react";
import ActivityForm from "./ActivityForm";

const ActivityEditor = ({ activity, selectedDay, onSave, onClose }) => {
  return (
    <div className="editor-overlay">
      <div className="editor-modal">
        <div className="editor-header">
          <h2 className="editor-title">
            {activity ? "Edit Activity" : "Add Activity"}
          </h2>
          <button onClick={onClose} className="editor-close-btn">
            ✕
          </button>
        </div>

        <ActivityForm
          activity={activity}
          selectedDay={selectedDay}
          onSubmit={onSave}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default ActivityEditor;
