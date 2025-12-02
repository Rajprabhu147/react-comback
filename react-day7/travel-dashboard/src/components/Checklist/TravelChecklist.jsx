import React, { useState, useEffect } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import "../../styles/checklist.css";

/**
 * TravelChecklist Component
 * Displays a checklist for trip planning/pre-travel requirements
 */

// Default checklist items for trips (moved outside component so it's stable)
const defaultItems = [
  { id: 1, text: "Book flight tickets", completed: false },
  { id: 2, text: "Reserve accommodation", completed: false },
  { id: 3, text: "Check passport validity", completed: false },
  { id: 4, text: "Get travel insurance", completed: false },
  { id: 5, text: "Pack luggage", completed: false },
  { id: 6, text: "Arrange transportation", completed: false },
  { id: 7, text: "Inform family/friends", completed: false },
  { id: 8, text: "Check weather forecast", completed: false },
];

const TravelChecklist = () => {
  // initialize from localStorage safely (lazy initializer)
  const [checklist, setChecklist] = useState(() => {
    try {
      const stored = localStorage.getItem("travelChecklist");
      return stored ? JSON.parse(stored) : defaultItems;
    } catch (err) {
      // if parsing fails for any reason, fall back to defaults
      console.error("Failed to read travelChecklist from localStorage:", err);
      return defaultItems;
    }
  });

  const [inputValue, setInputValue] = useState("");

  // persist checklist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("travelChecklist", JSON.stringify(checklist));
    } catch (err) {
      console.error("Failed to save travelChecklist to localStorage:", err);
    }
  }, [checklist]);

  // helper to update state (and let effect persist)
  const saveChecklist = (updatedList) => {
    setChecklist(updatedList);
  };

  const handleAddItem = () => {
    if (inputValue.trim() === "") return;

    const newItem = {
      id: Date.now(),
      text: inputValue.trim(),
      completed: false,
    };

    const updatedList = [...checklist, newItem];
    saveChecklist(updatedList);
    setInputValue("");
  };

  const handleToggleItem = (id) => {
    const updatedList = checklist.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    saveChecklist(updatedList);
  };

  const handleDeleteItem = (id) => {
    const updatedList = checklist.filter((item) => item.id !== id);
    saveChecklist(updatedList);
  };

  const handleClearCompleted = () => {
    const updatedList = checklist.filter((item) => !item.completed);
    saveChecklist(updatedList);
  };

  const handleResetChecklist = () => {
    saveChecklist(defaultItems);
  };

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const completionPercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="travel-checklist">
      <div className="checklist-header">
        <h3 className="checklist-title">Pre-Trip Checklist</h3>
        <div className="checklist-progress" aria-hidden={false}>
          <div
            className="progress-bar"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={completionPercentage}
          >
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="progress-text">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Input Section */}
      <div className="checklist-input-section">
        <div className="input-group">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddItem();
              }
            }}
            placeholder="Add a checklist item..."
            className="checklist-input"
            aria-label="Add checklist item"
          />
          <button
            onClick={handleAddItem}
            className="add-btn"
            type="button"
            aria-label="Add item"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="checklist-items">
        {checklist.length > 0 ? (
          checklist.map((item) => (
            <div
              key={item.id}
              className={`checklist-item ${item.completed ? "completed" : ""}`}
            >
              <button
                onClick={() => handleToggleItem(item.id)}
                className="checkbox-btn"
                type="button"
                aria-pressed={item.completed}
                aria-label={
                  item.completed
                    ? `Mark "${item.text}" as incomplete`
                    : `Mark "${item.text}" as complete`
                }
              >
                {item.completed && <Check size={16} />}
              </button>
              <span className="item-text">{item.text}</span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="delete-btn"
                type="button"
                aria-label={`Delete "${item.text}"`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        ) : (
          <p className="empty-state">No checklist items yet</p>
        )}
      </div>

      {/* Action Buttons */}
      {checklist.length > 0 && (
        <div className="checklist-actions">
          {completedCount > 0 && (
            <button
              onClick={handleClearCompleted}
              className="action-btn clear"
              type="button"
            >
              Clear Completed
            </button>
          )}
          <button
            onClick={handleResetChecklist}
            className="action-btn reset"
            type="button"
          >
            Reset Checklist
          </button>
        </div>
      )}
    </div>
  );
};

export default TravelChecklist;
