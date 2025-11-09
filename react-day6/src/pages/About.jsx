// src/pages/About.jsx
import React from "react";

export default function About() {
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-8 mt-10 space-y-6">
      {/* Header */}
      <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
        About <span className="text-violet-600">SkillSync</span>
      </h2>

      {/* Intro */}
      <div className="space-y-4 text-slate-700 leading-relaxed">
        <p>
          <strong className="text-indigo-600">SkillSync</strong> is a
          developer-focused tracker built with{" "}
          <span className="font-semibold">React</span>,{" "}
          <span className="font-semibold">Supabase</span>, and{" "}
          <span className="font-semibold">React Query</span>.
        </p>

        <p>
          It helps you <strong>log your skills</strong>, track growth levels,
          and plan learning goals — all synced in real time with a live backend.
        </p>

        <p>
          Built as part of the{" "}
          <span className="font-semibold text-violet-600">
            10-Day React Comeback Journey
          </span>{" "}
          — demonstrating full-stack development from frontend to backend
          integration.
        </p>
      </div>

      {/* Tech Stack */}
      <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
        <h3 className="text-lg font-semibold text-indigo-700 mb-3">
          🔧 Tech Stack
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-slate-700 list-disc list-inside">
          <li>⚛️ Frontend: React 18 + Vite</li>
          <li>📦 Backend: Supabase (PostgreSQL + Auth)</li>
          <li>⚙️ State Management: React Query + Context API</li>
          <li>🧠 Deployed on: Netlify + Supabase Cloud</li>
        </ul>
      </div>

      {/* Quote */}
      <blockquote className="border-l-4 border-indigo-400 pl-4 italic text-slate-600 text-center my-6">
        “Track your skills. Sync your growth.”
      </blockquote>

      {/* Project Meta Info */}
      <aside
        className="bg-slate-50 p-5 rounded-xl border border-slate-200 mt-8"
        aria-label="SkillSync highlights"
      >
        <h4 className="text-indigo-600 font-semibold mb-3">
          📊 Project Highlights
        </h4>
        <div className="grid sm:grid-cols-3 gap-3 text-sm text-slate-700">
          <div className="flex flex-col">
            <span className="font-semibold text-slate-500">Project</span>
            <span className="text-slate-800">10-Day React Comeback</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-500">Sync</span>
            <span className="text-slate-800">Realtime (Supabase)</span>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-slate-500">Focus</span>
            <span className="text-slate-800">Developer Workflows</span>
          </div>
        </div>
      </aside>

      {/* Footer Note */}
      <p className="text-center text-sm text-slate-500 mt-6">
        © {new Date().getFullYear()} SkillSync — built with 💙 by Raj Prabhu
      </p>
    </div>
  );
}
