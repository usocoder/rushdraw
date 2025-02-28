
import { Case, CaseItem } from "@/types/case";
import { SpinningItems } from "./SpinningItems";
import { useSpinningLogic } from "./SpinningLogic";
import { useEffect } from "react";

interface BattleSpinnerProps {
  caseData: Case;
  isSpinning: boolean;
  onSpinComplete: (item: CaseItem) => void;
  playerName: string;
  isOpponent?: boolean;
}

export const BattleSpinner = ({ 
  caseData, 
  isSpinning, 
  onSpinComplete,
  playerName,
  isOpponent
}: BattleSpinnerProps) => {
  const { spinItems, rotation, finalItem, isRevealing, gameData } = useSpinningLogic(
    caseData.items,
    isSpinning,
    (item) => {
      console.log(`Spin complete for ${playerName}:`, item);
      console.log('Provably fair data:', gameData);
      onSpinComplete(item);
    }
  );

  // Make sure we have items to display - fallback to caseData items if spinItems is empty
  const displayItems = spinItems && spinItems.length > 0 
    ? spinItems 
    : caseData.items && caseData.items.length > 0 
      ? Array(20).fill(null).map(() => caseData.items[Math.floor(Math.random() * caseData.items.length)])
      : [];

  // If we're playing as an opponent, add a delay to simulate realistic battle behavior
  useEffect(() => {
    if (isOpponent && finalItem) {
      const randomDelay = Math.random() * 500 + 200; // 200-700ms random delay
      const timeout = setTimeout(() => {
        onSpinComplete(finalItem);
      }, randomDelay);
      
      return () => clearTimeout(timeout);
    }
  }, [finalItem, isOpponent, onSpinComplete]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-muted">
      <SpinningItems
        items={displayItems}
        isSpinning={isSpinning}
        rotation={rotation}
        finalItem={finalItem}
        hasRushDraw={false}
        isOpponent={isOpponent}
        playerName={playerName}
        isRevealing={isRevealing}
      />
      
      {gameData && (
        <div className="hidden">
          {/* This div stores provably fair data for verification, not displayed */}
          <span data-client-seed={gameData.clientSeed}></span>
          <span data-server-seed={gameData.serverSeed}></span>
          <span data-nonce={gameData.nonce}></span>
          <span data-roll={gameData.roll}></span>
        </div>
      )}
    </div>
  );
};
