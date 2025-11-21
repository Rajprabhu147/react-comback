import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import Input from "../components/Shared/Input";
import Button from "../components/Shared/Button";
import EmailDropdown from "../components/Auth/EmailDropdown";

import "../styles/login.css";

const Login = () => {
  // From UserContext: functions to sign in, sign up, or use Google OAuth
  const { signIn, signUp, signInWithGoogle } = useUser();

  // Toggle between Sign In / Sign Up views
  const [isSignUp, setIsSignUp] = useState(false);

  // Loading state for button disable + spinner
  const [loading, setLoading] = useState(false);

  // Remember Me option for storing email
  const [rememberMe, setRememberMe] = useState(false);

  // Form field values
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Validation errors (email/password/general)
  const [errors, setErrors] = useState({});

  /**
   * Load saved email & Remember Me state on component mount
   * If the user used "Remember Me" before, auto-fill email field.
   */
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedEmail && savedRememberMe) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  /**
   * Update form inputs and clear field-specific errors.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Validate email & password fields before submitting.
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Form submit handler for BOTH Sign In and Sign Up flows.
   * Handles:
   * - validation
   * - sign in / sign up calls
   * - remember me logic
   * - recent users list
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (isSignUp) {
        // Create new account
        await signUp(formData.email, formData.password);
        alert("Account created! Check your email for verification.");
        saveToRecentUsers(formData.email);
      } else {
        // Sign in user
        await signIn(formData.email, formData.password);

        // Save email if Remember Me is checked
        if (rememberMe) {
          localStorage.setItem("savedEmail", formData.email);
          localStorage.setItem("rememberMe", "true");
        } else {
          localStorage.removeItem("savedEmail");
          localStorage.removeItem("rememberMe");
        }

        saveToRecentUsers(formData.email);
      }
    } catch (error) {
      setErrors({
        general: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with Google using Supabase OAuth.
   */
  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      await signInWithGoogle();
    } catch (error) {
      setErrors({
        general: error.message || "Google sign-in failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Save logged-in email to "recent users" (max 5 stored).
   * Used for UX — show last signed-in accounts.
   */
  const saveToRecentUsers = (email) => {
    const recentUsers = JSON.parse(localStorage.getItem("recentUsers") || "[]");

    // Remove duplicates
    const filtered = recentUsers.filter((u) => u !== email);

    // Add new at top, store max 5
    const updated = [email, ...filtered].slice(0, 5);

    localStorage.setItem("recentUsers", JSON.stringify(updated));
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header Logo + Title */}
        <div className="login-header">
          <div className="login-icon">🌊</div>
          <h1 className="login-title">Travel Dashboard</h1>
          <p className="login-subtitle">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Error message banner */}
        {errors.general && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{errors.general}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {/* <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your@email.com"
            autoComplete="email"
          /> */}
          <EmailDropdown
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />

          {/* Remember Me + Forgot Password (only for Sign In) */}
          {!isSignUp && (
            <div className="form-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">Remember me</span>
              </label>

              <a href="#" className="forgot-password">
                Forgot password?
              </a>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="submit-btn"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        {/* Google Sign In */}
        <div className="divider">
          <span className="divider-text">OR</span>
        </div>

        <Button
          variant="secondary"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="google-btn"
          icon={
            /* Google SVG Icon */
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057..." />
              <path fill="#34A853" d="M9 18c2.43 0 4.467..." />
              <path fill="#FBBC05" d="M3.964 10.707c-.18..." />
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508..." />
            </svg>
          }
        >
          Continue with Google
        </Button>

        {/* Footer — Switch between Sign In & Sign Up */}
        <div className="login-footer">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrors({});
            }}
            className="toggle-btn"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
