// src/pages/About.jsx
export default function About() {
  const features = [
    {
      icon: "📊",
      title: "Track Progress",
      description:
        "Monitor your skill development with intuitive progress bars and real-time updates",
    },
    {
      icon: "🎯",
      title: "Set Goals",
      description:
        "Define proficiency levels and work towards mastering your chosen skills",
    },
    {
      icon: "📈",
      title: "Visual Analytics",
      description:
        "Get insights into your learning journey with beautiful data visualizations",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description:
        "Your data is protected with enterprise-grade security powered by Supabase",
    },
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 200px)" }}>
      {/* Hero Section */}
      <div
        className="card"
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          padding: "3rem 2rem",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "1rem",
            background:
              "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
            borderRadius: "1rem",
            marginBottom: "1.5rem",
            boxShadow: "0 8px 20px rgba(37,99,235,0.3)",
          }}
        >
          <svg
            style={{ width: "4rem", height: "4rem", color: "white" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>

        <h1
          style={{
            fontSize: "2.25rem",
            fontWeight: "bold",
            background:
              "linear-gradient(90deg, var(--accent-start), var(--accent-end))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: "1rem",
          }}
        >
          Welcome to SkillSync
        </h1>

        <p
          style={{
            fontSize: "1.2rem",
            color: "var(--muted)",
            maxWidth: "600px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Your personal skill tracking companion. Monitor your progress, set
          goals, and master new abilities with confidence.
        </p>
      </div>

      {/* Features Grid */}
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "2rem",
            color: "var(--text)",
          }}
        >
          Why Choose SkillSync?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="card"
              style={{
                padding: "2rem",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 12px 24px rgba(2,6,23,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "var(--shadow-soft)";
              }}
            >
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
                {feature.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.3rem",
                  fontWeight: "bold",
                  marginBottom: "0.75rem",
                  color: "var(--text)",
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  color: "var(--muted)",
                  lineHeight: "1.6",
                  fontSize: "0.95rem",
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div
        className="card"
        style={{ padding: "3rem 2rem", marginBottom: "2rem" }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "2rem",
            color: "var(--text)",
          }}
        >
          How It Works
        </h2>

        <div
          style={{
            display: "grid",
            gap: "2rem",
            maxWidth: "700px",
            margin: "0 auto",
          }}
        >
          {[
            {
              step: "1",
              title: "Create Your Account",
              description:
                "Sign up in seconds with just your email and password",
            },
            {
              step: "2",
              title: "Add Your Skills",
              description:
                "List the skills you want to track and set proficiency levels",
            },
            {
              step: "3",
              title: "Track Your Progress",
              description: "Update your skill levels as you learn and improve",
            },
            {
              step: "4",
              title: "Achieve Your Goals",
              description: "Watch your progress grow and celebrate milestones",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                gap: "1.5rem",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{
                  flexShrink: 0,
                  width: "3rem",
                  height: "3rem",
                  background:
                    "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                }}
              >
                {item.step}
              </div>
              <div>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    marginBottom: "0.5rem",
                    color: "var(--text)",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    color: "var(--muted)",
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                  }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{
          background:
            "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
          borderRadius: "1rem",
          padding: "3rem 2rem",
          textAlign: "center",
          color: "white",
          boxShadow: "0 12px 32px rgba(37,99,235,0.3)",
          marginBottom: "2rem",
        }}
      >
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Ready to Start Your Journey?
        </h2>
        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "2rem",
            maxWidth: "600px",
            margin: "0 auto 2rem",
            opacity: 0.95,
            lineHeight: "1.6",
          }}
        >
          Join thousands of learners who are already tracking their progress and
          achieving their goals with SkillSync.
        </p>
        <a
          href="/auth"
          className="btn"
          style={{
            display: "inline-block",
            background: "white",
            color: "var(--accent-start)",
            padding: "1rem 2.5rem",
            borderRadius: "0.75rem",
            fontWeight: "bold",
            textDecoration: "none",
            boxShadow: "0 4px 16px rgba(255,255,255,0.3)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(255,255,255,0.4)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 4px 16px rgba(255,255,255,0.3)";
          }}
        >
          Get Started Free
        </a>
      </div>

      {/* Footer */}
      <div
        className="footer"
        style={{ textAlign: "center", padding: "2rem 0" }}
      >
        <p style={{ marginBottom: "0.5rem" }}>Built with ❤️ by KingLord Corp</p>
        <p>© 2025 SkillSync. All Rights Reserved.</p>
      </div>
    </div>
  );
}
