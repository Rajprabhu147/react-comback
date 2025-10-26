import React from "react";
import ReactDOM from "react-dom/client"; // imports the new rendering Api that supports concurrent features
import { BrowserRouter } from "react-router-dom"; //for Routing all the pages
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; //for react query option
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; //for debugging and future use
import App from "./App";
import { ThemeProvider } from "./useContext/ThemeContext"; // Context Api
import "./index.css";

//Query Client declaration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60, refetchOnWindowFocus: true },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/**just like context provider but for react Query */}
      <ThemeProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </React.StrictMode>
);
