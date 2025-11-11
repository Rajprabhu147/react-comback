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
  const [showForgotPassword, setShowForgotPassword] = useState(false);

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

      if (result?.data?.session) {
        navigate("/dashboard");
        return;
      }

      if (isSignup) {
        setNotice(
          "Sign-up successful! Please check your email for a confirmation link before logging in."
        );
        setForm({ email: "", password: "" });
        setBusy(false);
        return;
      }

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

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setShowForgotPassword(false);
    setNotice("Password reset link sent! Check your email.");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
      }}
    >
      <div style={{ width: "100%", maxWidth: "28rem" }}>
        {/* Main Auth Card */}
        <div
          className="card"
          style={{
            background: "white",
            borderRadius: "1.5rem",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            border: "1px solid rgba(226, 232, 240, 0.8)",
            overflow: "hidden",
          }}
        >
          {/* Gradient Header */}
          <div
            style={{
              position: "relative",
              background:
                "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
              padding: "3rem 2rem",
              textAlign: "center",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "relative", zIndex: 10 }}>
              <div
                style={{
                  width: "5rem",
                  height: "5rem",
                  background: "rgba(255, 255, 255, 0.2)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
                  fontSize: "3rem",
                }}
              >
                {showForgotPassword ? "🔑" : isSignup ? "✨" : "🔐"}
              </div>

              <h2
                style={{
                  fontSize: "2.25rem",
                  fontWeight: "bold",
                  color: "white",
                  marginBottom: "0.75rem",
                }}
              >
                {showForgotPassword
                  ? "Reset Password"
                  : isSignup
                  ? "Create Account"
                  : "Welcome Back"}
              </h2>
              <p
                style={{
                  color: "rgba(224, 231, 255, 0.9)",
                  fontSize: "1.125rem",
                }}
              >
                {showForgotPassword
                  ? "Enter your email to receive a reset link"
                  : isSignup
                  ? "Start your learning journey with SkillSync"
                  : "Sign in to continue to SkillSync"}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div style={{ padding: "2.5rem 2rem" }}>
            {showForgotPassword ? (
              // Forgot Password Form
              <form
                onSubmit={handleForgotPassword}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <div>
                  <label
                    htmlFor="reset-email"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "var(--text)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    id="reset-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #e2e8f0",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent-start)";
                      e.target.style.boxShadow =
                        "0 0 0 4px rgba(79, 70, 229, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    background:
                      "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: "0.75rem",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1rem",
                    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.3)",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "translateY(-2px)";
                    e.target.style.boxShadow =
                      "0 6px 20px rgba(79, 70, 229, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "translateY(0)";
                    e.target.style.boxShadow =
                      "0 4px 14px rgba(79, 70, 229, 0.3)";
                  }}
                >
                  Send Reset Link
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setError("");
                    setNotice("");
                  }}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    fontSize: "0.875rem",
                    color: "var(--accent-start)",
                    fontWeight: "600",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    transition: "color 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = "var(--accent-end)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = "var(--accent-start)";
                  }}
                >
                  ← Back to login
                </button>
              </form>
            ) : (
              // Main Login/Signup Form
              <form
                onSubmit={handleSubmit}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.75rem",
                }}
              >
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "var(--text)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #e2e8f0",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent-start)";
                      e.target.style.boxShadow =
                        "0 0 0 4px rgba(79, 70, 229, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "var(--text)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete={
                      isSignup ? "new-password" : "current-password"
                    }
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    minLength={6}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      borderRadius: "0.75rem",
                      border: "2px solid #e2e8f0",
                      fontSize: "0.95rem",
                      fontWeight: "500",
                      outline: "none",
                      transition: "all 0.2s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "var(--accent-start)";
                      e.target.style.boxShadow =
                        "0 0 0 4px rgba(79, 70, 229, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  {isSignup && (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--muted)",
                        marginTop: "0.625rem",
                        marginLeft: "0.25rem",
                      }}
                    >
                      Must be at least 6 characters long
                    </p>
                  )}
                </div>

                {/* Remember me & Forgot password */}
                {!isSignup && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{
                          width: "1rem",
                          height: "1rem",
                          cursor: "pointer",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "var(--muted)",
                          fontWeight: "500",
                        }}
                      >
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--accent-start)",
                        fontWeight: "600",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        transition: "color 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "var(--accent-end)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "var(--accent-start)";
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div
                    className="error"
                    style={{
                      background: "linear-gradient(to right, #fee2e2, #fecaca)",
                      borderLeft: "4px solid #dc2626",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#dc2626",
                        fontWeight: "500",
                        lineHeight: "1.6",
                      }}
                    >
                      {error}
                    </p>
                  </div>
                )}

                {/* Success Notice */}
                {notice && (
                  <div
                    className="success"
                    style={{
                      background: "linear-gradient(to right, #d1fae5, #a7f3d0)",
                      borderLeft: "4px solid #059669",
                      padding: "1rem",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "0.875rem",
                        color: "#059669",
                        fontWeight: "500",
                        lineHeight: "1.6",
                      }}
                    >
                      {notice}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div style={{ paddingTop: "0.5rem" }}>
                  <button
                    type="submit"
                    disabled={busy}
                    className="btn"
                    style={{
                      width: "100%",
                      padding: "1rem",
                      background: busy
                        ? "linear-gradient(135deg, #94a3b8, #cbd5e1)"
                        : "linear-gradient(135deg, var(--accent-start), var(--accent-end))",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "0.75rem",
                      border: "none",
                      cursor: busy ? "not-allowed" : "pointer",
                      fontSize: "1.125rem",
                      boxShadow: busy
                        ? "none"
                        : "0 4px 14px rgba(79, 70, 229, 0.3)",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!busy) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow =
                          "0 6px 20px rgba(79, 70, 229, 0.4)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!busy) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow =
                          "0 4px 14px rgba(79, 70, 229, 0.3)";
                      }
                    }}
                  >
                    {busy ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.75rem",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: "1.25rem",
                            height: "1.25rem",
                            border: "2px solid white",
                            borderTopColor: "transparent",
                            borderRadius: "50%",
                            animation: "spin 1s linear infinite",
                          }}
                        />
                        {isSignup
                          ? "Creating your account..."
                          : "Signing you in..."}
                      </span>
                    ) : (
                      <span>{isSignup ? "Create Account" : "Sign In"}</span>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div
                  style={{
                    position: "relative",
                    margin: "2rem 0",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        borderTop: "2px solid #e2e8f0",
                      }}
                    />
                  </div>
                  <div
                    style={{
                      position: "relative",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        padding: "0 1rem",
                        background: "white",
                        fontSize: "0.875rem",
                        color: "var(--muted)",
                        fontWeight: "600",
                      }}
                    >
                      {isSignup
                        ? "Already have an account?"
                        : "Don't have an account?"}
                    </span>
                  </div>
                </div>

                {/* Toggle Sign Up / Login Button */}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignup((s) => !s);
                    setError("");
                    setNotice("");
                    setForm({ email: "", password: "" });
                  }}
                  className="btn-ghost"
                  style={{
                    width: "100%",
                    padding: "1rem",
                    border: "2px solid #e2e8f0",
                    background: "transparent",
                    color: "var(--text)",
                    fontWeight: "bold",
                    borderRadius: "0.75rem",
                    cursor: "pointer",
                    fontSize: "1rem",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = "var(--accent-start)";
                    e.target.style.background = "rgba(79, 70, 229, 0.05)";
                    e.target.style.color = "var(--accent-start)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = "#e2e8f0";
                    e.target.style.background = "transparent";
                    e.target.style.color = "var(--text)";
                  }}
                >
                  {isSignup
                    ? "Sign in to existing account"
                    : "Create new account"}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="footer"
          style={{
            marginTop: "2rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.75rem",
              color: "var(--muted)",
              lineHeight: "1.6",
              padding: "0 1rem",
              marginBottom: "0.75rem",
            }}
          >
            By continuing, you agree to SkillSync's{" "}
            <a
              href="#"
              style={{
                color: "var(--accent-start)",
                fontWeight: "600",
                textDecoration: "underline",
              }}
              onClick={(e) => e.preventDefault()}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              style={{
                color: "var(--accent-start)",
                fontWeight: "600",
                textDecoration: "underline",
              }}
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
          </p>
          <p
            style={{
              fontSize: "0.75rem",
              color: "#94a3b8",
              fontWeight: "500",
            }}
          >
            © 2025 KingLord Corp. All Rights Reserved.
          </p>
        </div>

        {/* Add keyframe animation for spinner */}
        <style>
          {`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    </div>
  );
}
