import { motion } from "framer-motion";
import { CaseItem } from "@/types/case";
import { Trophy, Sparkles } from "lucide-react";

interface WinningResultProps {
  item: CaseItem;
  casePrice: number;
  hasRushDraw?: boolean;
  isCrazyMode?: boolean;
}

export const WinningResult = ({ 
  item, 
  hasRushDraw = false,
  isCrazyMode = false 
}: WinningResultProps) => {
  const displayValue = isCrazyMode ? -item.value : item.value;
  
  return (
    <motion.div
      className="mt-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <motion.div 
        className="flex items-center justify-center mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.3
        }}
      >
        <div className="relative">
          <img 
            src={item.image}
            alt={item.name}
            className={`w-48 h-48 object-contain rounded-lg ${
              hasRushDraw && item.rarity === 'legendary' 
                ? 'ring-4 ring-yellow-500 ring-opacity-50' 
                : ''
            }`}
          />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-2 -right-2"
          >
            {hasRushDraw && item.rarity === 'legendary' ? (
              <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
            ) : (
              <Trophy className="w-8 h-8 text-yellow-500" />
            )}
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-2xl font-bold text-primary"
      >
        ${displayValue.toFixed(2)}
      </motion.div>
    </motion.div>
  );
};