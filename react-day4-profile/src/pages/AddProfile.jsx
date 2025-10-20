import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProfile({ setProfiles }) {
  const [form, setForm] = useState({ name: "", email: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      setError("Both fields are required");
      return;
    }
    const newProfile = { id: Date.now(), ...form };
    setProfiles((prev) => [...prev, newProfile]);
    navigate("/profiles");
  };
  return (
    <div>
      <h2>Add a New Profile</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 8 }}
      >
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Add Profiles</button>
      </form>
    </div>
  );
}
