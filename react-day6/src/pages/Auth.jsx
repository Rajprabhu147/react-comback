import { useState } from "react";
import { useUser } from "../context/UserContext";

export default function Auth() {
  const { login, signup } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });
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
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>

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

        <div className="remember">
          <input
            type="checkbox"
            name="remember"
            checked={form.remember}
            onChange={(e) => setForm({ ...form, remember: e.target.checked })}
          />
          <label>Remember me</label>
        </div>

        <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>

        {error && <p style={{ color: "red", fontSize: "0.9rem" }}>{error}</p>}
      </form>

      <div className="divider">Or login with</div>

      <div className="social-login">
        <button>
          <img
            src="https://cdn-icons-png.flaticon.com/512/124/124010.png"
            alt="fb"
            width="18"
          />{" "}
          Facebook
        </button>
        <button>
          <img
            src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png"
            alt="google"
            width="18"
          />{" "}
          Google
        </button>
      </div>

      <div className="footer">
        {isSignup ? (
          <p>
            Already a member?{" "}
            <a onClick={() => setIsSignup(false)}>Login now</a>
          </p>
        ) : (
          <p>
            Not a member? <a onClick={() => setIsSignup(true)}>Sign up now</a>
          </p>
        )}
      </div>
    </div>
  );
}
