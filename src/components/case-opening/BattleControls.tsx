import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface BattleControlsProps {
  onSoloOpen: () => void;
  onBattleStart: (opponents: number) => void;
}

export const BattleControls = ({ onSoloOpen, onBattleStart }: BattleControlsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Button onClick={onSoloOpen}>
        Solo Open
      </Button>
      <Button onClick={() => onBattleStart(1)}>
        <Users className="mr-2 h-4 w-4" />
        1v1 Battle
      </Button>
    </div>
  );
};