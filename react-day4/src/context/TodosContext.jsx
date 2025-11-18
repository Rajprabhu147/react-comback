import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";

const STORAGE_KEY = "todos_app_v1";
const TodosContext = createContext(null);

function safeRead(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function safeWrite(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function makeTodo(text) {
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  return { id, text: text.trim(), completed: false, createdAt: Date.now() };
}

export function TodosProvider({ children }) {
  const [todos, setTodos] = useState(() => safeRead(STORAGE_KEY));

  // persist to localStorage
  useEffect(() => {
    safeWrite(STORAGE_KEY, todos);
  }, [todos]);

  const addTodo = useCallback((text) => {
    if (!text.trim()) return;
    setTodos((prev) => [...prev, makeTodo(text)]);
  }, []);

  const toggleTodo = useCallback(
    (id) =>
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      ),
    []
  );

  const removeTodo = useCallback(
    (id) => setTodos((prev) => prev.filter((t) => t.id !== id)),
    []
  );

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  // 🧨 NEW — clear all todos
  const clearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to delete all todos?")) {
      setTodos([]);
    }
  }, []);

  const value = useMemo(
    () => ({
      todos,
      addTodo,
      toggleTodo,
      removeTodo,
      clearCompleted,
      clearAll,
      counts: {
        total: todos.length,
        completed: todos.filter((t) => t.completed).length,
      },
    }),
    [todos, addTodo, toggleTodo, removeTodo, clearCompleted, clearAll]
  );

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error("useTodos must be used inside TodosProvider");
  return ctx;
}
