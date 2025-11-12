// src/components/SkillForm.jsx
import { useState } from "react";

export default function SkillForm({ onAdd, disabled }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState("Intermediate");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd(name, level);

    setName("");
    setLevel("Intermediate");
  };

  const levelOptions = [
    {
      value: "Beginner",
      label: "🌱 Beginner",
      color: "#ef4444",
      description: "Just starting out (25%)",
    },
    {
      value: "Intermediate",
      label: "⚡ Intermediate",
      color: "#3b82f6",
      description: "Building confidence (50%)",
    },
    {
      value: "Advanced",
      label: "🚀 Advanced",
      color: "#8b5cf6",
      description: "Proficient and capable (75%)",
    },
    {
      value: "Expert",
      label: "⭐ Expert",
      color: "#059669",
      description: "Mastered the skill (95%)",
    },
  ];

  const currentLevel =
    levelOptions.find((opt) => opt.value === level) || levelOptions[1];

  return (
    <form onSubmit={handleSubmit} className="skill-form">
      {/* Skill Name */}
      <div className="form-row" style={{ flex: "2 1 300px" }}>
        <label className="form-label">Skill Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React, Node.js, Python, UI Design"
          className="form-input"
          disabled={disabled}
          required
          style={{
            fontSize: "0.95rem",
            fontWeight: "500",
          }}
        />
      </div>

      {/* Level Dropdown */}
      <div className="form-row" style={{ flex: "1 1 240px" }}>
        <label className="form-label">Proficiency Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="form-select"
          disabled={disabled}
          style={{
            fontSize: "0.95rem",
            fontWeight: "500",
            cursor: "pointer",
            paddingRight: "2.5rem",
            backgroundImage: `linear-gradient(45deg, transparent 50%, ${currentLevel.color} 50%), linear-gradient(135deg, ${currentLevel.color} 50%, transparent 50%)`,
            backgroundPosition:
              "calc(100% - 20px) calc(1em + 2px), calc(100% - 15px) calc(1em + 2px)",
            backgroundSize: "5px 5px, 5px 5px",
            backgroundRepeat: "no-repeat",
          }}
        >
          {levelOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Level description */}
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem 0.75rem",
            background: `${currentLevel.color}10`,
            borderRadius: "6px",
            fontSize: "0.8rem",
            color: currentLevel.color,
            fontWeight: "500",
            border: `1px solid ${currentLevel.color}30`,
          }}
        >
          {currentLevel.description}
        </div>
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn"
          disabled={disabled || !name.trim()}
          style={{
            minWidth: "140px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
          }}
        >
          {disabled ? (
            <>
              <span
                style={{
                  width: "14px",
                  height: "14px",
                  border: "2px solid white",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  animation: "spin 0.6s linear infinite",
                }}
              />
              Adding...
            </>
          ) : (
            <>
              <span>➕</span>
              Add Skill
            </>
          )}
        </button>
      </div>

      {/* Spinning animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </form>
  );
}
