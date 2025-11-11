// src/components/SkillForm.jsx
import { useState } from "react";

export default function SkillForm({ onAdd, disabled }) {
  const [name, setName] = useState("");
  const [level, setLevel] = useState(50);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Convert percentage to text level for database
    const levelText = getLevelText(level);
    onAdd(name, levelText);

    setName("");
    setLevel(50);
  };

  const getLevelText = (value) => {
    if (value < 33) return "Beginner";
    if (value < 66) return "Intermediate";
    return "Advanced";
  };

  const getLevelLabel = (value) => {
    if (value < 25) return "Beginner";
    if (value < 50) return "Learning";
    if (value < 75) return "Intermediate";
    if (value < 90) return "Advanced";
    return "Expert";
  };

  return (
    <form onSubmit={handleSubmit} className="skill-form">
      {/* Skill Name - Full Width */}
      <div className="form-row full-width">
        <label className="form-label">Skill Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React, Node.js, Python, UI Design"
          className="form-input"
          disabled={disabled}
          required
        />
      </div>

      {/* Level Slider - Takes remaining space */}
      <div className="form-row" style={{ flex: "2 1 300px" }}>
        <label className="form-label">
          Proficiency Level: {level}% ({getLevelLabel(level)})
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            background: "white",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
          }}
        >
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            disabled={disabled}
            style={{
              flex: 1,
              height: "8px",
              borderRadius: "4px",
              background: `linear-gradient(to right, var(--accent-start) 0%, var(--accent-end) ${level}%, #e2e8f0 ${level}%, #e2e8f0 100%)`,
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              cursor: "pointer",
            }}
          />
          <div
            style={{
              minWidth: "50px",
              textAlign: "center",
              fontWeight: "bold",
              color: "var(--accent-start)",
              fontSize: "1.1rem",
            }}
          >
            {level}%
          </div>
        </div>

        {/* Visual indicator of what will be saved */}
        <div
          style={{
            marginTop: "0.5rem",
            padding: "0.5rem",
            background: "#f1f5f9",
            borderRadius: "6px",
            fontSize: "0.85rem",
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          Will be saved as: <strong>{getLevelText(level)}</strong>
        </div>
      </div>

      {/* Submit Button */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn"
          disabled={disabled || !name.trim()}
          style={{ minWidth: "140px" }}
        >
          {disabled ? "Adding..." : "Add Skill"}
        </button>
      </div>

      {/* Custom range slider styles */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(37,99,235,0.4);
          transition: transform 0.1s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(37,99,235,0.5);
        }
        
        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-start), var(--accent-end));
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(37,99,235,0.4);
          transition: transform 0.1s ease;
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(37,99,235,0.5);
        }
        
        input[type="range"]:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        input[type="range"]:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
        }
      `}</style>
    </form>
  );
}
