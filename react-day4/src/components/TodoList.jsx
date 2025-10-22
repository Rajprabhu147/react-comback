import React from "react";
import { useTodos } from "../context/TodosContext";
import TodoItem from "./TodoItem";

export default function TodoList() {
  const { todos, toggleTodo, deleteTodo } = useTodos();

  if (!todos || todos.length === 0) {
    return <p style={{ marginTop: 12 }}>No tasks yet. Add one above.</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </ul>
  );
}
