import React, { useState, useRef } from "react";

export default function TodoForm({ onAdd }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;
    onAdd(text);
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit} aria-label="Add a todo">
      <label
        htmlFor="todo-input"
        style={{ position: "absolute", left: "-9999px" }}
      >
        Add todo
      </label>
      <input
        id="todo-input"
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="What needs to be done?"
        autoComplete="off"
        type="text"
      />
      <button type="submit">Add</button>
      <button
        type="button"
        className="secondary"
        onClick={() => {
          setValue("");
          inputRef.current?.focus();
        }}
        aria-label="Clear input"
      >
        Clear
      </button>
    </form>
  );
}
