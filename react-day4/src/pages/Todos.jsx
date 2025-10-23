import React from "react";
import { useTodos } from "../context/TodosContext";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Todos() {
  const {
    todos,
    addTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    clearAll,
    counts,
  } = useTodos();

  return (
    <section className="todo-root" aria-labelledby="todos-heading">
      <h2 id="todos-heading">Todos</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div className="counter" aria-live="polite">
          {counts.completed} / {counts.total} completed
        </div>

        <div className="controls" style={{ display: "flex", gap: 8 }}>
          <button type="button" className="secondary" onClick={clearCompleted}>
            Clear Completed
          </button>
          <button
            type="button"
            className="secondary"
            style={{ backgroundColor: "#dc2626", color: "#fff" }}
            onClick={clearAll}
          >
            Delete All
          </button>
        </div>
      </div>

      <TodoForm onAdd={addTodo} />

      <TodoList todos={todos} onToggle={toggleTodo} onDelete={removeTodo} />
    </section>
  );
}
