import { motion } from "framer-motion";
import { CaseItem } from "@/types/case";
import { Loader, Sparkles } from "lucide-react";

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
      x: [
        0, // Start position
        -7800, // Moving
        -8000, // Final position
      ],
      transition: {
        duration: spinSpeed * 0.5, // Reduced duration
        ease: ["easeInOut", "easeOut"],
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
        {(isSpinning ? items : finalItem ? [finalItem] : items).map((item, index) => (
          <motion.div
            key={`${item.id}-${index}`}
            className={`
              flex-shrink-0 w-48 h-48 mx-1 rounded-lg
              ${!isSpinning && finalItem?.id === item.id ? "bg-accent shadow-lg scale-105" : "glass-card"}
              ${hasRushDraw && item.rarity === 'legendary' ? 'border-yellow-500 shadow-yellow-500/50' : 'border-accent/20'}
              transition-all duration-500
            `}
            initial={!isSpinning ? { scale: 0.8, opacity: 0 } : false}
            animate={!isSpinning ? { 
              scale: finalItem?.id === item.id ? 1.05 : 1,
              opacity: 1,
              y: finalItem?.id === item.id ? [0, -10, 0] : 0,
            } : undefined}
            transition={{ 
              duration: 0.8,
              y: {
                duration: 1.2,
                ease: "easeOut",
                delay: 0.2
              }
            }}
          >
            <div className="flex flex-col h-full relative p-4">
              {hasRushDraw && item.rarity === 'legendary' && (
                <>
                  <Sparkles className="absolute top-2 right-2 w-6 h-6 text-yellow-500 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-lg" />
                </>
              )}
              
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src={item.image}
                  alt={item.name}
                  className={`
                    w-32 h-32 object-contain transform transition-transform duration-500
                    ${!isSpinning && finalItem?.id === item.id ? 'scale-110' : ''}
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