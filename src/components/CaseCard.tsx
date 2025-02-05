import { motion } from "framer-motion";
import { useState } from "react";
import { Case } from "../types/case";
import { CaseOpeningModal } from "./CaseOpeningModal";
import { RegisterModal } from "./RegisterModal";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { CaseItemsModal } from "./CaseItemsModal";
import { Box } from "lucide-react";

interface CaseCardProps extends Case {}

export const CaseCard = ({ name, price, image, bestDrop, items = [], id, category }: CaseCardProps) => {
  const [isOpeningCase, setIsOpeningCase] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [isFreePlay, setIsFreePlay] = useState(false);
  const [showItems, setShowItems] = useState(false);
  const { user } = useBrowserAuth();
  
  const bestItem = items?.reduce((prev, current) => 
    current.multiplier > prev.multiplier ? current : prev
  , items[0]);

  const handleOpenCase = () => {
    if (!user) {
      setShowRegister(true);
    } else {
      setIsFreePlay(false);
      setIsOpeningCase(true);
    }
  };

  const handleFreePlay = () => {
    setIsFreePlay(true);
    setIsOpeningCase(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="glass-card rounded-xl p-4 flex flex-col"
      >
        <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full transform transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute top-2 right-2 bg-primary px-3 py-1 rounded-full text-sm font-semibold">
            ${price}
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{name}</h3>
        <div className="text-secondary text-sm space-y-1 mb-4">
          <p>Best drop: {bestDrop}</p>
          <p>Top multiplier: {bestItem?.multiplier || 0}x</p>
          <p>Legendary odds: {(items.find(item => item.rarity === 'legendary')?.odds || 0) * 100}%</p>
        </div>
        <div className="mt-auto space-y-2">
          <button 
            className="w-full bg-primary hover:bg-accent text-white font-semibold py-2 rounded-lg transition-colors duration-300"
            onClick={handleOpenCase}
          >
            Open Case
          </button>
          <div className="grid grid-cols-2 gap-2">
            <button 
              className="w-full bg-secondary hover:bg-accent text-white font-semibold py-2 rounded-lg transition-colors duration-300"
              onClick={handleFreePlay}
            >
              Free Play
            </button>
            <button 
              className="w-full bg-secondary hover:bg-accent text-white font-semibold py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2"
              onClick={() => setShowItems(true)}
            >
              <Box className="h-4 w-4" />
              Items
            </button>
          </div>
        </div>
      </motion.div>

      <CaseOpeningModal
        isOpen={isOpeningCase}
        onOpenChange={setIsOpeningCase}
        caseData={{ id, name, price, image, bestDrop, items, category }}
        isFreePlay={isFreePlay}
      />

      <RegisterModal
        isOpen={showRegister}
        onOpenChange={setShowRegister}
      />

      <CaseItemsModal
        isOpen={showItems}
        onOpenChange={setShowItems}
        items={items}
        caseName={name}
      />
    </>
  );
};