import { motion } from "framer-motion";
import { CaseItem } from "@/types/case";

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
      <div className="flex items-center justify-center mb-4">
        <img 
          src={item.image}
          alt={item.name}
          className="w-48 h-48 object-cover rounded-lg"
        />
      </div>
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
  );
};