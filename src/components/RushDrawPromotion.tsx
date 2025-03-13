
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { CaseOpeningModal } from "./CaseOpeningModal";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { RegisterModal } from "./RegisterModal";

export const RushDrawPromotion = () => {
  const [isOpeningCase, setIsOpeningCase] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useBrowserAuth();

  // Sample Mystery RushDraw Case data
  const mysteryCase = {
    id: "rushdraw-mystery",
    name: "Mystery RushDraw Case",
    price: 500,
    image: "https://placehold.co/600x600/3a0ca3/e0e0e0?text=Mystery+Case",
    bestDrop: "Win up to 100,000x",
    category: "premium",
    items: [
      {
        id: "mystery-legendary",
        name: "Legendary Mystery Item",
        value: 500000,
        multiplier: 1000,
        odds: 0.01,
        rarity: "legendary",
        image: "https://placehold.co/200x200/ffd700/000000?text=Legendary"
      },
      {
        id: "mystery-epic",
        name: "Epic Mystery Item",
        value: 50000,
        multiplier: 100,
        odds: 0.05,
        rarity: "epic",
        image: "https://placehold.co/200x200/9900ff/ffffff?text=Epic"
      },
      {
        id: "mystery-rare",
        name: "Rare Mystery Item",
        value: 5000,
        multiplier: 10,
        odds: 0.15,
        rarity: "rare",
        image: "https://placehold.co/200x200/0070dd/ffffff?text=Rare"
      },
      {
        id: "mystery-uncommon",
        name: "Uncommon Mystery Item",
        value: 1000,
        multiplier: 2,
        odds: 0.30,
        rarity: "uncommon",
        image: "https://placehold.co/200x200/1eff00/000000?text=Uncommon"
      },
      {
        id: "mystery-common",
        name: "Common Mystery Item",
        value: 250,
        multiplier: 0.5,
        odds: 0.49,
        rarity: "common",
        image: "https://placehold.co/200x200/ffffff/000000?text=Common"
      }
    ]
  };

  const handleOpenCase = () => {
    if (!user) {
      setShowRegister(true);
    } else {
      setIsOpeningCase(true);
    }
  };

  return (
    <section className="py-12 px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 z-0"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto relative z-10"
      >
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-full md:w-1/2 lg:w-2/5"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={mysteryCase.image} 
                alt="Mystery RushDraw Case" 
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                <div className="animate-pulse flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">RushDraw Exclusive</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Mystery RushDraw Case</h2>
                <p className="text-white/80 mb-3">${mysteryCase.price}</p>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-md px-3 py-2 mb-4">
                  <p className="text-yellow-400 text-sm font-medium">Win up to 100,000x your bet!</p>
                </div>
              </div>
            </div>
          </motion.div>
          
          <div className="w-full md:w-1/2 lg:w-3/5 space-y-4">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="h-4 w-4 text-primary mr-2" />
              <span className="text-sm font-medium">Special Promotion</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">
              Open Your Mystery <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">RushDraw Case</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Experience the thrill of our exclusive RushDraw technology! This special case contains premium items with incredible multipliers up to 100,000x your opening amount.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span>Exclusive to RushDraw technology</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span>Highest potential rewards on the platform</span>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-0.5 rounded-full bg-primary/20 p-1">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <span>Provably fair algorithm guarantees transparency</span>
              </li>
            </ul>
            <div className="pt-4">
              <Button 
                size="lg" 
                onClick={handleOpenCase}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-6 text-lg shadow-glow-md"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Open Mystery Case
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <CaseOpeningModal
        isOpen={isOpeningCase}
        onOpenChange={setIsOpeningCase}
        caseData={mysteryCase}
        isFreePlay={false}
      />

      <RegisterModal
        isOpen={showRegister}
        onOpenChange={setShowRegister}
      />
    </section>
  );
};
