import React from "react";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 8,
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span
        onClick={() => onToggle(todo.id)}
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          cursor: "pointer",
          flex: 1,
        }}
      >
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete ${todo.text}`}
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          color: "#333",
        }}
      >
        ❌
      </button>
    </li>
  );
}
