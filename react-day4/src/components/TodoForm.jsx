import React, { useState } from "react";
import { useTodos } from "../context/TodosContext";

export default function TodoForm() {
  const { addTodo, inputRef } = useTodos();
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") {
      setError("Task cannot be empty!");
      return;
    }
    addTodo(text);
    setText("");
    setError("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, alignItems: "center" }}
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        style={{ flex: 1 }}
      />
      <button type="submit">Add</button>
      {error && <div style={{ color: "red", marginTop: 6 }}>{error}</div>}
    </form>
  );
}
