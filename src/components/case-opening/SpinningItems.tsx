import { motion, AnimatePresence } from "framer-motion";
import { CaseItem } from "@/types/case";
import { useIsMobile } from "@/hooks/use-mobile";

interface SpinningItemsProps {
  items: CaseItem[];
  isSpinning: boolean;
  spinSpeed: number;
  finalItem: CaseItem | null;
  hasRushDraw?: boolean;
  isOpponent?: boolean;
  playerName?: string;
  isRevealing?: boolean;
}

export const SpinningItems = ({ 
  items, 
  isSpinning, 
  spinSpeed, 
  finalItem, 
  hasRushDraw, 
  isOpponent,
  playerName,
  isRevealing
}: SpinningItemsProps) => {
  const isMobile = useIsMobile();
  
  const getSpinningAnimation = () => {
    if (!isSpinning) return {};

    const itemWidth = isMobile ? 160 : 200;
    const containerWidth = window.innerWidth;
    const centerPosition = (containerWidth / 2) - (itemWidth / 2);
    const finalPosition = -((items.length - 1) * itemWidth);
    const adjustedPosition = finalPosition + centerPosition;

    return {
      x: [0, adjustedPosition],
      transition: {
        duration: spinSpeed * 0.5,
        ease: isRevealing ? "easeOut" : "linear",
        times: [0, 1],
      }
    };
  };

  const itemSize = isMobile ? "w-40 h-40" : "w-48 h-48";
  const imageSize = isMobile ? "w-24 h-24" : "w-32 h-32";

  return (
    <div className="relative w-full h-full overflow-hidden">
      {playerName && (
        <div className="absolute top-2 left-2 z-20 bg-background/80 px-2 py-1 rounded-md text-sm">
          {playerName}
        </div>
      )}
      
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-primary z-20">
        <div className="absolute -left-1 top-0 w-2 h-2 bg-primary rotate-45" />
        <div className="absolute -left-1 bottom-0 w-2 h-2 bg-primary rotate-45" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          className="flex items-center absolute top-1/2 -translate-y-1/2"
          animate={getSpinningAnimation()}
          initial={{ x: 0 }}
          style={{
            willChange: 'transform',
            translateY: '-50%',
          }}
        >
          {items.map((item, index) => (
            <motion.div
              key={`${item.id}-${index}`}
              className={`
                flex-shrink-0 ${itemSize} mx-1 rounded-lg
                ${!isSpinning && finalItem?.id === item.id ? "bg-accent/10" : "bg-accent/5"}
                border border-accent/20
              `}
            >
              <div className="flex flex-col h-full relative p-4">
                <div className="flex-1 flex items-center justify-center">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className={`
                      ${imageSize} object-contain
                      ${!isSpinning && finalItem?.id === item.id ? 'scale-105' : ''}
                    `}
                    loading="eager"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                </div>
                
                <div className="mt-2 text-center">
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