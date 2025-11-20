import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import { UserProvider, useUser } from "./context/UserContext";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import LoadingSpinner from "./components/Shared/LoadingSpinner";
import "./App.css";
import "./styles/components.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

const AppContent = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <AppContent />
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
      </UserProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
