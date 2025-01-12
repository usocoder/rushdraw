import { motion } from "framer-motion";
import { CaseItem } from "@/types/case";
import { Loader } from "lucide-react";

interface SpinningItemsProps {
  items: CaseItem[];
  isSpinning: boolean;
  spinSpeed: number;
  finalItem: CaseItem | null;
}

export const SpinningItems = ({ items, isSpinning, spinSpeed, finalItem }: SpinningItemsProps) => {
  if (!items.length && !finalItem) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      className="flex items-center absolute top-1/2 -translate-y-1/2"
      animate={{
        x: isSpinning ? [0, -8000] : -240,
      }}
      transition={{
        duration: isSpinning ? spinSpeed : 0.5,
        ease: isSpinning ? "linear" : "easeOut",
        repeat: isSpinning ? Infinity : 0,
      }}
    >
      {(isSpinning ? items : finalItem ? [finalItem] : []).map((item, index) => (
        <motion.div
          key={index}
          className={`flex-shrink-0 w-48 h-48 p-4 mx-2 rounded-lg ${
            !isSpinning && finalItem?.id === item.id
              ? "bg-accent"
              : "bg-card"
          } backdrop-blur-sm`}
          initial={!isSpinning && { scale: 0.8, opacity: 0 }}
          animate={!isSpinning && { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center justify-center h-full relative overflow-hidden rounded-lg">
            <div className="w-32 h-32 mb-2">
              <img 
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <h3 className="text-lg font-semibold text-center mb-1 truncate w-full">
              {item.name}
            </h3>
            <p className="text-2xl font-bold text-primary">
              {item.multiplier}x
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};