
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

  if (!items || items.length === 0) {
    return (
      <div className={`relative w-full ${containerSize} bg-background rounded-lg flex items-center justify-center`}>
        <p className="text-muted-foreground">Loading items...</p>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${containerSize} overflow-hidden bg-background rounded-lg`}>
      {playerName && (
        <div className="absolute top-2 left-2 z-20 bg-background/80 px-2 py-1 rounded-md text-sm font-medium">
          {playerName}
        </div>
      )}
      
      {/* Center position indicator */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary z-20">
        <div className="absolute -left-1 top-0 w-2 h-2 bg-primary rotate-45" />
        <div className="absolute -left-1 bottom-0 w-2 h-2 bg-primary rotate-45" />
      </div>

      {/* Gradient fade effect on sides */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent" />
      </div>

      {/* Spinner content */}
      <AnimatePresence>
        <motion.div
          className="flex items-center absolute"
          style={{
            x: rotation,
            width: `${items.length * 100}%`,
          }}
          initial={{ x: 0 }}
          animate={{ 
            x: rotation 
          }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 30,
            duration: 5,
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={`${item?.id || index}-${index}`}
              className={`
                flex-shrink-0 ${itemSize} p-2
                ${isRevealing && finalItem?.id === item?.id ? "bg-accent/30 border-primary" : 
                  !isSpinning && finalItem?.id === item?.id ? "bg-accent/10" : "bg-accent/5"}
                border ${isRevealing && finalItem?.id === item?.id ? "border-primary" : "border-accent/20"} 
                mx-1 rounded-lg transition-colors duration-300
              `}
            >
              <div className="flex flex-col h-full justify-between">
                <div className="flex-1 flex items-center justify-center">
                  <img 
                    src={item?.image || "/placeholder.svg"}
                    alt={item?.name || "Loading..."}
                    className={`
                      ${imageSize} object-contain transition-all duration-300
                      ${isRevealing && finalItem?.id === item?.id ? 'scale-110 animate-pulse' : 
                        !isSpinning && finalItem?.id === item?.id ? 'scale-105' : ''}
                    `}
                    loading="eager"
                  />
                </div>
                
                <div className="text-center mt-2">
                  <h3 className="text-xs sm:text-sm font-semibold truncate">
                    {item?.name || "Loading..."}
                  </h3>
                  <p className={`text-base sm:text-lg font-bold ${
                    item?.rarity === 'legendary' ? 'text-yellow-500' : 
                    item?.rarity === 'rare' ? 'text-blue-500' : 
                    item?.rarity === 'epic' ? 'text-purple-500' : 'text-primary'
                  }`}>
                    {item?.multiplier || 0}x
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
