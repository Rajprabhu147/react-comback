import React from "react";
import PropTypes from "prop-types";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete }) {
  if (!todos || todos.length === 0) {
    return (
      <div className="empty" role="status">
        No todos yet. Add your first task above.
      </div>
    );
  }

  return (
    <ul className="todo-list" role="list" aria-label="Todo list">
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(PropTypes.object).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
