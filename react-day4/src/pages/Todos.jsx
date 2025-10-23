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
    count,
    completedCount,
  } = useTodos();

  return (
    <section className="todo-root" aria-labelled="todos-heading">
      <h2 id="todos-heading">Todos</h2>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div>
          <span className="counter" aria-live="polite">
            {completedCount} / {count} completed
          </span>
        </div>
        <div>
          <button
            type="button"
            className="secondary"
            onClick={clearCompleted}
            aria-label="Clear completed todos"
          >
            Clear completed
          </button>
        </div>
      </div>

      <TodoForm onAdd={addTodo} />

      <TodoList todos={todos} onToggle={toggleTodo} onDelete={removeTodo} />
    </section>
  );
}
