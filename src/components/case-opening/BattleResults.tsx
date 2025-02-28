
import { CaseItem } from "@/types/case";
import { toast } from "../ui/use-toast";
import { useEffect } from "react";
import { Trophy } from "lucide-react";
import { motion } from "framer-motion";

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
        
        toast({
          title: `You won the battle!`,
          description: `With ${winner.item.name} (${Math.floor(effectiveMultiplier)}x)`,
          variant: "default",
        });
      } else if (winner.player !== "You") {
        toast({
          title: `${winner.player} won the battle!`,
          description: `With ${winner.item.name} (${Math.floor(effectiveMultiplier)}x)`,
          variant: "destructive",
        });
      }
    };

    handleWin();
  }, [winner, isFreePlay, casePrice, onWin]);

  if (!winner) return null;

  // Calculate multiplier for UI display
  const effectiveMultiplier = winner.item.multiplier || 
    (winner.item.value && casePrice > 0 ? winner.item.value / casePrice : 1);

  return (
    <motion.div 
      className="mt-8 p-6 bg-accent/10 rounded-lg border border-accent/20 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="inline-block mb-4"
      >
        <Trophy className="h-12 w-12 text-yellow-500 mx-auto" />
      </motion.div>
      
      <h2 className="text-2xl font-bold mb-2">
        {winner.player === "You" ? "You Won!" : `${winner.player} Won!`}
      </h2>
      
      <div className="flex justify-center items-center my-4">
        <img 
          src={winner.item.image} 
          alt={winner.item.name} 
          className="w-32 h-32 object-contain rounded-lg"
        />
      </div>
      
      <p className="text-lg">
        <span className="font-medium">{winner.item.name}</span>
      </p>
      <p className={`text-xl font-bold ${
        winner.player === "You" ? "text-green-500" : "text-red-500"
      }`}>
        {Math.floor(effectiveMultiplier)}x
      </p>
      
      {winner.player === "You" && !isFreePlay && (
        <p className="mt-4 text-green-500 font-semibold">
          You won ${Math.round(casePrice * effectiveMultiplier)}!
        </p>
      )}
    </motion.div>
  );
};
