import { motion } from "framer-motion";
import { CaseItem } from "@/types/case";
import { Trophy } from "lucide-react";

interface WinningResultProps {
  item: CaseItem;
  casePrice: number;
  isFreePlay?: boolean;
}

export const WinningResult = ({ item, casePrice, isFreePlay = false }: WinningResultProps) => {
  return (
    <motion.div
      className="mt-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-center mb-4"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20 
        }}
      >
        <div className="relative">
          <img 
            src={item.image}
            alt={item.name}
            className="w-48 h-48 object-contain rounded-lg"
          />
          {!isFreePlay && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-2 -right-2"
            >
              <Trophy className="w-8 h-8 text-yellow-500" />
            </motion.div>
          )}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-xl font-bold mb-2">
          {isFreePlay ? "You could have won: " : "You won: "}{item.name}!
        </h3>
        <p className="text-lg text-primary">
          Value: ${(casePrice * item.multiplier).toFixed(2)}
        </p>
        {isFreePlay && (
          <p className="mt-2 text-muted-foreground">
            This was just a simulation. Try opening the case for real to win!
          </p>
        )}
      </motion.div>
    </motion.div>
  );
};