import { useState } from "react";

export default function SkillForm({ onAdd }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Beginner");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name, level);
    setName("");
    setLevel("Beginner");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
    >
      {/* Skill name input */}
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Skill Name
        </label>
        <br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React, Node.js, UI Design"
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder:text-slate-400"
        />
      </div>

      {/* Level select */}
      <div className="flex-1 w-full sm:w-auto">
        <label className="block text-sm font-medium text-slate-600 mb-1">
          Skill Level
        </label>
        <br />
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full sm:w-[180px] px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer bg-white"
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="mt-2 sm:mt-6 sm:ml-2 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:opacity-90 active:scale-95 transition-all"
      >
        Add Skill
      </button>
    </form>
  );
}
