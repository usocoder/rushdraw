
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { RewardsSection } from "@/components/RewardsSection";
import { CaseGrid } from "@/components/CaseGrid";
import { RushDrawPromotion } from "@/components/RushDrawPromotion";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <RushDrawPromotion />
      <RewardsSection />
      <CaseGrid />
      <Footer />
    </div>
  );
};

export default Index;
