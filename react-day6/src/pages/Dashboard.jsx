// src/pages/Dashboard.jsx
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useSkills, useAddSkill, useDeleteSkill } from "../hooks/useSkills";
import SkillForm from "../components/SkillForm";
import SkillList from "../components/SkillList";

export default function Dashboard() {
  const { user, loading: userLoading } = useUser();
  const { data: skills = [], isLoading, isError, error } = useSkills();
  const addSkill = useAddSkill();
  const deleteSkill = useDeleteSkill();
  const [busyAdd, setBusyAdd] = useState(false);
  const [busyDeleteId, setBusyDeleteId] = useState(null);

  if (userLoading) {
    return (
      <div
        style={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              margin: "0 auto 1rem",
              border: "4px solid var(--accent-start)",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <p style={{ fontSize: "1.1rem", color: "var(--muted)" }}>
            Setting up your workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div
        style={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="card"
          style={{ textAlign: "center", padding: "3rem", maxWidth: "500px" }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 1.5rem",
              background:
                "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
            }}
          >
            🔒
          </div>
          <h3
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginBottom: "1rem",
            }}
          >
            Login Required
          </h3>
          <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
            Please login to access your skills dashboard and start tracking your
            progress.
          </p>
          <a href="/auth" className="btn">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const displayName =
    user?.user_metadata?.full_name || user?.email?.split?.("@")?.[0] || "User";

  const handleAdd = async (name, level) => {
    try {
      setBusyAdd(true);
      await addSkill.mutateAsync({ name, level });
    } catch (err) {
      console.error("Add skill failed:", err);
    } finally {
      setBusyAdd(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setBusyDeleteId(id);
      await deleteSkill.mutateAsync(id);
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setBusyDeleteId(null);
    }
  };

  // Calculate stats
  const totalSkills = skills.length;
  const avgLevel =
    totalSkills > 0
      ? Math.round(skills.reduce((sum, s) => sum + s.level, 0) / totalSkills)
      : 0;
  const expertSkills = skills.filter((s) => s.level >= 80).length;
  const learningSkills = skills.filter((s) => s.level < 50).length;

  return (
    <div>
      {/* Hero Header */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
          borderRadius: "1rem",
          padding: "3rem 2rem",
          marginBottom: "2rem",
          color: "white",
          boxShadow: "0 12px 32px rgba(37,99,235,0.3)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-80px",
            width: "250px",
            height: "250px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                background: "rgba(255,255,255,0.2)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2rem",
                backdropFilter: "blur(10px)",
              }}
            >
              👋
            </div>
            <div>
              <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0 }}>
                Welcome back, {displayName}!
              </h1>
              <p
                style={{
                  opacity: 0.9,
                  fontSize: "1.1rem",
                  margin: "0.5rem 0 0 0",
                }}
              >
                Ready to level up your skills today?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {[
          {
            icon: "📚",
            label: "Total Skills",
            value: totalSkills,
            color: "#2563eb",
          },
          {
            icon: "⭐",
            label: "Expert Level",
            value: expertSkills,
            color: "#7c3aed",
          },
          {
            icon: "📈",
            label: "Average Level",
            value: `${avgLevel}%`,
            color: "#059669",
          },
          {
            icon: "🎯",
            label: "Learning",
            value: learningSkills,
            color: "#ea580c",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="card"
            style={{
              padding: "1.5rem",
              textAlign: "center",
              background: "var(--card)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = stat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "rgba(2,6,23,0.03)";
            }}
          >
            <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>
              {stat.icon}
            </div>
            <div
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: stat.color,
                marginBottom: "0.25rem",
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: "0.875rem", color: "var(--muted)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Add Skill Section */}
      <section
        className="card"
        style={{ marginBottom: "2rem", padding: "2rem" }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background:
                  "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
              }}
            >
              ➕
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
              Add New Skill
            </h3>
          </div>
          <p style={{ color: "var(--muted)", marginLeft: "52px" }}>
            Track a new skill and set your current proficiency level
          </p>
        </div>

        <SkillForm onAdd={handleAdd} disabled={busyAdd} />

        {busyAdd && (
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              background: "#e0e7ff",
              borderRadius: "8px",
              color: "var(--accent-start)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid currentColor",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            Adding your skill...
          </div>
        )}
      </section>

      {/* Skills List Section */}
      <section>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                background:
                  "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.25rem",
              }}
            >
              🎯
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "bold", margin: 0 }}>
              Your Skills
            </h3>
          </div>
          <div
            style={{
              padding: "0.5rem 1rem",
              background:
                "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
              color: "white",
              borderRadius: "20px",
              fontWeight: "bold",
              fontSize: "0.875rem",
            }}
          >
            {totalSkills} {totalSkills === 1 ? "Skill" : "Skills"}
          </div>
        </div>

        {isLoading ? (
          <div
            className="card"
            style={{ padding: "4rem 2rem", textAlign: "center" }}
          >
            <div
              style={{
                width: "60px",
                height: "60px",
                margin: "0 auto 1.5rem",
                border: "4px solid var(--accent-start)",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ fontSize: "1.1rem", color: "var(--muted)" }}>
              Loading your skills...
            </p>
          </div>
        ) : isError ? (
          <div
            className="card"
            style={{
              padding: "2rem",
              background: "#fee2e2",
              border: "1px solid #fecaca",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontSize: "2rem" }}>⚠️</div>
              <div>
                <h4
                  style={{
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    color: "#dc2626",
                  }}
                >
                  Error Loading Skills
                </h4>
                <p style={{ color: "#991b1b", margin: 0 }}>
                  {error?.message || "Unknown error occurred"}
                </p>
              </div>
            </div>
          </div>
        ) : skills.length === 0 ? (
          <div
            className="card"
            style={{
              padding: "4rem 2rem",
              textAlign: "center",
              background: "linear-gradient(to bottom, white, #f8fafc)",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                margin: "0 auto 1.5rem",
                background:
                  "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                opacity: 0.9,
              }}
            >
              📝
            </div>
            <h4
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1rem",
              }}
            >
              No Skills Yet
            </h4>
            <p
              style={{
                color: "var(--muted)",
                marginBottom: "1.5rem",
                fontSize: "1.1rem",
              }}
            >
              Start your journey by adding your first skill above!
            </p>
            <div
              style={{
                display: "inline-block",
                padding: "0.5rem 1rem",
                background: "#e0e7ff",
                borderRadius: "8px",
                color: "var(--accent-start)",
                fontSize: "0.875rem",
              }}
            >
              💡 Tip: Be specific with skill names for better tracking
            </div>
          </div>
        ) : (
          <SkillList
            skills={skills}
            onDelete={(id) => handleDelete(id)}
            deletingId={busyDeleteId}
          />
        )}
      </section>

      {/* Add spinning animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
