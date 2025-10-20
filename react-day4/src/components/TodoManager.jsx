import React, { useState, useEffect, useRef } from "react";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";

const SAMPLE_KEY = "react_day4_todos_v1";

export default function TodoManager() {
  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(SAMPLE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAMPLE_KEY, JSON.stringify(todos));
    } catch (err) {
      // surfacing error message
      console.error("Failed writing to localStorage", err);
    }
  }, [todos]);

  // helper actions
  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text, completed: false };
    setTodos((prev) => [newTodo, ...prev]);
    // focus back on input
    inputRef.current?.focus();
  };

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllTodos = () => {
    setTodos([]);
  };

  const fetchDemoTodos = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        "https://jsonplaceholder.typicode.com/todos?_limit=5"
      );
      if (!res.ok) throw new Error(`Failed (${res.status})`);
      const data = await res.json();
      // transform to our shape and merge (avoid id collisions)
      const transformed = data.map((d) => ({
        id: Date.now() + Math.random(),
        text: d.title,
        completed: d.completed,
      }));
      setTodos((prev) => [...transformed, ...prev]);
    } catch (err) {
      setError(err.message || "Fetch error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      {/* <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <TodoForm onAdd={addTodo} inputRef={inputRef} />
        <button onClick={fetchDemoTodos} disabled={loading}>
          {loading ? "Loading…" : "Load demo tasks"}
        </button>
      </div> */}

      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <TodoForm onAdd={addTodo} inputRef={inputRef} />
        <button onClick={fetchDemoTodos} disabled={loading}>
          {loading ? "Loading…" : "Load demo tasks"}
        </button>
        <button
          onClick={() => {
            if (todos.length === 0) {
              alert("No tasks to delete!");
              return;
            }
            const confirmClear = window.confirm(
              "Are you sure you want to delete ALL tasks?"
            );
            if (confirmClear) {
              clearAllTodos();
            }
          }}
          style={{ background: "#f44336", color: "white" }}
        >
          Delete All
        </button>
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
    </section>
  );
}
