import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Case } from "@/types/case";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BattleControlsProps {
  onSoloOpen: () => void;
  onBattleStart: (numOpponents: number) => void;
  isCrazyMode: boolean;
  onToggleCrazyMode: () => void;
  onCaseSelect?: (caseId: string) => void;
  selectedCases?: Case[];
}

export const BattleControls = ({
  onSoloOpen,
  onBattleStart,
  isCrazyMode,
  onToggleCrazyMode,
  onCaseSelect,
  selectedCases = []
}: BattleControlsProps) => {
  const [numOpponents, setNumOpponents] = useState(1);
  
  const { data: cases } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          case_items (*)
        `);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="case-select">Select Cases</Label>
          <Select onValueChange={(value) => onCaseSelect?.(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a case" />
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-[200px]">
                {cases?.map((case_) => (
                  <SelectItem key={case_.id} value={case_.id}>
                    {case_.name} - ${case_.price}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>

        {selectedCases.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedCases.map((case_) => (
              <div key={case_.id} className="bg-secondary/20 px-3 py-1 rounded-full text-sm">
                {case_.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="opponents">Number of Opponents</Label>
        <Select 
          value={String(numOpponents)} 
          onValueChange={(value) => setNumOpponents(Number(value))}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select opponents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1v1</SelectItem>
            <SelectItem value="2">1v1v1</SelectItem>
            <SelectItem value="3">1v1v1v1</SelectItem>
            <SelectItem value="4">2v2</SelectItem>
            <SelectItem value="6">3v3</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="crazy-mode"
          checked={isCrazyMode}
          onCheckedChange={onToggleCrazyMode}
        />
        <Label htmlFor="crazy-mode">Crazy Mode (Lose to Win)</Label>
      </div>

      <div className="flex gap-2">
        <Button 
          onClick={onSoloOpen} 
          variant="outline" 
          className="w-full"
          disabled={selectedCases.length === 0}
        >
          Solo Open
        </Button>
        <Button 
          onClick={() => onBattleStart(numOpponents)}
          className="w-full"
          disabled={selectedCases.length === 0}
        >
          Start Battle
        </Button>
      </div>
    </div>
  );
};