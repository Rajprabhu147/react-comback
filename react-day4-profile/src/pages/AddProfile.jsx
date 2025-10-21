// import React from "react";
import { useState } from "react";
import { useProfiles } from "./ProfilesContext";
import { useNavigate } from "react-router-dom";
import { generateId } from "../utils/id";

export default function AddProfile() {
  const { addProfile } = useProfiles();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", bio: "" });
  const [error, setError] = useState("");

  const isValidEmail = (email) => {
    // simple but practical regex - good enough for demo (not RFC full)
    return /^\S+@\S+\.\S+$/.test(email);
  };

  /** handleChange - updates form state and clears error */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  /** handleSubmit - validate and add profile */
  const handleSubmit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    // creating new profile
    const id = generateId();
    addProfile({ id, name, email, bio: form.bio.trim() });
    //navigate to list
    navigate("/profiles");
  };

  const isSubmitDisabled =
    !form.name.trim() || !form.email.trim() || !isValidEmail;

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
          autoComplete="name"
        />
        <input
          name="email"
          type="email"
          placeholder="Enter email"
          value={form.email}
          onChange={handleChange}
          aria-label="Email"
          autoComplete="email"
        />
        <label>
          <textarea
            name="bio"
            value={form.bio}
            onChange={handleChange}
            placeholder="Short bio (optional)"
            rows={3}
          />
        </label>
        {error && (
          <div role="alert" style={{ color: "red" }}>
            {error}
          </div>
        )}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="submit"
            disabled={isSubmitDisabled}
            aria-disabled={isSubmitDisabled}
          >
            Add Profiles
          </button>
        </div>
      </form>
    </div>
  );
}
