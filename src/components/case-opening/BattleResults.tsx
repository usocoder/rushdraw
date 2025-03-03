
import { CaseItem } from "@/types/case";
import { toast } from "../ui/use-toast";
import { useEffect } from "react";
import { Trophy, Crown, Shield, Star } from "lucide-react";
import { motion } from "framer-motion";

interface BattleResultsProps {
  winner: { player: string; item: CaseItem } | null;
  isFreePlay: boolean;
  casePrice: number;
  onWin: (amount: number) => Promise<void>;
  opponents: string[];
}

export const BattleResults = ({ winner, isFreePlay, casePrice, onWin, opponents }: BattleResultsProps) => {
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

  const playerCount = opponents.length + 1; // +1 for the user "You"
  
  // Create a list of all players for the results display
  const allPlayers = ["You", ...opponents];
  
  // Find the winner's position in the list (used for animation)
  const winnerIndex = allPlayers.findIndex(player => player === winner.player);

  return (
    <motion.div 
      className="p-6 bg-gradient-to-b from-accent/20 to-transparent rounded-lg border border-accent/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Victory Banner */}
      <motion.div 
        className="text-center mb-8"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
          className="inline-block mb-2"
        >
          {winner.player === "You" ? (
            <Crown className="h-14 w-14 text-yellow-500 drop-shadow-glow" />
          ) : (
            <Shield className="h-14 w-14 text-red-500 drop-shadow-glow" />
          )}
        </motion.div>
        
        <h2 className={`text-2xl font-bold mb-2 ${winner.player === "You" ? "text-yellow-500" : "text-red-500"}`}>
          {winner.player === "You" ? "You Won The Battle!" : `${winner.player} Won The Battle!`}
        </h2>
      </motion.div>
      
      {/* Players Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {allPlayers.map((player, index) => {
          const isWinner = player === winner.player;
          const isUser = player === "You";
          
          return (
            <motion.div
              key={player}
              className={`relative p-4 rounded-lg text-center ${
                isWinner 
                  ? "bg-gradient-to-b from-accent/30 to-accent/5 border-2 border-primary/50" 
                  : "bg-accent/10 border border-accent/10"
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index + 0.5, duration: 0.3 }}
            >
              {isWinner && (
                <motion.div 
                  className="absolute -top-3 -right-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 15, 0, -15, 0] }}
                  transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
                >
                  <Star className={`h-6 w-6 ${isUser ? "text-yellow-500" : "text-red-500"}`} />
                </motion.div>
              )}
              
              <h3 className={`font-bold text-lg ${isUser ? "text-primary" : "text-secondary"}`}>
                {player}
              </h3>
              
              {isWinner && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground">WINNING ITEM:</p>
                  <p className="font-medium">{winner.item.name}</p>
                  <p className={`text-lg font-bold ${isUser ? "text-green-500" : "text-red-500"}`}>
                    {Math.floor(effectiveMultiplier)}x
                  </p>
                </div>
              )}
              
              {isWinner && isUser && !isFreePlay && (
                <motion.p 
                  className="mt-3 text-green-500 font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  +${Math.round(casePrice * effectiveMultiplier)}
                </motion.p>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {/* Winner Item Showcase */}
      <motion.div 
        className="flex justify-center items-center mt-4"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <div className={`p-4 rounded-lg ${winner.player === "You" ? "bg-gradient-to-r from-yellow-500/10 to-transparent" : "bg-gradient-to-r from-red-500/10 to-transparent"}`}>
          <img 
            src={winner.item.image} 
            alt={winner.item.name} 
            className={`w-32 h-32 object-contain rounded-lg transition-all duration-500 ${
              winner.player === "You" ? "drop-shadow-yellow" : "drop-shadow-red"
            }`}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};
