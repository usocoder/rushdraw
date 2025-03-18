
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import HomePage from "@/pages/HomePage";
import FeaturesPage from "@/pages/FeaturesPage";
import PricingPage from "@/pages/PricingPage";
import DashboardPage from "@/pages/DashboardPage";
import { AuthProvider } from "@/contexts/AuthContext";
import { BrowserAuthProvider } from "@/contexts/BrowserAuthContext";

function App() {
  return (
    <BrowserAuthProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </BrowserAuthProvider>
  );
}

export default App;
