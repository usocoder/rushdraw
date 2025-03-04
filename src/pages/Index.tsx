
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { RewardsSection } from "@/components/RewardsSection";
import { CaseGrid } from "@/components/CaseGrid";

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
