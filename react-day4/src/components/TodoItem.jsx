import React from "react";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        padding: "8px 0",
        borderBottom: "1px solid #eee",
      }}
    >
      <span
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") onToggle();
        }}
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          cursor: "pointer",
          flex: 1,
        }}
        aria-pressed={todo.completed}
      >
        {todo.text}
      </span>
      <button onClick={onDelete} aria-label={`Delete ${todo.text}`}>
        Delete
      </button>
    </li>
  );
}
