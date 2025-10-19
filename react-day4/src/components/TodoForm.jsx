import React, { useState } from "react";

export default function TodoForm({ onAdd, inputRef }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter a task.");
      return;
    }
    onAdd(trimmed);
    setValue("");
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: 8 }}>
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Write a task..."
        aria-label="Task"
      />
      <button type="submit">Add</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
}
