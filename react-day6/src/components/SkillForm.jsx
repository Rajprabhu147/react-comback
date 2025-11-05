import { useState } from "react";

export default function SkillForm({ onAdd }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, level);
    setName("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Skill name"
      />
      <select value={level} onChange={(e) => setLevel(e.target.value)}>
        <option>Beginner</option>
        <option>Intermediate</option>
        <option>Advanced</option>
      </select>
      <button type="submit">Add Skill</button>
    </form>
  );
}
