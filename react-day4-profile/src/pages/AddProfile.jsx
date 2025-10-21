import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProfile({ setProfiles }) {
  const [form, setForm] = useState({ name: "", email: "", bio: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };
  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    //validation of the form
    if (!form.name.trim() || !form.email.trim()) {
      setError("Both fields are required.");
      return;
    }
    // creating new profile
    const newProfile = { id: Date.now(), ...form };
    setProfiles((prev) => [...prev, newProfile]);
    // this helps to list
    navigate("/profiles");
  };
  return (
    <div>
      <h2>Add a New Profile</h2>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          flexDirection: "column",
          gap: 8,
          maxWidth: 480,
        }}
      >
        <input
          name="name"
          placeholder="Enter Full name"
          value={form.name}
          onChange={handleChange}
          aria-label="Name"
        />
        <input
          name="email"
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          aria-label="Email"
        />
        <textarea
          name="bio"
          value={form.bio}
          onChange={handleChange}
          placeholder="Short bio (optional)"
          rows={3}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">Add Profiles</button>
        </div>
      </form>
    </div>
  );
}
