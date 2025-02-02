import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toast";
import Index from "@/pages/Index";
import Admin from "@/pages/Admin";
import AdminCases from "@/pages/AdminCases";
import AdminNewCase from "@/pages/AdminNewCase";
import AdminItems from "@/pages/AdminItems";
import AdminNewItem from "@/pages/AdminNewItem";
import AdminEditItem from "@/pages/AdminEditItem";

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
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
