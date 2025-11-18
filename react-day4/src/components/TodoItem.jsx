import React from "react";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item" role="listitem">
      <input
        id={`chk-${todo.id}`}
        type="checkbox"
        checked={!!todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={
          todo.completed
            ? `Mark ${todo.text} as incomplete`
            : `Mark ${todo.text} as complete`
        }
      />
      <div className={`text ${todo.completed ? "completed" : ""}`}>
        <label htmlFor={`chk-${todo.id}`} style={{ cursor: "pointer" }}>
          {todo.text}
        </label>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          type="button"
          onClick={() => onDelete(todo.id)}
          aria-label={`Delete ${todo.text}`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
