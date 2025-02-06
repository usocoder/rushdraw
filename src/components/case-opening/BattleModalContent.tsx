import { Case, CaseItem } from "@/types/case";
import { BattleSpinner } from "./BattleSpinner";
import { BattleResults } from "./BattleResults";
import { useIsMobile } from "@/hooks/use-mobile";

interface BattleModalContentProps {
  caseData: Case;
  isSpinning: boolean;
  isBattleMode: boolean;
  opponents: string[];
  battleWinner: { player: string; item: CaseItem } | null;
  onSpinComplete: (item: CaseItem, player: string) => void;
  casePrice: number;
  onWin: (amount: number) => Promise<void>;
  isCrazyMode?: boolean;
}

export const BattleModalContent = ({
  caseData,
  isSpinning,
  isBattleMode,
  opponents,
  battleWinner,
  onSpinComplete,
  casePrice,
  onWin,
  isCrazyMode = false,
}: BattleModalContentProps) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`
      p-4 sm:p-6 
      ${isBattleMode ? 'max-h-[80vh] overflow-y-auto' : ''}
    `}>
      <div className={`
        grid grid-cols-1 gap-4
        ${isBattleMode ? 'scale-[0.85] origin-top transform' : ''}
      `}>
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
        casePrice={casePrice}
        onWin={onWin}
      />
    </div>
  );
};