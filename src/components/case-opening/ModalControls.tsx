import { Case } from "@/types/case";
import { OpeningControls } from "./OpeningControls";
import { BattleControls } from "./BattleControls";

interface ModalControlsProps {
  isSpinning: boolean;
  finalItem: boolean;
  battleWinner: boolean;
  isBattleMode: boolean;
  onSoloOpen: () => void;
  onBattleMode: () => void;
  onBattleStart: (numOpponents: number) => void;
  isCrazyMode: boolean;
  onToggleCrazyMode: () => void;
}

export const ModalControls = ({
  isSpinning,
  finalItem,
  battleWinner,
  isBattleMode,
  onSoloOpen,
  onBattleMode,
  onBattleStart,
  isCrazyMode,
  onToggleCrazyMode,
}: ModalControlsProps) => {
  if (isSpinning || finalItem || battleWinner) return null;

  return (
    <div className="flex flex-col gap-4">
      <OpeningControls
        onSoloOpen={onSoloOpen}
        onBattleMode={onBattleMode}
      />
      
      {isBattleMode && (
        <BattleControls 
          onBattleStart={onBattleStart}
          onSoloOpen={onSoloOpen}
          isCrazyMode={isCrazyMode}
          onToggleCrazyMode={onToggleCrazyMode}
        />
      )}
    </div>
  );
};