import { motion } from "framer-motion";
import { CaseItem } from "@/types/case";
import { Loader } from "lucide-react";

interface SpinningItemsProps {
  items: CaseItem[];
  isSpinning: boolean;
  spinSpeed: number;
  finalItem: CaseItem | null;
  hasRushDraw?: boolean;
}

export const SpinningItems = ({ items, isSpinning, spinSpeed, finalItem, hasRushDraw }: SpinningItemsProps) => {
  if (!items.length && !finalItem) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getSpinningAnimation = () => {
    if (!isSpinning) return {};

    return {
      x: [0, -7800, -8000],
      transition: {
        duration: spinSpeed * 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        times: [0, 0.9, 1],
      }
    };
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Gradient overlays for smooth fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-muted to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-muted to-transparent pointer-events-none" />
      
      {/* Center line indicator */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary z-20">
        <div className="absolute -left-1 top-0 w-2 h-2 bg-primary rotate-45" />
        <div className="absolute -left-1 bottom-0 w-2 h-2 bg-primary rotate-45" />
      </div>

      <motion.div
        className="flex items-center absolute top-1/2 -translate-y-1/2"
        animate={getSpinningAnimation()}
        initial={false}
        style={{
          willChange: 'transform',
          x: isSpinning ? 0 : -240,
          translateY: '-50%',
        }}
      >
        {items.map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            className={`
              flex-shrink-0 w-48 h-48 mx-1 rounded-lg
              ${!isSpinning && finalItem?.id === item.id ? "bg-accent/10" : "bg-accent/5"}
              border border-accent/20
              transition-all duration-700
            `}
            initial={!isSpinning ? { scale: 0.95, opacity: 0.5 } : false}
            animate={!isSpinning ? { 
              scale: finalItem?.id === item.id ? 1 : 0.95,
              opacity: finalItem?.id === item.id ? 1 : 0.5,
              x: finalItem?.id === item.id ? 0 : 0
            } : undefined}
            transition={{ 
              duration: 0.7,
              ease: "easeOut"
            }}
          >
            <div className="flex flex-col h-full relative p-4">
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src={item.image}
                  alt={item.name}
                  className={`
                    w-32 h-32 object-contain transform transition-transform duration-700
                    ${!isSpinning && finalItem?.id === item.id ? 'scale-105' : ''}
                  `}
                  loading="eager"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
              
              <div className="mt-2 text-center relative z-10">
                <h3 className="text-sm font-semibold truncate">
                  {item.name}
                </h3>
                <p className={`text-lg font-bold ${
                  item.rarity === 'legendary' ? 'text-yellow-500' : 'text-primary'
                }`}>
                  {item.multiplier}x
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};