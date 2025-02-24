
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserAuthProvider } from "@/contexts/BrowserAuthContext";
import { BalanceProvider } from "@/contexts/BalanceContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserAuthProvider>
        <BalanceProvider>
          <App />
        </BalanceProvider>
      </BrowserAuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
