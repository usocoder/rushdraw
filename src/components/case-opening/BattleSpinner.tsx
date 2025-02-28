
import { Case, CaseItem } from "@/types/case";
import { SpinningItems } from "./SpinningItems";
import { useSpinningLogic } from "./SpinningLogic";

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
  const { spinItems, rotation, finalItem, isRevealing } = useSpinningLogic(
    caseData.items,
    isSpinning,
    (item) => {
      console.log(`Spin complete for ${playerName}:`, item);
      onSpinComplete(item);
    }
  );

  // Make sure we have items to display - fallback to caseData items if spinItems is empty
  const displayItems = spinItems && spinItems.length > 0 
    ? spinItems 
    : caseData.items && caseData.items.length > 0 
      ? Array(20).fill(null).map(() => caseData.items[Math.floor(Math.random() * caseData.items.length)])
      : [];

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
    </div>
  );
};
