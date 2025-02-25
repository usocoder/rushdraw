
import { motion, AnimatePresence } from "framer-motion";
import { CaseItem } from "@/types/case";
import { useIsMobile } from "@/hooks/use-mobile";

interface SpinningItemsProps {
  items: CaseItem[];
  isSpinning: boolean;
  rotation: number;
  finalItem: CaseItem | null;
  hasRushDraw?: boolean;
  isOpponent?: boolean;
  playerName?: string;
  isRevealing?: boolean;
}

export const SpinningItems = ({ 
  items, 
  isSpinning, 
  rotation,
  finalItem, 
  hasRushDraw, 
  isOpponent,
  playerName,
  isRevealing
}: SpinningItemsProps) => {
  const isMobile = useIsMobile();
  
  const itemSize = isMobile ? "w-40 h-40" : "w-48 h-48";
  const imageSize = isMobile ? "w-24 h-24" : "w-32 h-32";
  const containerSize = isMobile ? "h-40" : "h-48";

  return (
    <div className={`relative w-full ${containerSize} overflow-hidden bg-background rounded-lg`}>
      {playerName && (
        <div className="absolute top-2 left-2 z-20 bg-background/80 px-2 py-1 rounded-md text-sm">
          {playerName}
        </div>
      )}
      
      {/* Center marker */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary z-20">
        <div className="absolute -left-1 top-0 w-2 h-2 bg-primary rotate-45" />
        <div className="absolute -left-1 bottom-0 w-2 h-2 bg-primary rotate-45" />
      </div>

      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          className="flex items-center absolute top-1/2 left-0 h-full"
          style={{
            x: rotation,
            width: `${items.length * 100}%`,
          }}
          initial={false}
          transition={{
            duration: isSpinning ? 5 : 0,
            ease: [0.25, 0.1, 0.25, 1], // Smooth easing function
            type: 'spring',
            damping: 50,
            stiffness: 100,
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              className={`
                flex-shrink-0 ${itemSize} p-2
                ${!isSpinning && finalItem?.id === item.id ? "bg-accent/10" : "bg-accent/5"}
                border border-accent/20 mx-1 rounded-lg
              `}
              style={{
                opacity: isRevealing && finalItem?.id !== item.id ? 0.5 : 1,
                filter: isRevealing && finalItem?.id !== item.id ? "blur(2px)" : "none",
                transition: "filter 0.3s, opacity 0.3s",
              }}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex-1 flex items-center justify-center">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className={`
                      ${imageSize} object-contain
                      ${!isSpinning && finalItem?.id === item.id ? 'scale-105 animate-pulse' : ''}
                      transition-transform duration-300
                    `}
                    loading="eager"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                </div>
                
                <div className="text-center mt-2">
                  <h3 className="text-xs sm:text-sm font-semibold truncate">
                    {item.name}
                  </h3>
                  <p className={`text-base sm:text-lg font-bold ${
                    item.rarity === 'legendary' ? 'text-yellow-500' : 'text-primary'
                  }`}>
                    {item.multiplier}x
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
