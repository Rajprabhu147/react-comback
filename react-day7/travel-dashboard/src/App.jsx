import React from "react";
// Router: BrowserRouter for client routing and Route definitions
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
// React Query: client and provider for server-state caching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// React Query Devtools (dev-only UI to inspect queries)
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// Toast notifications provider
import { Toaster } from "react-hot-toast";
// Auth context provider and hook
import { UserProvider, useUser } from "./context/UserContext";
// Page transition helpers
import { CSSTransition, TransitionGroup } from "react-transition-group";

// Pages
import Dashboard from "./pages/Dashboard";
import ProfileSettings from "./pages/ProfileSettings";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
// Reusable loading spinner component used while auth state loads
import LoadingSpinner from "./components/Shared/LoadingSpinner";
// Global styles (make sure transitions CSS is included here or imported)
import "./index.css";
import "./App.css";

/* --- Create a QueryClient for @tanstack/react-query */
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
   - Keeps routes behind authentication.
*/
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUser();

  if (loading) {
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

  return user ? children : <Navigate to="/login" replace />;
};

/* AnimatedRoutes
   - Wraps Routes with TransitionGroup and CSSTransition so route changes animate.
   - Must be used inside BrowserRouter (so useLocation() works).
*/
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      {/* CSSTransition uses the location.pathname as a key to animate on navigation */}
      <CSSTransition key={location.pathname} classNames="page" timeout={300}>
        {/* The Routes component receives the current location for correct matching */}
        <Routes location={location}>
          {/* Public route: Login */}
          <Route path="/login" element={<Login />} />

          {/* Protected app routes */}
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

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

/* App root
   - BrowserRouter must wrap everything using useLocation/useNavigate/useRoutes.
*/
function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          {/* AnimatedRoutes handles the actual route rendering with transitions.
              We still keep the login redirect logic inside ProtectedRoute so
              the user is redirected to /login when not authenticated.
              Note: if you want the login route to redirect when already logged in,
              wrap /login element with logic or move that check into a small wrapper route.
          */}
          <AnimatedRoutes />

          {/* Global toaster */}
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
                iconTheme: { primary: "var(--success)", secondary: "white" },
              },
              error: {
                iconTheme: { primary: "var(--danger)", secondary: "white" },
              },
            }}
          />

          {/* Dev tool (optional) */}
          <ReactQueryDevtools initialIsOpen={false} />
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
