// import section
import { useState } from "react"; // React Hook is used for the updating data inside the state or else app would not remenber it
import "./App.css";

function App() {
  // state initialization
  const [task, setTask] = useState(""); // to store what user types in the field
  const [tasks, setTasks] = useState([]); // to store all todo list items in an Array [each item has (text, completed status)]

  // Every Dynamic app uses some kind of state management for chat -> messages , cart -> items, todolist -> tasks
  // As we need an Array logic to store all values in order to perform tasks

  // addTask function - checks input, adds new task object to the existing array and resets the input field after adding
  function addTask() {
    if (task.trim() === "") return;
    setTasks([...tasks, { text: task, completed: false }]);
    setTask("");
  } // the pattern of validating input, updating list and resetting form are used in countless real world apps
  // like submitting comments on a post, adding new contact or product or updating cart order
  // sending or receiving chat messages

  // Removes a specific Task from an array
  function deleteTask(index) {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  } //  In real world you do delete items from cart, delete messages or remove files or users

  // Toggle task completed status - striked through as done

  function toggleDone(index) {
    const updated = tasks.map((t, i) =>
      i === index ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
  } // this how the app tracks all the state changes of the individual items
  // mark an email as read, mark a product as favorite or wishlist and toggle dark or light mode

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
    </div> // clear all button to wipe all of them- is called conditional rendering means shows or hides state
    // which makes UI very clean and readable eg - buy now will not be visible until items in cart
  );
} // So Totally the CRUD management - Create Read Update and Delete
export default App;
