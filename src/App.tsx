import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import AdminCases from "@/pages/AdminCases";
import AdminNewCase from "@/pages/AdminNewCase";
import AdminItems from "@/pages/AdminItems";
import AdminNewItem from "@/pages/AdminNewItem";
import AdminEditItem from "@/pages/AdminEditItem";
import AdminRewards from "@/pages/AdminRewards";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/cases" element={<AdminCases />} />
        <Route path="/admin/cases/new" element={<AdminNewCase />} />
        <Route path="/admin/items" element={<AdminItems />} />
        <Route path="/admin/items/new" element={<AdminNewItem />} />
        <Route path="/admin/items/:id/edit" element={<AdminEditItem />} />
        <Route path="/admin/rewards" element={<AdminRewards />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;