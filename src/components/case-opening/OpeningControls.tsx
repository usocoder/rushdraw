import { Button } from "@/components/ui/button";
import { Swords } from "lucide-react";

interface OpeningControlsProps {
  onSoloOpen: () => void;
  onBattleMode: () => void;
}

export const OpeningControls = ({ onSoloOpen, onBattleMode }: OpeningControlsProps) => {
  return (
    <div className="flex justify-center gap-4">
      <Button onClick={onSoloOpen} className="w-full">
        Solo Open
      </Button>
      <Button 
        onClick={onBattleMode} 
        variant="secondary"
        className="w-full flex items-center gap-2"
      >
        <Swords className="h-4 w-4" />
        Battle
      </Button>
    </div>
  );
};