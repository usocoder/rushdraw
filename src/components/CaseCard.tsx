
import { motion } from "framer-motion";
import { useState } from "react";
import { Case } from "../types/case";
import { CaseOpeningModal } from "./CaseOpeningModal";
import { RegisterModal } from "./RegisterModal";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";

interface CaseCardProps extends Case {}

export const CaseCard = ({ name, price, image, bestDrop, items = [], id, category }: CaseCardProps) => {
  const [isOpeningCase, setIsOpeningCase] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useBrowserAuth();
  
  const bestItem = items?.reduce((prev, current) => 
    current.multiplier > prev.multiplier ? current : prev
  , items[0]);

  const handleOpenCase = () => {
    if (!user) {
      setShowRegister(true);
    } else {
      setIsOpeningCase(true);
    }
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
          <p>Win up to 100,000x your bet</p>
        </div>
        <div className="mt-auto">
          <button 
            className="w-full bg-primary hover:bg-accent text-white font-semibold py-2 rounded-lg transition-colors duration-300"
            onClick={handleOpenCase}
          >
            Open Case
          </button>
        </div>
      </motion.div>

      <CaseOpeningModal
        isOpen={isOpeningCase}
        onOpenChange={setIsOpeningCase}
        caseData={{ id, name, price, image, bestDrop, items, category }}
        isFreePlay={false}
      />

      <RegisterModal
        isOpen={showRegister}
        onOpenChange={setShowRegister}
      />
    </>
  );
};
