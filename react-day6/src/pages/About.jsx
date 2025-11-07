export default function About() {
  return (
    <div className="about">
      <h2>About SkillSync</h2>

      <div>
        <p>
          <strong>SkillSync</strong> is a developer-focused tracker built with
          React, Supabase, and React Query.
        </p>
        <p>
          It helps you log your skills, track growth levels, and plan learning
          goals — all synced in real time with a live backend.
        </p>
        <p>
          Built as part of my 10-Day React Comeback Journey — demonstrating
          full-stack development from frontend to backend integration.
        </p>

        <ul>
          <li>⚛️ Frontend: React 18 + Vite</li>
          <li>📦 Backend: Supabase (PostgreSQL + Auth)</li>
          <li>⚙️ State Management: React Query + Context</li>
          <li>🧠 Deployed on: Netlify + Supabase Cloud</li>
        </ul>

        <p>
          <em>“Track your skills. Sync your growth.”</em>
        </p>
      </div>

      <aside className="meta" aria-label="SkillSync highlights">
        <div className="row">
          <div className="label">Project</div>
          <div className="value">10-Day React Comeback</div>
        </div>
        <div className="row">
          <div className="label">Sync</div>
          <div className="value">Realtime (Supabase)</div>
        </div>
        <div className="row">
          <div className="label">Focus</div>
          <div className="value">Developer workflows</div>
        </div>
      </aside>
    </div>
  );
}
