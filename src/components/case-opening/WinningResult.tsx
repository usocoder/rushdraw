import { motion } from "framer-motion";
import { CaseItem } from "@/types/case";

interface WinningResultProps {
  item: CaseItem;
  casePrice: number;
}

export const WinningResult = ({ item, casePrice }: WinningResultProps) => {
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
        You won: {item.name}!
      </h3>
      <p className="text-lg text-primary">
        Value: ${(casePrice * item.multiplier).toFixed(2)}
      </p>
    </motion.div>
  );
};