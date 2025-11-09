// src/pages/Auth.jsx
import React, { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { login, signup } = useUser();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);

    try {
      const result = isSignup
        ? await signup(form.email, form.password)
        : await login(form.email, form.password);

      console.log("Auth result:", result);

      // If an error object is returned by the SDK
      if (result?.error) {
        const err = result.error;
        if (
          err?.code === "email_not_confirmed" ||
          err?.message?.includes("Email not confirmed")
        ) {
          setError(
            "Email not confirmed — check your inbox (or confirm via Supabase dashboard)."
          );
        } else {
          setError(err.message || "Authentication failed");
        }
        setBusy(false);
        return;
      }

      // Successful sign in: SDK usually returns data.session
      if (result?.data?.session) {
        navigate("/dashboard");
        return;
      }

      // Signup success (often requires email confirmation)
      if (isSignup) {
        setNotice(
          "Sign-up successful. Please check your email for a confirmation link before logging in."
        );
        setForm({ email: "", password: "" });
        setBusy(false);
        return;
      }

      // Fallback: no error and no session
      setNotice(
        "Processed. If you're not redirected automatically, check the console or try refreshing."
      );
    } catch (err) {
      console.error("Auth.handleSubmit threw:", err);
      setError(err?.message || "Unexpected error during authentication");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6">
      <div className="w-full max-w-md">
        <div className="card p-6">
          <h2 className="text-2xl font-bold text-center text-indigo-600 mb-2">
            {isSignup ? "Create an account" : "Welcome back"}
          </h2>
          <p className="text-center text-sm text-slate-500 mb-4">
            {isSignup
              ? "Sign up to start tracking your skills."
              : "Login to view and manage your skills."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm text-slate-600">Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                className="form-input mt-1"
                placeholder="you@company.com"
              />
            </label>
            <br />

            <label className="block">
              <span className="text-sm text-slate-600">Password</span>
              <input
                name="password"
                type="password"
                required
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={form.password}
                onChange={handleChange}
                className="form-input mt-1"
                placeholder="Enter a secure password"
                minLength={6}
              />
            </label>
            <br />

            <div className="flex items-center justify-between gap-3">
              <button
                type="submit"
                className="btn flex-1"
                disabled={busy}
                aria-disabled={busy}
              >
                {busy
                  ? isSignup
                    ? "Signing up..."
                    : "Logging in..."
                  : isSignup
                  ? "Sign Up"
                  : "Login"}
              </button>

              <button
                type="button"
                className="btn-ghost"
                onClick={() => {
                  setIsSignup((s) => !s);
                  setError("");
                  setNotice("");
                }}
              >
                {isSignup
                  ? "Have an account? Login"
                  : "Need an account? Sign up"}
              </button>
            </div>

            {error && (
              <p className="error" role="alert">
                {error}
              </p>
            )}
            {notice && (
              <p className="small-muted" role="status">
                {notice}
              </p>
            )}
          </form>
        </div>
        <div className="footer">
          <p className="text-center text-xs text-slate-400 mt-3">
            By continuing you agree to the SkillSync terms and privacy.
          </p>
          <span>© 2025 KingLord Corp. All Rights Reserved.</span>
        </div>
      </div>
    </div>
  );
}
