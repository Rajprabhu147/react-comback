import React from "react";
import { useTodos } from "../context/TodosContext";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

export default function TodoManager() {
  const { todos, clearAll } = useTodos();

  return (
    <section>
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1 }}>
          <TodoForm />
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => {
              if (todos.length === 0) {
                alert("No tasks to delete!");
                return;
              }
              const confirmClear = window.confirm(
                "Are you sure you want to delete ALL tasks?"
              );
              if (confirmClear) clearAll();
            }}
            style={{
              background: "#f44336",
              color: "#fff",
              border: "none",
              padding: "8px 12px",
              borderRadius: 6,
            }}
          >
            Delete All
          </button>
        </div>
      </div>

      <TodoList />
    </section>
  );
}
