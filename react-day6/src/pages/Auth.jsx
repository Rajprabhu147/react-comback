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
    // Add actual password reset logic here with Supabase
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Main Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 px-8 py-12 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="w-20 h-20 bg-white bg-opacity-20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-2xl">
                <span className="text-white text-3xl">
                  {showForgotPassword ? "🔑" : isSignup ? "✨" : "🔐"}
                </span>
              </div>

              <h2 className="text-4xl font-bold text-white mb-3">
                {showForgotPassword
                  ? "Reset Password"
                  : isSignup
                  ? "Create Account"
                  : "Welcome Back"}
              </h2>
              <p className="text-indigo-100 text-lg">
                {showForgotPassword
                  ? "Enter your email to receive a reset link"
                  : isSignup
                  ? "Start your learning journey with SkillSync"
                  : "Sign in to continue to SkillSync"}
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-8 py-10">
            {showForgotPassword ? (
              // Forgot Password Form
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-semibold text-slate-700 mb-3"
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
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
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
                  className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors py-2"
                >
                  ← Back to login
                </button>
              </form>
            ) : (
              // Main Login/Signup Form
              <form onSubmit={handleSubmit} className="space-y-7">
                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-slate-700 mb-3"
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
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700 mb-3"
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
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                  />
                  {isSignup && (
                    <p className="text-xs text-slate-500 mt-2.5 ml-1">
                      Must be at least 6 characters long
                    </p>
                  )}
                </div>

                {/* Remember me & Forgot password */}
                {!isSignup && (
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-2 focus:ring-indigo-200 cursor-pointer"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors font-medium">
                        Remember me
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div
                    className="bg-red-50 border-l-4 border-red-500 p-4 rounded-xl"
                    role="alert"
                  >
                    <p className="text-sm text-red-800 font-medium leading-relaxed">
                      {error}
                    </p>
                  </div>
                )}

                {/* Success Notice */}
                {notice && (
                  <div
                    className="bg-green-50 border-l-4 border-green-500 p-4 rounded-xl"
                    role="status"
                  >
                    <p className="text-sm text-green-800 font-medium leading-relaxed">
                      {notice}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={busy}
                    className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30 disabled:shadow-none hover:shadow-xl hover:shadow-indigo-500/40"
                  >
                    {busy ? (
                      <span className="flex items-center justify-center gap-3">
                        <span className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                        {isSignup
                          ? "Creating your account..."
                          : "Signing you in..."}
                      </span>
                    ) : (
                      <span className="text-lg">
                        {isSignup ? "Create Account" : "Sign In"}
                      </span>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t-2 border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-slate-500 font-semibold">
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
                  className="w-full border-2 border-slate-200 hover:border-indigo-400 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-violet-50 text-slate-700 hover:text-indigo-700 font-bold py-4 rounded-xl transition-all transform hover:scale-105 active:scale-95"
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
        <div className="mt-8 text-center space-y-3">
          <p className="text-xs text-slate-500 leading-relaxed px-4">
            By continuing, you agree to SkillSync's{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline decoration-indigo-200 hover:decoration-indigo-400 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-700 font-semibold underline decoration-indigo-200 hover:decoration-indigo-400 transition-colors"
              onClick={(e) => e.preventDefault()}
            >
              Privacy Policy
            </a>
          </p>
          <p className="text-xs text-slate-400 font-medium">
            © 2025 KingLord Corp. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
