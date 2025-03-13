
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { RewardsSection } from "@/components/RewardsSection";
import { CaseGrid } from "@/components/CaseGrid";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <RewardsSection />
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-3xl font-bold text-center mb-8">All Cases</h2>
        <CaseGrid />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
