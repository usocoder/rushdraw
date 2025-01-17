import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { BrowserAuthProvider } from "./contexts/BrowserAuthContext";
import { BalanceProvider } from "./contexts/BalanceContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminCases from "./pages/AdminCases";
import AdminItems from "./pages/AdminItems";
import AdminNewCase from "./pages/AdminNewCase";
import AdminNewItem from "./pages/AdminNewItem";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserAuthProvider>
      <BalanceProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/cases" element={<AdminCases />} />
              <Route path="/admin/cases/new" element={<AdminNewCase />} />
              <Route path="/admin/items" element={<AdminItems />} />
              <Route path="/admin/items/new" element={<AdminNewItem />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </BalanceProvider>
    </BrowserAuthProvider>
  </QueryClientProvider>
);

export default App;