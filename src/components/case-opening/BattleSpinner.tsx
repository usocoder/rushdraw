
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

  return (
    <div className="relative overflow-hidden rounded-lg bg-muted">
      <SpinningItems
        items={spinItems}
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
