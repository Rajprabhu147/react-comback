import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

const TodosContext = createContext();

export function TodosProvider({ children }) {
  const STORAGE_KEY = "react_day4_todos_v1";

  const [todos, setTodos] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const inputRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (err) {
      console.error("Failed writing to localStorage", err);
    }
  }, [todos]);

  const addTodo = (text) => {
    if (!text || !text.trim()) return;
    const newTodo = { id: Date.now(), text: text.trim(), completed: false };
    setTodos((prev) => [newTodo, ...prev]);
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

  const clearAll = () => setTodos([]);

  const value = {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearAll,
    inputRef,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
}

export function useTodos() {
  const ctx = useContext(TodosContext);
  if (!ctx) throw new Error("useTodos must be used within TodosProvider");
  return ctx;
}
