
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
  if (!caseData || !caseData.items) {
    return (
      <div className="p-4 text-center">
        <p>Error loading case data</p>
      </div>
    );
  }

  // Ensure at least empty arrays are initialized for the case items
  const safeCase = {
    ...caseData,
    items: Array.isArray(caseData.items) ? caseData.items : []
  };

  // Make sure opponents is an array even if there's an issue
  const safeOpponents = Array.isArray(opponents) ? opponents : [];

  return (
    <div className="p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4">
        <BattleSpinner
          caseData={safeCase}
          isSpinning={isSpinning}
          onSpinComplete={(item) => onSpinComplete(item, "You")}
          playerName="You"
        />

        {isBattleMode && safeOpponents.map((opponent, index) => (
          <BattleSpinner
            key={index}
            caseData={safeCase}
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
