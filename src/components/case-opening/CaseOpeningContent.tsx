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
  isFreePlay: boolean;
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
  isFreePlay,
  hasRushDraw,
  onWin,
}: CaseOpeningContentProps) => {
  return (
    <>
      {!isBattleMode && finalItem && !isSpinning && (
        <WinningResult 
          item={finalItem}
          casePrice={caseData.price}
          isFreePlay={isFreePlay}
          hasRushDraw={hasRushDraw}
        />
      )}

      <BattleModalContent 
        caseData={caseData}
        isSpinning={isSpinning}
        isBattleMode={isBattleMode}
        opponents={opponents}
        battleWinner={battleWinner}
        onSpinComplete={onSpinComplete}
        isFreePlay={isFreePlay}
        casePrice={caseData.price}
        onWin={onWin}
      />
    </>
  );
};