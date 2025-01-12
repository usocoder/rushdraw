import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Case, CaseItem } from "../types/case";
import { useBalance } from "@/contexts/BalanceContext";
import { useToast } from "./ui/use-toast";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { Button } from "./ui/button";
import { Users } from "lucide-react";

interface CaseOpeningModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case;
}

export const CaseOpeningModal = ({
  isOpen,
  onOpenChange,
  caseData,
}: CaseOpeningModalProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentItems, setCurrentItems] = useState<CaseItem[]>([]);
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);
  const [spinSpeed, setSpinSpeed] = useState(20);
  const { balance, createTransaction } = useBalance();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [opponents, setOpponents] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (!user) {
        toast({
          title: "Registration required",
          description: "Please register to open cases",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }
      
      if (balance < caseData.price) {
        toast({
          title: "Insufficient balance",
          description: "Please deposit more funds to open this case",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }
    } else {
      setIsSpinning(false);
      setFinalItem(null);
      setSpinSpeed(20);
      setIsBattleMode(false);
      setOpponents([]);
    }
  }, [isOpen, balance, caseData.price, user]);

  const startSpinning = async () => {
    const success = await createTransaction('case_open', caseData.price);
    if (!success) {
      onOpenChange(false);
      return;
    }

    setIsSpinning(true);
    
    // Generate more items for longer anticipation
    const spinningItems = Array(200)
      .fill(null)
      .map(() => caseData.items[Math.floor(Math.random() * caseData.items.length)]);
    setCurrentItems(spinningItems);

    // Enhanced spinning animation sequence
    setTimeout(() => setSpinSpeed(15), 1000);
    setTimeout(() => setSpinSpeed(10), 2000);
    setTimeout(() => setSpinSpeed(5), 3000);
    setTimeout(() => setSpinSpeed(3), 4000);
    setTimeout(() => setSpinSpeed(2), 5000);
    setTimeout(() => setSpinSpeed(1), 6000);
    
    // Final slowdown for maximum anticipation
    setTimeout(() => {
      setIsSpinning(false);
      const random = Math.random();
      let cumulative = 0;
      const winner = caseData.items.find((item) => {
        cumulative += item.odds;
        return random <= cumulative;
      }) || caseData.items[0];
      setFinalItem(winner);

      // Battle mode results
      if (isBattleMode) {
        const opponentResults = opponents.map(() => {
          const opponentRandom = Math.random();
          let opponentCumulative = 0;
          return caseData.items.find((item) => {
            opponentCumulative += item.odds;
            return opponentRandom <= opponentCumulative;
          }) || caseData.items[0];
        });

        // Compare results
        const results = [
          { player: user.username, value: winner.value },
          ...opponents.map((opponent, index) => ({
            player: opponent,
            value: opponentResults[index].value
          }))
        ].sort((a, b) => b.value - a.value);

        toast({
          title: "Battle Results",
          description: `Winner: ${results[0].player} with $${results[0].value.toFixed(2)}!`,
        });
      }
    }, 7000);
  };

  const startBattle = (numOpponents: number) => {
    // Generate bot opponents
    const botNames = ["Bot_Alpha", "Bot_Beta", "Bot_Gamma", "Bot_Delta"];
    setOpponents(botNames.slice(0, numOpponents));
    setIsBattleMode(true);
    startSpinning();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-accent">
        <DialogTitle className="text-2xl font-bold text-center">{caseData.name}</DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          {isBattleMode ? "Battle Mode" : "Opening your case..."}
        </DialogDescription>
        
        {!isSpinning && !finalItem && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button onClick={() => startSpinning()}>
              Solo Open
            </Button>
            <Button onClick={() => startBattle(1)}>
              <Users className="mr-2 h-4 w-4" />
              1v1 Battle
            </Button>
          </div>
        )}

        <div className="p-6">
          <div className="relative h-48 overflow-hidden rounded-lg bg-muted">
            {/* Center marker */}
            <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-primary -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-primary rotate-45"></div>
              <div className="absolute bottom-0 left-1/2 w-4 h-4 -translate-x-1/2 translate-y-1/2 bg-primary rotate-45"></div>
            </div>
            
            {/* Items container */}
            <motion.div
              className="flex items-center absolute top-1/2 -translate-y-1/2"
              animate={{
                x: isSpinning ? [0, -8000] : -240,
              }}
              transition={{
                duration: isSpinning ? spinSpeed : 0.5,
                ease: isSpinning ? "linear" : "easeOut",
                repeat: isSpinning ? Infinity : 0,
              }}
            >
              {(isSpinning ? currentItems : finalItem ? [finalItem] : []).map((item, index) => (
                <motion.div
                  key={index}
                  className={`flex-shrink-0 w-48 h-48 p-4 mx-2 rounded-lg ${
                    !isSpinning && finalItem?.id === item.id
                      ? "bg-accent"
                      : "bg-card"
                  }`}
                  initial={!isSpinning && { scale: 0.8, opacity: 0 }}
                  animate={!isSpinning && { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="relative w-full h-32 mb-2">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-1">{item.name}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {item.multiplier}x
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${(caseData.price * item.multiplier).toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {finalItem && !isSpinning && (
            <motion.div
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-center mb-4">
                <img 
                  src={finalItem.image}
                  alt={finalItem.name}
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">
                You won: {finalItem.name}!
              </h3>
              <p className="text-lg text-primary">
                Value: ${(caseData.price * finalItem.multiplier).toFixed(2)}
              </p>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};