
import { Case, CaseItem } from "@/types/case";
import { BattleSpinner } from "./BattleSpinner";
import { BattleResults } from "./BattleResults";
import { AnimatePresence, motion } from "framer-motion";

interface BattleModalContentProps {
  caseData: Case;
  isSpinning: boolean;
  isBattleMode: boolean;
  opponents: string[];
  battleWinner: { player: string; item: CaseItem } | null;
  onSpinComplete: (item: CaseItem, player: string) => void;
  isFreePlay: boolean;
  casePrice: number;
  onWin: (amount: number) => Promise<void>;
}

export const BattleModalContent = ({
  caseData,
  isSpinning,
  isBattleMode,
  opponents,
  battleWinner,
  onSpinComplete,
  isFreePlay,
  casePrice,
  onWin,
}: BattleModalContentProps) => {
  if (!caseData || !caseData.items) {
    return (
      <div className="p-4 text-center">
        <p>Error loading case data</p>
      </div>
    );
  }

  // Ensure items have multiplier values by calculating them from value and case price
  const processedItems = Array.isArray(caseData.items) ? caseData.items.map(item => {
    if (item.multiplier === null || item.multiplier === undefined) {
      return {
        ...item,
        multiplier: item.value && casePrice > 0 ? item.value / casePrice : 1
      };
    }
    return item;
  }) : [];

  // Ensure at least empty arrays are initialized for the case items
  const safeCase = {
    ...caseData,
    items: processedItems.length > 0 ? processedItems : []
  };

  // Make sure opponents is an array even if there's an issue
  const safeOpponents = Array.isArray(opponents) ? opponents : [];

  return (
    <div className="p-4 sm:p-6">
      <AnimatePresence>
        <motion.div 
          className="grid grid-cols-1 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {!battleWinner && (
            <motion.div
              className="grid grid-cols-1 gap-4 md:gap-6"
              initial={{ scale: 0.98 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-6 w-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-r shadow-glow-sm"></div>
                <div className="bg-gradient-to-r from-accent/20 to-transparent p-1 rounded-lg">
                  <BattleSpinner
                    caseData={safeCase}
                    isSpinning={isSpinning}
                    onSpinComplete={(item) => onSpinComplete(item, "You")}
                    playerName="You"
                  />
                </div>
              </div>

              {isBattleMode && safeOpponents.map((opponent, index) => (
                <motion.div 
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                >
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-6 w-2 bg-gradient-to-r from-red-500 to-orange-500 rounded-r shadow-glow-sm"></div>
                  <div className="bg-gradient-to-r from-accent/10 to-transparent p-1 rounded-lg">
                    <BattleSpinner
                      key={index}
                      caseData={safeCase}
                      isSpinning={isSpinning}
                      onSpinComplete={(item) => onSpinComplete(item, opponent)}
                      playerName={opponent}
                      isOpponent
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          <AnimatePresence>
            {battleWinner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <BattleResults
                  winner={battleWinner}
                  isFreePlay={isFreePlay}
                  casePrice={casePrice}
                  onWin={onWin}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
