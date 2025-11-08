// src/pages/Auth.jsx
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const { login, signup } = useUser();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      // call context functions; they typically return { data, error }
      const result = isSignup
        ? await signup(form.email, form.password)
        : await login(form.email, form.password);

      console.log("Auth result:", result);

      // If SDK returned an error object, surface it
      if (result?.error) {
        const err = result.error;
        // special-case: helpful message when email not confirmed
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

      // On success some flows return data.session (signIn)
      if (result?.data?.session) {
        // successful login — navigate to dashboard
        navigate("/dashboard");
        return;
      }

      // Signup case: often requires email confirmation — show friendly note
      if (isSignup) {
        setError(
          "Sign-up successful. Please check your email for a confirmation link before logging in."
        );
      } else {
        // No session & no error — fallback for unexpected SDK shapes
        console.warn("Login completed but no session was returned:", result);
        // try to confirm session exists and then navigate
        // (this helps if your UserContext onAuthStateChange will update shortly)
        // final fallback: navigate after small delay if auth state shows signed in
        setTimeout(async () => {
          try {
            // optionally check session from supabase direct if you have it globally available
            // const { data } = await supabase.auth.getSession();
            // if (data?.session) navigate('/dashboard');
            // For now, just log and inform user
            console.log("No session detected immediately after login.");
          } catch (err) {
            console.error(err);
          }
        }, 500);
        setError(
          "Login processed. If you're not automatically redirected check the console."
        );
      }
    } catch (err) {
      console.error("Auth.handleSubmit threw:", err);
      setError(err?.message || "Unexpected error during authentication");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth">
      <h2 className="login">{isSignup ? "Sign Up" : "Login"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="submit-btn" type="submit" disabled={busy}>
          {busy
            ? isSignup
              ? "Signing up..."
              : "Logging in..."
            : isSignup
            ? "Sign Up"
            : "Login"}
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      <button onClick={() => setIsSignup((s) => !s)}>
        {isSignup ? "Have an account? Login" : "Need an account? Sign up"}
      </button>
    </div>
  );
}
