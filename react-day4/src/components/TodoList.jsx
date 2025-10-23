import React from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="empty" role="status">
        No todos yet — add one above.
      </div>
    );
  }

  return (
    <ul className="todo-list" role="list" aria-label="Todo items">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
