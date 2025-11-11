// src/components/SkillList.jsx
export default function SkillList({ skills, onDelete, deletingId }) {
  // Convert text level to percentage for display
  const getPercentageFromText = (levelText) => {
    const text = String(levelText).toLowerCase();
    if (text.includes("beginner")) return 25;
    if (text.includes("intermediate")) return 60;
    if (text.includes("advanced")) return 85;
    // If it's already a number, use it
    return isNaN(Number(levelText)) ? 50 : Number(levelText);
  };

  const getLevelInfo = (levelText) => {
    const percentage = getPercentageFromText(levelText);

    if (percentage < 33)
      return {
        text: "Beginner",
        color: "#ef4444",
        emoji: "🌱",
        percentage: 25,
      };
    if (percentage < 66)
      return {
        text: "Intermediate",
        color: "#3b82f6",
        emoji: "⚡",
        percentage: 60,
      };
    return {
      text: "Advanced",
      color: "#059669",
      emoji: "⭐",
      percentage: 85,
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Recently added";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  return (
    <ul className="skill-grid">
      {skills.map((skill) => {
        const levelInfo = getLevelInfo(skill.level);
        const isDeleting = deletingId === skill.id;

        return (
          <li
            key={skill.id}
            className="skill-card"
            style={{
              position: "relative",
              opacity: isDeleting ? 0.5 : 1,
              pointerEvents: isDeleting ? "none" : "auto",
              transition: "all 0.3s ease",
            }}
          >
            {/* Header with skill name and delete button */}
            <div className="skill-top">
              <div style={{ flex: 1 }}>
                <h4
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: "bold",
                    color: "var(--text)",
                    marginBottom: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    wordBreak: "break-word",
                  }}
                >
                  {skill.name}
                  <span style={{ fontSize: "1rem" }}>{levelInfo.emoji}</span>
                </h4>
              </div>

              <button
                onClick={() => onDelete(skill.id)}
                disabled={isDeleting}
                className="delete-btn"
                title="Delete skill"
                aria-label={`Delete ${skill.name}`}
                style={{
                  fontSize: "1.25rem",
                  padding: "0.5rem",
                  lineHeight: 1,
                  opacity: isDeleting ? 0.5 : 1,
                }}
              >
                🗑️
              </button>
            </div>

            {/* Level badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.375rem 0.75rem",
                background: `${levelInfo.color}15`,
                color: levelInfo.color,
                borderRadius: "20px",
                fontSize: "0.875rem",
                fontWeight: "600",
                border: `1.5px solid ${levelInfo.color}40`,
              }}
            >
              <span>{levelInfo.text}</span>
            </div>

            {/* Progress bar */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--muted)",
                    fontWeight: "500",
                  }}
                >
                  Progress
                </span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                    color: levelInfo.color,
                  }}
                >
                  {levelInfo.text}
                </span>
              </div>

              <div className="progress" style={{ height: "12px" }}>
                <i
                  style={{
                    width: `${levelInfo.percentage}%`,
                    background: `linear-gradient(90deg, ${levelInfo.color}, ${levelInfo.color}dd)`,
                    boxShadow: `0 0 8px ${levelInfo.color}40`,
                  }}
                />
              </div>
            </div>

            {/* Meta information */}
            <div
              className="skill-meta"
              style={{
                marginTop: "0.75rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid #e2e8f0",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.375rem",
                  fontSize: "0.8rem",
                }}
              >
                <span>📅</span>
                {formatDate(skill.created_at)}
              </span>

              {levelInfo.percentage >= 85 && (
                <span
                  style={{
                    padding: "0.25rem 0.5rem",
                    background:
                      "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
                    color: "white",
                    borderRadius: "12px",
                    fontSize: "0.7rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Pro
                </span>
              )}
            </div>

            {/* Deleting overlay */}
            {isDeleting && (
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "32px",
                    height: "32px",
                    border: "3px solid var(--accent-start)",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--muted)",
                    fontWeight: "600",
                  }}
                >
                  Deleting...
                </span>
              </div>
            )}
          </li>
        );
      })}

      {/* Spinning animation for delete loader */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </ul>
  );
}
