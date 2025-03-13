
import { useState } from "react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { useNavigate } from "react-router-dom";
import { Download, ArrowRight, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const RushDrawPromotion = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { user } = useBrowserAuth();
  const navigate = useNavigate();

  const handleNavigateToRewards = () => {
    navigate("/daily-rewards");
  };

  return (
    <div className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/80">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Open your mystery <span className="text-primary">RushDraw</span> Case
              </h2>
              <p className="text-xl text-gray-400">
                Win up to 100,000 times your opening amount with our exclusive cases
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleNavigateToRewards}
                >
                  <Gift className="mr-2 h-5 w-5" />
                  Claim Daily Rewards
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="group"
                  asChild
                >
                  <a href="/rushdrawapp.exe" download>
                    <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                    Download Desktop App
                  </a>
                </Button>
              </div>
            </motion.div>
            
            <div className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Trophy className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Daily Rewards</h3>
                  <p className="text-gray-400">Claim free cases and coins every day based on your level</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Gift className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Premium Prizes</h3>
                  <p className="text-gray-400">Win exclusive items from our curated collection of high-value rewards</p>
                </div>
              </div>
              
              <motion.button
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
                className="flex items-center text-primary hover:text-primary/80 font-medium"
                onClick={handleNavigateToRewards}
              >
                Explore all rewards
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.div>
              </motion.button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full max-w-md"
            >
              <div className="relative">
                <div className="glass-card p-6 rounded-xl border border-primary/20 shadow-lg shadow-primary/10 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">RushDraw Mystery Case</h3>
                    <span className="bg-primary px-3 py-1 rounded-full text-sm font-semibold">Exclusive</span>
                  </div>
                  <div className="relative aspect-square mb-6 overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-5xl font-extrabold text-primary/80">?</div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Win multiplier:</span>
                      <span className="text-primary font-semibold">Up to 100,000x</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Legendary odds:</span>
                      <span className="text-amber-500 font-semibold">0.01%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Epic odds:</span>
                      <span className="text-purple-500 font-semibold">0.5%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Rare odds:</span>
                      <span className="text-blue-500 font-semibold">5%</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-6 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    onClick={handleNavigateToRewards}
                  >
                    Get Started
                  </Button>
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-accent/50 opacity-20 blur-xl rounded-xl"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};
