import { useState } from "react";
import Welcome from "./components/Welcome";
import UserList from "./components/UserList";
// import UserCard from "./components/UserCard";
import Counter from "./components/Counter";
import "./App.css";
console.log("App rendering...");

function App() {
  const [users] = useState([
    {
      name: "Raj",
      age: 34,
      bio: "FrontEnd Developer",
      exp: "10 Years",
    },
    {
      name: "Ram",
      age: 29,
      bio: "Backend Developer",
      exp: "5 Years",
    },
    {
      name: "Rakesh",
      age: 42,
      bio: "Senior Developer",
      exp: "15 Years",
    },
    {
      name: "Ranveer",
      age: 26,
      bio: "UI Developer",
      exp: "3 Years",
    },
  ]);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="app-container">
      <h1 className="app-title">Day 2: React Fundamental</h1>
      <Welcome name="Raj" />
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <UserList users={filteredUsers} />
      <Counter max={50} />
    </div>
  );
}
export default App;
