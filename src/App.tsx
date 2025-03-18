
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/HomePage";
import FeaturesPage from "@/pages/FeaturesPage";
import PricingPage from "@/pages/PricingPage";
import DashboardPage from "@/pages/DashboardPage";
import Admin from "@/pages/Admin";
import AdminOrders from "@/pages/AdminOrders";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserAuthProvider } from "@/contexts/BrowserAuthContext";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserAuthProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </BrowserAuthProvider>
  );
}

export default App;
