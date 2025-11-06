import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function Auth() {
  const { login, signup } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    setError("");
    const email = form.email.trim();
    const password = form.password;
    if (!email) {
      setError("Please enter an email.");
      return false;
    }
    if (!password) {
      setError("Please enter a password.");
      return false;
    }
    if (isSignup && password.length < 6) {
      setError("Password must be at least 6 characters for signup.");
      return false;
    }
    return true;
  };

  const normalizeError = (errOrRes) => {
    // supabase sometimes returns { error } or throws an Error
    if (!errOrRes) return "An unknown error occurred";
    if (typeof errOrRes === "string") return errOrRes;
    if (errOrRes?.error)
      return errOrRes.error?.message || String(errOrRes.error);
    if (errOrRes?.message) return errOrRes.message;
    return JSON.stringify(errOrRes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!validate()) return;

    setLoading(true);
    try {
      const email = form.email.trim();
      const password = form.password;

      const res = isSignup
        ? await signup(email, password)
        : await login(email, password);

      // Supabase client usually returns { data, error } — handle both shapes
      if (res?.error) {
        setError(res.error?.message || String(res.error));
      } else if (res?.data && isSignup) {
        // Sign-up flows often send a confirmation email; message the user
        setMessage(
          "Sign-up successful. Check your email to confirm (if required) — then log in."
        );
        setForm({ email: "", password: "" });
      } else if (!isSignup) {
        // For login, either session is returned or nothing — show a success message
        setMessage("Logged in successfully.");
      } else {
        // fallback success case
        setMessage("Success.");
      }
    } catch (err) {
      setError(normalizeError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth" style={{ maxWidth: 420 }}>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <label htmlFor="email" style={{ display: "block", marginBottom: 6 }}>
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          disabled={loading}
          autoComplete="email"
          required
          style={{ width: "100%", marginBottom: 12 }}
        />

        <label htmlFor="password" style={{ display: "block", marginBottom: 6 }}>
          Password
        </label>
        <input
          id="password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          disabled={loading}
          autoComplete={isSignup ? "new-password" : "current-password"}
          required
          style={{ width: "100%", marginBottom: 12 }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{ display: "block", width: "100%", padding: "8px 12px" }}
        >
          {loading
            ? isSignup
              ? "Signing up…"
              : "Logging in…"
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>

        {/* ARIA live region for errors/messages */}
        <div aria-live="polite" style={{ minHeight: 24, marginTop: 12 }}>
          {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}
          {!error && message && (
            <p style={{ color: "green", margin: 0 }}>{message}</p>
          )}
        </div>
      </form>

      <button
        type="button"
        onClick={() => {
          setIsSignup((s) => !s);
          setError("");
          setMessage("");
        }}
        disabled={loading}
        style={{ marginTop: 12 }}
      >
        {isSignup ? "Have an account? Login" : "Need an account? Sign up"}
      </button>
    </div>
  );
}
