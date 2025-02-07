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
      if (winner.player === "You" && !isFreePlay) {
        const winAmount = casePrice * winner.item.multiplier;
        await onWin(winAmount);
      } else if (winner.player !== "You") {
        toast({
          title: `${winner.player} won the battle!`,
          description: `With ${winner.item.name} (${winner.item.multiplier}x)`,
          variant: "destructive",
        });
      }
    };

    handleWin();
  }, [winner, isFreePlay, casePrice, onWin]);

  return null;
};