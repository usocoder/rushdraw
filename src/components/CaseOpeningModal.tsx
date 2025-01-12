import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { useState, useEffect } from "react";
import { Case, CaseItem } from "../types/case";
import { useBalance } from "@/contexts/BalanceContext";
import { useToast } from "./ui/use-toast";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { SpinningItems } from "./case-opening/SpinningItems";
import { BattleControls } from "./case-opening/BattleControls";
import { WinningResult } from "./case-opening/WinningResult";

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
    
    const spinningItems = Array(200)
      .fill(null)
      .map(() => caseData.items[Math.floor(Math.random() * caseData.items.length)]);
    setCurrentItems(spinningItems);

    setTimeout(() => setSpinSpeed(15), 1000);
    setTimeout(() => setSpinSpeed(10), 2000);
    setTimeout(() => setSpinSpeed(5), 3000);
    setTimeout(() => setSpinSpeed(3), 4000);
    setTimeout(() => setSpinSpeed(2), 5000);
    setTimeout(() => setSpinSpeed(1), 6000);
    
    setTimeout(() => {
      setIsSpinning(false);
      const random = Math.random();
      let cumulative = 0;
      const winner = caseData.items.find((item) => {
        cumulative += item.odds;
        return random <= cumulative;
      }) || caseData.items[0];
      setFinalItem(winner);

      if (isBattleMode) {
        handleBattleResults(winner);
      }
    }, 7000);
  };

  const handleBattleResults = (winner: CaseItem) => {
    const opponentResults = opponents.map(() => {
      const opponentRandom = Math.random();
      let opponentCumulative = 0;
      return caseData.items.find((item) => {
        opponentCumulative += item.odds;
        return opponentRandom <= opponentCumulative;
      }) || caseData.items[0];
    });

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
  };

  const startBattle = (numOpponents: number) => {
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
          <BattleControls 
            onSoloOpen={startSpinning}
            onBattleStart={startBattle}
          />
        )}

        <div className="p-6">
          <div className="relative h-48 overflow-hidden rounded-lg bg-muted">
            <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-primary -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-primary rotate-45"></div>
              <div className="absolute bottom-0 left-1/2 w-4 h-4 -translate-x-1/2 translate-y-1/2 bg-primary rotate-45"></div>
            </div>
            
            <SpinningItems
              items={currentItems}
              isSpinning={isSpinning}
              spinSpeed={spinSpeed}
              finalItem={finalItem}
            />
          </div>

          {finalItem && !isSpinning && (
            <WinningResult 
              item={finalItem}
              casePrice={caseData.price}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};