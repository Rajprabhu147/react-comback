/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

const STORAGE_KEY = "react_day_todos_v1";
const TodosContext = createContext(null);

function safeReadLocalStorage(key) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return null;
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to read localStorage", e);
    return null;
  }
}

function safeWriteLocalStorage(key, value) {
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Failed to write localStorage", e);
  }
}

function makeTodo(text) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return { id, text: text.trim(), completed: false, createdAt: Date.now() };
}

export function TodosProvider({ children }) {
  const [todos, setTodos] = useState(() => {
    const saved = safeReadLocalStorage(STORAGE_KEY);
    return Array.isArray(saved) ? saved : [];
  });

  // persist
  useEffect(() => {
    safeWriteLocalStorage(STORAGE_KEY, todos);
  }, [todos]);

  const addTodo = useCallback((text) => {
    if (!text || !text.trim()) return;
    setTodos((prev) => [...prev, makeTodo(text)]);
  }, []);

  const removeTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const value = useMemo(
    () => ({
      todos,
      addTodo,
      removeTodo,
      toggleTodo,
      clearCompleted,
      count: todos.length,
      completedCount: todos.filter((t) => t.completed).length,
    }),
    [todos, addTodo, removeTodo, toggleTodo, clearCompleted]
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error("useTodos must be used within TodosProvider");
  return ctx;
}
