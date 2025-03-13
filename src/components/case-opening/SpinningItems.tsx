
import { motion, AnimatePresence } from "framer-motion";
import { CaseItem } from "@/types/case";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useRef, useState } from "react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translateY(0px)");
  
  const itemSize = isMobile ? "h-40" : "h-48";
  const imageSize = isMobile ? "w-24 h-24" : "w-32 h-32";
  const containerSize = isMobile ? "h-40" : "h-48";

  useEffect(() => {
    // Apply transform directly using a state to ensure React handles the updates
    if (typeof rotation === 'number') {
      setTransform(`translateY(${rotation}px)`);
    }
  }, [rotation]);

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
      
      {/* Center position indicator with bigger, more visible pointer */}
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-primary z-20">
        <div className="absolute -left-1.5 top-0 w-4 h-4 bg-primary rotate-45 shadow-glow-sm" />
        <div className="absolute -left-1.5 bottom-0 w-4 h-4 bg-primary rotate-45 shadow-glow-sm" />
      </div>

      {/* Enhanced gradient fade effect on top and bottom */}
      <div className="absolute inset-0 pointer-events-none z-10">
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-background to-transparent" />
      </div>

      {/* Spinner content with hardware acceleration hints */}
      <div 
        ref={containerRef} 
        className="items-wrapper absolute w-full will-change-transform"
        style={{ 
          transform: transform,
          transition: isSpinning 
            ? 'transform 5s cubic-bezier(0.19, 0.82, 0.165, 1)' // Improved easing function
            : 'transform 0.3s ease-out',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          WebkitFontSmoothing: 'subpixel-antialiased'
        }}
      >
        {items.map((item, index) => (
          <div
            key={`${item?.id || index}-${index}`}
            className={`
              w-full ${itemSize} p-2 flex
              ${isRevealing && finalItem?.id === item?.id ? "bg-accent/30 border-primary animate-pulse" : 
                !isSpinning && finalItem?.id === item?.id ? "bg-accent/10" : "bg-accent/5"}
              border ${isRevealing && finalItem?.id === item?.id ? "border-primary shadow-glow-sm" : "border-accent/20"} 
              rounded-lg transition-colors duration-300
            `}
          >
            <div className="flex flex-row w-full h-full items-center justify-between">
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src={item?.image || item?.image_url || "/placeholder.svg"}
                  alt={item?.name || "Loading..."}
                  className={`
                    ${imageSize} object-contain transition-all duration-300
                    ${isRevealing && finalItem?.id === item?.id ? 'scale-110 animate-pulse' : 
                      !isSpinning && finalItem?.id === item?.id ? 'scale-105' : ''}
                  `}
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              
              <div className="flex-1 text-center">
                <h3 className="text-xs sm:text-sm font-semibold truncate">
                  {item?.name || "Loading..."}
                </h3>
                <p className={`text-base sm:text-lg font-bold ${
                  item?.rarity === 'legendary' ? 'text-yellow-500' : 
                  item?.rarity === 'rare' ? 'text-blue-500' : 
                  item?.rarity === 'epic' ? 'text-purple-500' : 'text-primary'
                }`}>
                  {/* Format the multiplier value for display */}
                  {item?.multiplier ? Math.floor(item.multiplier) : 
                   item?.value ? Math.floor(item.value / 100) : 0}x
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
