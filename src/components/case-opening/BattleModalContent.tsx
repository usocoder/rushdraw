
import { Case, CaseItem } from "@/types/case";
import { BattleSpinner } from "./BattleSpinner";
import { BattleResults } from "./BattleResults";

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
  if (!caseData || !caseData.items || caseData.items.length === 0) {
    return (
      <div className="p-4 text-center">
        <p>Error loading case data</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4">
        <BattleSpinner
          caseData={caseData}
          isSpinning={isSpinning}
          onSpinComplete={(item) => onSpinComplete(item, "You")}
          playerName="You"
        />

        {isBattleMode && opponents.map((opponent, index) => (
          <BattleSpinner
            key={index}
            caseData={caseData}
            isSpinning={isSpinning}
            onSpinComplete={(item) => onSpinComplete(item, opponent)}
            playerName={opponent}
            isOpponent
          />
        ))}
      </div>

      <BattleResults
        winner={battleWinner}
        isFreePlay={isFreePlay}
        casePrice={casePrice}
        onWin={onWin}
      />
    </div>
  );
};
