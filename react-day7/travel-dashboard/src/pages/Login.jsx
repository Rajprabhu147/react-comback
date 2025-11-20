import React, { useState } from "react";
import { useUser } from "../context/UserContext"; // Auth context: handles signIn and signUp
import Input from "../components/Shared/Input"; // Reusable input field
import Button from "../components/Shared/Button"; // Reusable button component

/**
 * Login Component
 * ---------------------------------------------------------
 * Handles BOTH:
 *  - Sign In
 *  - Sign Up
 *
 * Features:
 *  - Built-in form validation
 *  - Switching between login & register
 *  - Loading state
 *  - Error messages (field + general)
 *  - Uses global authentication from useUser()
 */

const Login = () => {
  const { signIn, signUp } = useUser(); // Auth functions from context

  const [isSignUp, setIsSignUp] = useState(false); // Toggle between Sign In / Sign Up
  const [loading, setLoading] = useState(false); // Loading spinner state

  // Form fields
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  /**
   * Handle input changes
   * Updates form data & clears field-specific error
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  /**
   * Form validation
   * - Checks email format
   * - Password must be 6+ characters
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
   * Handle form submission
   * - Validate fields
   * - Call signIn or signUp depending on mode
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      if (isSignUp) {
        // Create new account
        await signUp(formData.email, formData.password);
        alert("Account created! Please check your email for verification.");
      } else {
        // Normal login
        await signIn(formData.email, formData.password);
      }
    } catch (error) {
      // Show backend errors
      setErrors({
        general: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Title */}
        <h1 className="login-title">🌊 Travel Dashboard</h1>
        <p className="login-subtitle">
          {isSignUp ? "Create your account" : "Welcome back"}
        </p>

        {/* General errors (e.g., wrong password) */}
        {errors.general && (
          <div
            style={{
              padding: "12px",
              background: "var(--danger-light)",
              color: "var(--danger)",
              borderRadius: "var(--radius-md)",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            {errors.general}
          </div>
        )}

        {/* Login / Sign Up Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your@email.com"
          />

          {/* Password Field */}
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            style={{ width: "100%", marginTop: "8px" }}
          >
            {isSignUp ? "Sign Up" : "Sign In"}
          </Button>
        </form>

        {/* Toggle between login and register */}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px",
            color: "var(--text-secondary)",
          }}
        >
          {isSignUp ? "Already have an account?" : "Don't have an account?"}

          {/* Switch mode button */}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrors({});
            }}
            style={{
              marginLeft: "6px",
              color: "var(--primary)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
