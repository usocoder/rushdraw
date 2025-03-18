
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/Hero";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PricingSection } from "@/components/PricingSection";
import { RewardsSection } from "@/components/RewardsSection";
import { RushDrawPromotion } from "@/components/RushDrawPromotion";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useBrowserAuth();

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <FeaturesSection />
      <PricingSection />
      <RewardsSection />
      <RushDrawPromotion />
      {user && (
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Dashboard</h2>
          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
            {/* Admin link for admins only */}
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin")}
              className="border-dashed border-gray-400"
            >
              Admin Panel
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Note: The Admin Panel is only accessible to administrator accounts
          </p>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default HomePage;
