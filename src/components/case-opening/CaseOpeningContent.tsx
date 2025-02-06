import { Case, CaseItem } from "@/types/case";
import { WinningResult } from "./WinningResult";
import { BattleModalContent } from "./BattleModalContent";

interface CaseOpeningContentProps {
  caseData: Case;
  isSpinning: boolean;
  isBattleMode: boolean;
  finalItem: CaseItem | null;
  opponents: string[];
  battleWinner: { player: string; item: CaseItem } | null;
  onSpinComplete: (item: CaseItem, player: string) => void;
  hasRushDraw: boolean;
  onWin: (amount: number) => Promise<void>;
}

export const CaseOpeningContent = ({
  caseData,
  isSpinning,
  isBattleMode,
  finalItem,
  opponents,
  battleWinner,
  onSpinComplete,
  hasRushDraw,
  onWin,
}: CaseOpeningContentProps) => {
  return (
    <>
      <BattleModalContent 
        caseData={caseData}
        isSpinning={isSpinning}
        isBattleMode={isBattleMode}
        opponents={opponents}
        battleWinner={battleWinner}
        onSpinComplete={onSpinComplete}
        casePrice={caseData.price}
        onWin={onWin}
      />

      {!isBattleMode && finalItem && !isSpinning && (
        <WinningResult 
          item={finalItem}
          casePrice={caseData.price}
          hasRushDraw={hasRushDraw}
        />
      )}
    </>
  );
};