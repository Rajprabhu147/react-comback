// ------------------------------
// Import Section
// ------------------------------
import { useState, useEffect } from "react";
import Header from "./components/Header";
import TeamList from "./components/TeamList";
import Footer from "./components/Footer";
import "./App.css";

// ------------------------------
// Main Component
// ------------------------------
function App() {
  // ------------------------------
  // State Initialization
  // ------------------------------
  const [team, setTeam] = useState([
    { id: 1, name: "Raj Prabhu", role: "Frontend Developer", available: true },
    { id: 2, name: "Sana", role: "UI Designer", available: false },
    { id: 3, name: "Vikram", role: "Backend Developer", available: true },
  ]);
  const [task, setTask] = useState(""); // Tracks user input
  const [tasks, setTasks] = useState([]); // Stores all todo items [{ text, completed }]

  // Every dynamic app uses some kind of state management:
  // chat → messages, cart → items, todo → tasks
  // Arrays help us store multiple values for managing tasks efficiently.

  // ------------------------------
  // ✅ Load tasks from localStorage (once, on first render)
  // ------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem("tasks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error);
    }
  }, []);

  // ------------------------------
  // ✅ Save tasks to localStorage whenever they change
  // ------------------------------
  useEffect(() => {
    try {
      // Only save if there’s at least one task or a cleared list
      localStorage.setItem("tasks", JSON.stringify(tasks));
      console.log("🟢 Saved tasks:", tasks);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
    }
  }, [tasks]); // ------------------------------
  // Add Task
  // ------------------------------
  function addTask() {
    if (task.trim() === "") return; // Ignore empty input
    setTasks([...tasks, { text: task, completed: false }]); // Add new task
    setTask(""); // Clear input
  }

  // Pattern used in real-world apps:
  // - Submitting comments
  // - Adding contacts/products
  // - Sending messages or posts

  // ------------------------------
  // Delete Task
  // ------------------------------
  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  }

  // Used in real-world for:
  // - Deleting messages, files, cart items, or users

  // ------------------------------
  // Toggle Completion
  // ------------------------------
  function toggleDone(index) {
    const updated = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
  }

  // Similar to:
  // - Mark email as read/unread
  // - Favorite/unfavorite a product
  // - Toggle dark/light mode

  // ------------------------------
  // Clear All Tasks
  // ------------------------------
  function clearAll() {
    if (window.confirm("Are you sure you want to clear all tasks?")) {
      setTasks([]);
    }
  }

  const toggleAvailability = (id) => {
    setTeam(
      team.map((member) =>
        member.id === id ? { ...member, available: !member.available } : member
      )
    );
  };

  // ------------------------------
  // JSX Return Block
  // ------------------------------
  return (
    <div className="container">
      <h1 className="heading">📝 Todo App</h1>

      {/* Input Field */}
      <input
        type="text"
        placeholder="Enter a task"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
      />

      {/* Add Task Button */}
      <button onClick={addTask}>Add Task</button>

      {/* Display Current Input */}
      <p>Current Input: {task || "—"} </p>

      {/* Task List */}
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
      <div style={{ fontFamily: "sans-serif", padding: "20px" }}>
        <Header />
        <TeamList team={team} onToggle={toggleAvailability} />
        <Footer />
      </div>

      {/* Conditional Clear All Button */}
      {tasks.length > 0 && (
        <button className="clear" onClick={clearAll}>
          Clear All
        </button>
      )}
    </div>
  );
}

// ------------------------------
// Export Component
// ------------------------------
export default App;

// ------------------------------
// Notes:
// - "Clear All" is an example of Conditional Rendering.
//   It only shows when tasks exist — just like "Buy Now"
//   appears only when items are in your cart.
// - Together this app demonstrates full CRUD:
//   Create (add), Read (display), Update (toggle), Delete (remove).
// ------------------------------
