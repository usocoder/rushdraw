
import { CaseItem } from "@/types/case";
import { toast } from "../ui/use-toast";
import { useEffect } from "react";

interface BattleResultsProps {
  winner: { player: string; item: CaseItem } | null;
  isFreePlay: boolean;
  casePrice: number;
  onWin: (amount: number) => Promise<void>;
}

export const BattleResults = ({ winner, isFreePlay, casePrice, onWin }: BattleResultsProps) => {
  useEffect(() => {
    if (!winner) return;

    const handleWin = async () => {
      // Calculate multiplier if it's null by using the item value and case price
      const effectiveMultiplier = winner.item.multiplier || 
        (winner.item.value && casePrice > 0 ? winner.item.value / casePrice : 1);
      
      if (winner.player === "You" && !isFreePlay) {
        const winAmount = casePrice * effectiveMultiplier;
        console.log(`Win calculation: ${casePrice} × ${effectiveMultiplier} = ${winAmount}`);
        await onWin(winAmount);
      } else if (winner.player !== "You") {
        toast({
          title: `${winner.player} won the battle!`,
          description: `With ${winner.item.name} (${effectiveMultiplier.toFixed(2)}x)`,
          variant: "destructive",
        });
      }
    };

    handleWin();
  }, [winner, isFreePlay, casePrice, onWin]);

  return null;
};
