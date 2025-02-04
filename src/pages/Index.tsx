import { Hero } from "@/components/Hero";
import { CaseGrid } from "@/components/CaseGrid";
import { Footer } from "@/components/Footer";
import { RewardsSection } from "@/components/RewardsSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <RewardsSection />
      <CaseGrid />
      <Footer />
    </div>
  );
};

export default Index;