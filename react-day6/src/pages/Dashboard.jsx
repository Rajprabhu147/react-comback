// src/pages/Dashboard.jsx
import React, { useState } from "react";
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
      <div className="min-h-[240px] flex items-center justify-center">
        <div className="text-slate-600">Setting up user...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[240px] flex items-center justify-center">
        <div className="card text-center">
          <h3 className="text-lg font-semibold">
            Please login to see your skills.
          </h3>
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

  return (
    <div className="app">
      {/* Greeting header */}
      <div className="flex justify-center items-center h-32 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-2xl font-semibold text-indigo-600">
          Welcome {displayName} 👋 to your Dashboard!
        </h2>
      </div>

      {/* Add skill card */}
      <section className="max-w-3xl mx-auto my-6 card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Add a skill</h3>
            <p className="small-muted">
              Quickly add a skill and select a level.
            </p>
          </div>
        </div>

        <SkillForm onAdd={handleAdd} disabled={busyAdd} />
        {busyAdd && <div className="small-muted mt-2">Adding skill…</div>}
      </section>

      {/* Skills list */}
      <section className="max-w-6xl mx-auto my-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Your Skills</h3>
          <div className="small-muted">{skills.length} total</div>
        </div>

        {isLoading ? (
          <div className="loading">Loading skills...</div>
        ) : isError ? (
          <div className="error">
            Error fetching skills: {error?.message || "Unknown"}
          </div>
        ) : skills.length === 0 ? (
          <div className="card text-center">
            <p className="small-muted">
              No skills yet — add your first skill above.
            </p>
          </div>
        ) : (
          <SkillList
            skills={skills}
            onDelete={(id) => handleDelete(id)}
            deletingId={busyDeleteId}
          />
        )}
      </section>
    </div>
  );
}
