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

  /* --------------------------------------
     LOAD SAVED LOGIN STATE ON INITIAL LOAD
     -------------------------------------- */
  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    setRememberMe(savedRememberMe);

    if (savedRememberMe && savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
    }
  }, []);

  /* --------------------------------------
     SYNC REMEMBER ME + EMAIL LIVE TO STORAGE
     -------------------------------------- */
  useEffect(() => {
    localStorage.setItem("rememberMe", rememberMe ? "true" : "false");

    if (rememberMe) {
      if (formData.email) {
        localStorage.setItem("savedEmail", formData.email);
      }
    } else {
      localStorage.removeItem("savedEmail");
    }
  }, [rememberMe, formData.email]);

  /* --------------------------------------
     HANDLE INPUT CHANGES
     -------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    setSuccessMessage("");

    // Live update saved email when rememberMe = true
    if (name === "email" && rememberMe) {
      localStorage.setItem("savedEmail", value);
    }
  };

  /* --------------------------------------
     FORM VALIDATION
     -------------------------------------- */
  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!showForgotPassword) {
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* --------------------------------------
     SAVE RECENT USERS (NOT RELATED TO RM)
     -------------------------------------- */
  const saveToRecentUsers = (email) => {
    const recentUsers = JSON.parse(localStorage.getItem("recentUsers") || "[]");
    const filtered = recentUsers.filter((u) => u !== email);
    const updated = [email, ...filtered].slice(0, 5);
    localStorage.setItem("recentUsers", JSON.stringify(updated));
  };

  /* --------------------------------------
     FORGOT PASSWORD FLOW
     -------------------------------------- */
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
      setSuccessMessage("Password reset email sent! Check your inbox.");

      setTimeout(() => {
        setShowForgotPassword(false);
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrors({ general: error.message || "Failed to send reset email." });
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------
     LOGIN / SIGNUP SUBMIT
     -------------------------------------- */
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
        setSuccessMessage("Account created! Check your email to verify.");

        setTimeout(() => {
          setIsSignUp(false);
          setSuccessMessage("");
        }, 3000);
      } else {
        await signIn(formData.email, formData.password);

        // Keep for safety – but now rememberMe is handled live in useEffect
        if (rememberMe) {
          localStorage.setItem("savedEmail", formData.email);
        } else {
          localStorage.removeItem("savedEmail");
        }

        saveToRecentUsers(formData.email);
      }
    } catch (error) {
      setErrors({ general: error.message || "Login failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------
     GOOGLE SIGN-IN
     -------------------------------------- */
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrors({});
    setSuccessMessage("");

    try {
      await signInWithGoogle();
    } catch (error) {
      setErrors({ general: error.message || "Google sign-in failed." });
      setLoading(false);
    }
  };

  /* --------------------------------------
     UI
     -------------------------------------- */
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
            <span className="error-icon">⚠️</span> {errors.general}
          </div>
        )}

        {successMessage && (
          <div className="success-banner">
            <span className="success-icon">✅</span> {successMessage}
          </div>
        )}

        {/* -------------------
            FORGOT PASSWORD VIEW
           ------------------- */}
        {showForgotPassword ? (
          <form onSubmit={handleForgotPassword} className="login-form">
            <EmailDropdown
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <div className="form-info">
              <p>Enter your email and we'll send a reset link.</p>
            </div>

            <Button type="submit" loading={loading} className="submit-btn">
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
            >
              ← Back to Sign In
            </button>
          </form>
        ) : (
          <>
            {/* -------------------
                LOGIN / SIGNUP FORM
               ------------------- */}
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
                  <button
                    type="button"
                    className="forgot-password"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot password?
                  </button>

                  <div className="checkbox">
                    <input
                      type="checkbox"
                      id="remember-me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="checkbox-input"
                    />
                    <span className="checkbox-text">Remember me</span>
                  </div>
                </div>
              )}

              <Button type="submit" loading={loading} className="submit-btn">
                {loading
                  ? "Please wait..."
                  : isSignUp
                  ? "Create Account"
                  : "Sign In"}
              </Button>
            </form>

            {/* Social Login Divider */}
            <div className="divider">
              <span className="divider-text">OR</span>
            </div>

            <Button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="google-btn"
              variant="secondary"
            >
              Continue with Google
            </Button>

            {/* Footer */}
            <div className="login-footer">
              {isSignUp
                ? "Already have an account with us?"
                : "Don't have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrors({});
                  setSuccessMessage("");
                  setFormData({ email: formData.email, password: "" });
                }}
                className="toggle-btn"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </div>

            <div className="privacy-notice">
              <p>
                By continuing, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
