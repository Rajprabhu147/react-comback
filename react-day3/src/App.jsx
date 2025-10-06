import { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask() {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  }
  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }
  function toggleDone(index) {
    const updated = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
  }

  return (
    <div className="container">
      <h1 className="heading">📝 Todo App</h1>
      <input
        type="text"
        placeholder="Enter a text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />
      <button onClick={addTask}>Add Task</button>
      <p>Current Input: {task} </p>
      <ul>
        {tasks.length === 0 ? (
          <p>No tasks yet. Add one above!</p>
        ) : (
          tasks.map((t, index) => (
            <li
              key={index}
              style={{
                textDecoration: t.completed ? "line-through" : "none",
                opacity: t.completed ? 0.6 : 1,
              }}
            >
              {t.text}
              <button onClick={() => toggleDone(index)}>✅</button>
              <button onClick={() => deleteTask(index)}>❌</button>
            </li>
          ))
        )}
      </ul>
      {tasks.length > 0 && (
        <button className="clear" onClick={() => setTasks([])}>
          Clear All
        </button>
      )}
    </div>
  );
}
export default App;
