import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import EmailDropdown from "../components/Auth/EmailDropdown";
import Button from "../components/Shared/Button";
import "../styles/login.css";

const Login = () => {
  const { signIn, signUp, signInWithGoogle, resetPassword } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Load saved credentials on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedEmail && savedRememberMe) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors on input change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setSuccessMessage("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!showForgotPassword) {
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveToRecentUsers = (email) => {
    const recentUsers = JSON.parse(localStorage.getItem("recentUsers") || "[]");
    const filtered = recentUsers.filter((u) => u !== email);
    const updated = [email, ...filtered].slice(0, 5);
    localStorage.setItem("recentUsers", JSON.stringify(updated));
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors({ email: "Please enter your email address" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await resetPassword(formData.email);
      setSuccessMessage(
        "Password reset email sent! Check your inbox for instructions."
      );
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error);
      setErrors({
        general:
          error.message || "Failed to send reset email. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      if (isSignUp) {
        await signUp(formData.email, formData.password);
        saveToRecentUsers(formData.email);
        setSuccessMessage(
          "Account created! Please check your email to verify your account."
        );
        // Switch to sign in mode after 3 seconds
        setTimeout(() => {
          setIsSignUp(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        await signIn(formData.email, formData.password);

        // Handle remember me
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
      console.error("Auth error:", error);
      setErrors({
        general: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      setErrors({
        general: error.message || "Google sign-in failed. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🗺️</div>
          <h1 className="login-title">Sutri</h1>
          <p className="login-subtitle">
            {showForgotPassword
              ? "Reset your password"
              : isSignUp
              ? "Create your account"
              : "Welcome back"}
          </p>
        </div>

        {errors.general && (
          <div className="error-banner">
            <span className="error-icon">⚠️</span>
            <span>{errors.general}</span>
          </div>
        )}

        {successMessage && (
          <div className="success-banner">
            <span className="success-icon">✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="login-form">
            <EmailDropdown
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div className="form-info">
              <p>
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="submit-btn"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>

            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(false);
                setErrors({});
                setSuccessMessage("");
              }}
              className="back-btn"
              disabled={loading}
            >
              ← Back to Sign In
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="login-form">
              <EmailDropdown
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`form-input ${errors.password ? "error" : ""}`}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                {errors.password && (
                  <span className="error-text">{errors.password}</span>
                )}
              </div>

              {!isSignUp && (
                <div className="form-options">
                  <label className="checkbox-label" htmlFor="rememberMe">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Remember me</span>
                  </label>

                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => setShowForgotPassword(true)}
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                className="submit-btn"
              >
                {loading
                  ? "Please wait..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>

            <div className="divider">
              <span className="divider-text">OR</span>
            </div>

            <Button
              variant="secondary"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="google-btn"
              icon={
                <svg width="18" height="18" viewBox="0 0 18 18">
                  <path
                    fill="#4285F4"
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                  />
                  <path
                    fill="#34A853"
                    d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
                  />
                  <path
                    fill="#EA4335"
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
                  />
                </svg>
              }
            >
              Continue with Google
            </Button>

            <div className="login-footer">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                  setSuccessMessage("");
                  setFormData({ email: formData.email, password: "" });
                }}
                className="toggle-btn"
                disabled={loading}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>

            <div className="privacy-notice">
              <p>
                By continuing, you agree to our{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
