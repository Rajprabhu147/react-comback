import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function Auth() {
  const { login, signup } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isSignup) await signup(form.email, form.password);
      else await login(form.email, form.password);
    } catch (err) {
      setError(err.message);
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
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <button className="submit-btn" type="submit">
          {isSignup ? "Sign Up" : "Login"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
      <button onClick={() => setIsSignup(!isSignup)}>
        {isSignup ? "Have an account? Login" : "Need an account? Sign up"}
      </button>
    </div>
  );
}
