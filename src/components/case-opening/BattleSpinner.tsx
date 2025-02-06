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
  const { spinItems, spinSpeed, finalItem } = useSpinningLogic(
    caseData.items,
    isSpinning,
    onSpinComplete
  );

  return (
    <div className="relative h-48 overflow-hidden rounded-lg bg-muted">
      <SpinningItems
        items={spinItems}
        isSpinning={isSpinning}
        spinSpeed={spinSpeed}
        finalItem={finalItem}
        hasRushDraw={false}
        isOpponent={isOpponent}
        playerName={playerName}
      />
    </div>
  );
};