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
          className={`flex-shrink-0 w-40 h-40 mx-1 rounded-lg ${
            !isSpinning && finalItem?.id === item.id
              ? "bg-accent"
              : "bg-card"
          } backdrop-blur-sm border border-accent/20`}
          initial={!isSpinning && { scale: 0.8, opacity: 0 }}
          animate={!isSpinning && { scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col h-full relative rounded-lg p-2">
            <div className="flex-1 flex items-center justify-center">
              <img 
                src={item.image}
                alt={item.name}
                className="max-w-full max-h-[80px] object-contain"
                style={{ imageRendering: 'crisp-edges' }}
              />
            </div>
            <div className="mt-2 text-center">
              <h3 className="text-sm font-semibold truncate w-full">
                {item.name}
              </h3>
              <p className="text-lg font-bold text-primary">
                {item.multiplier}x
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};