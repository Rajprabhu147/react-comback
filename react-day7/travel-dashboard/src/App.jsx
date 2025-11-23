import React from "react";
// Router: BrowserRouter for client routing and Route definitions
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// React Query: client and provider for server-state caching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// React Query Devtools (dev-only UI to inspect queries)
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Toast notifications provider
import { Toaster } from "react-hot-toast";
// Auth context provider and hook
import { UserProvider, useUser } from "./context/UserContext";
// Pages
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
// Reusable loading spinner component used while auth state loads
import LoadingSpinner from "./components/Shared/LoadingSpinner";
// Global styles
import "./index.css";
import "./App.css";

/* --- Create a QueryClient for @tanstack/react-query
   - defaultOptions here control how queries behave app-wide
   - refetchOnWindowFocus: disable re-fetch when user focuses window
   - retry: retry failed queries once
   - staleTime: keep results fresh for 30s before considered stale
*/
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

/* ProtectedRoute component
   - Wrap any route that requires authentication with this component.
   - Reads auth state from useUser() (user + loading).
   - While loading: show full-page loading spinner (prevents flicker).
   - If user exists: render children (protected content).
   - If no user: redirect to /login.
*/
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
    // Show centered loading UI while auth state initializes
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)",
        }}
      >
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  // If authenticated, render the protected children; otherwise redirect to login
  return user ? children : <Navigate to="/login" replace />;
};

/* AppRoutes component
   - Centralizes route definitions and public/protected routing logic.
   - Uses useUser to check user/loading for the login route and initial rendering.
   - This keeps route-level loading UX consistent across the app.
*/
const AppRoutes = () => {
  const { user, loading } = useUser();

  if (loading) {
    // While UserProvider is still determining auth state, show loader
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%)",
        }}
      >
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  // Route definitions
  return (
    <Routes>
      {/* Public route: Login */}
      {/* If user is already authenticated, redirect /login -> / (home) */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />

      {/* Protected app routes: wrap each route in ProtectedRoute */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 route for unknown paths */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

/* App root
   - Wraps the app with BrowserRouter (client routing)
   - Wraps with QueryClientProvider (react-query cache)
   - Wraps with UserProvider (auth context — initializes on mount)
   - Renders AppRoutes (all routes)
   - Adds global Toaster for toast notifications configuration
   - Adds ReactQueryDevtools (dev-time tool; harmless in production if removed)
*/
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          {/* Application routes and pages */}
          <AppRoutes />

          {/* Toast notification container with theme + durations set */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "var(--surface)",
                color: "var(--text-primary)",
                border: "1px solid var(--bg-secondary)",
                borderRadius: "var(--radius-md)",
                boxShadow: "var(--shadow-lg)",
              },
              success: {
                iconTheme: {
                  primary: "var(--success)",
                  secondary: "white",
                },
              },
              error: {
                iconTheme: {
                  primary: "var(--danger)",
                  secondary: "white",
                },
              },
            }}
          />

          {/* Developer tool to inspect React Query cache; optional in production */}
          <ReactQueryDevtools initialIsOpen={false} />
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
