import { Button } from "@/components/ui/button";
import { Gamepad2, Swords, Users, Zap } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BattleControlsProps {
  onSoloOpen: () => void;
  onBattleStart: (opponents: number) => void;
  isCrazyMode: boolean;
  onToggleCrazyMode: () => void;
}

export const BattleControls = ({ 
  onSoloOpen, 
  onBattleStart,
  isCrazyMode,
  onToggleCrazyMode
}: BattleControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 justify-end mb-4">
        <Switch
          id="crazy-mode"
          checked={isCrazyMode}
          onCheckedChange={onToggleCrazyMode}
        />
        <Label htmlFor="crazy-mode" className="flex items-center gap-2">
          Crazy Mode <Zap className="h-4 w-4 text-yellow-500" />
        </Label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button 
          onClick={onSoloOpen}
          className="flex items-center justify-center"
          size="lg"
        >
          <Gamepad2 className="mr-2 h-4 w-4" />
          Solo Open
        </Button>
        <Button 
          onClick={() => onBattleStart(1)}
          className="flex items-center justify-center"
          size="lg"
          variant="secondary"
        >
          <Swords className="mr-2 h-4 w-4" />
          1v1 Battle
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        <Button 
          onClick={() => onBattleStart(2)}
          variant="outline"
          className="flex items-center justify-center"
        >
          <Users className="mr-2 h-4 w-4" />
          1v1v1
        </Button>
        <Button 
          onClick={() => onBattleStart(3)}
          variant="outline"
          className="flex items-center justify-center"
        >
          <Users className="mr-2 h-4 w-4" />
          2v2
        </Button>
        <Button 
          onClick={() => onBattleStart(5)}
          variant="outline"
          className="flex items-center justify-center"
        >
          <Users className="mr-2 h-4 w-4" />
          3v3
        </Button>
      </div>
    </div>
  );
};