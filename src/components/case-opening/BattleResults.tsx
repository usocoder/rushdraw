import { CaseItem } from "@/types/case";
import { toast } from "../ui/use-toast";
import { useEffect } from "react";

interface BattleResultsProps {
  winner: { player: string; item: CaseItem } | null;
  casePrice: number;
  onWin: (amount: number) => Promise<void>;
}

export const BattleResults = ({ winner, casePrice, onWin }: BattleResultsProps) => {
  useEffect(() => {
    if (!winner) return;

    const handleWin = async () => {
      if (winner.player === "You") {
        const winAmount = casePrice * winner.item.multiplier;
        await onWin(winAmount);
      } else {
        toast({
          title: `${winner.player} won the battle!`,
          description: `With ${winner.item.name} (${winner.item.multiplier}x)`,
          variant: "destructive",
        });
      }
    };

    handleWin();
  }, [winner, casePrice, onWin]);

  return null;
};