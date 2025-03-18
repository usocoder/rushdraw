
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ModulesPage from "@/pages/ModulesPage";
import LoginPage from "@/pages/LoginPage";
import Navbar from "@/components/ui/navbar";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/modules" element={<ModulesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
