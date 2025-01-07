import { Hero } from "@/components/Hero";
import { CaseGrid } from "@/components/CaseGrid";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <CaseGrid />
      <Footer />
    </div>
  );
};

export default Index;