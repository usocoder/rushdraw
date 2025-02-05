import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { useState, useEffect } from "react";
import { Case, CaseItem } from "../types/case";
import { useBalance } from "@/contexts/BalanceContext";
import { useToast } from "./ui/use-toast";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { SpinningItems } from "./case-opening/SpinningItems";
import { BattleControls } from "./case-opening/BattleControls";
import { WinningResult } from "./case-opening/WinningResult";
import { Sparkles, Swords } from "lucide-react";
import { Button } from "./ui/button";

interface CaseOpeningModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case;
  isFreePlay?: boolean;
}

export const CaseOpeningModal = ({
  isOpen,
  onOpenChange,
  caseData,
  isFreePlay = false,
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
  const [hasRushDraw, setHasRushDraw] = useState(false);
  const [opponentResults, setOpponentResults] = useState<Array<{ player: string; items: CaseItem[]; finalItem: CaseItem | null }>>([]);

  useEffect(() => {
    if (isOpen && !isFreePlay) {
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
    } else if (!isOpen) {
      setIsSpinning(false);
      setFinalItem(null);
      setSpinSpeed(20);
      setIsBattleMode(false);
      setOpponents([]);
      setOpponentResults([]);
    }
  }, [isOpen, balance, caseData.price, user, isFreePlay]);

  const generateSpinningItems = (rushDrawChance = 0.05) => {
    return Array(200)
      .fill(null)
      .map(() => {
        const hasRushDraw = Math.random() < rushDrawChance;
        if (hasRushDraw) {
          setHasRushDraw(true);
          const legendaryItems = caseData.items.filter(item => item.rarity === 'legendary');
          return legendaryItems[Math.floor(Math.random() * legendaryItems.length)] || caseData.items[0];
        }
        return caseData.items[Math.floor(Math.random() * caseData.items.length)];
      });
  };

  const startSpinning = async (isPlayerSpin = true): Promise<CaseItem> => {
    if (!isFreePlay && isPlayerSpin) {
      const success = await createTransaction('case_open', caseData.price);
      if (!success) {
        onOpenChange(false);
        return caseData.items[0]; // Return default item if transaction fails
      }
    }

    setIsSpinning(true);
    const items = generateSpinningItems();
    if (isPlayerSpin) {
      setCurrentItems(items);
    }

    const speedPattern = [
      { speed: 100, time: 0 },
      { speed: 80, time: 500 },
      { speed: 70, time: 1000 },
      { speed: 60, time: 1500 },
      { speed: 50, time: 2000 },
      { speed: 40, time: 2500 },
      { speed: 30, time: 3000 },
      { speed: 25, time: 3500 },
      { speed: 20, time: 4000 },
      { speed: 15, time: 5000 },
      { speed: 10, time: 6000 },
      { speed: 7, time: 7000 },
      { speed: 4, time: 8000 },
      { speed: 2, time: 9000 },
      { speed: 1, time: 10000 }
    ];

    speedPattern.forEach(({ speed, time }) => {
      setTimeout(() => setSpinSpeed(speed), time);
    });
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        if (isPlayerSpin) {
          setIsSpinning(false);
        }
        
        const random = Math.random();
        let cumulative = 0;
        
        const adjustedItems = hasRushDraw 
          ? caseData.items.map(item => ({
              ...item,
              odds: item.rarity === 'legendary' ? item.odds * 3 : item.odds
            }))
          : caseData.items;

        const winner = adjustedItems.find((item) => {
          cumulative += item.odds;
          return random <= cumulative;
        }) || adjustedItems[0];
        
        if (isPlayerSpin) {
          setFinalItem(winner);
          if (!isFreePlay) {
            const winAmount = caseData.price * winner.multiplier;
            await createTransaction('case_win', winAmount);
            if (hasRushDraw && winner.rarity === 'legendary') {
              toast({
                title: "🌟 RUSH DRAW WIN! 🌟",
                description: "The rush draw brought you incredible luck!",
                duration: 5000,
              });
            }
          }
        }
        
        setHasRushDraw(false);
        resolve(winner);
      }, 10000);
    });
  };

  const startBattle = async (numOpponents: number) => {
    const botNames = ["Bot_Alpha", "Bot_Beta", "Bot_Gamma", "Bot_Delta"];
    const selectedOpponents = botNames.slice(0, numOpponents);
    setOpponents(selectedOpponents);
    setIsBattleMode(true);

    const results = selectedOpponents.map(opponent => ({
      player: opponent,
      items: generateSpinningItems(),
      finalItem: null as CaseItem | null
    }));
    
    setOpponentResults(results);
    setIsSpinning(true);

    // Start all spins simultaneously
    const [playerResult, ...opponentResults] = await Promise.all([ 
      startSpinning(true),
      ...selectedOpponents.map(async () => startSpinning(false))
    ]);

    // Determine winner based on multiplier
    const allResults = [
      { player: "You", item: playerResult },
      ...opponentResults.map((result, index) => ({
        player: selectedOpponents[index],
        item: result
      }))
    ];

    const winner = allResults.reduce((highest, current) => {
      return (current.item.multiplier > highest.item.multiplier) ? current : highest;
    }, allResults[0]);

    // Update all results
    if (winner.player === "You") {
      setFinalItem(playerResult);
      if (!isFreePlay) {
        const winAmount = caseData.price * playerResult.multiplier;
        await createTransaction('case_win', winAmount);
      }
    } else {
      setFinalItem(null);
      toast({
        title: `${winner.player} won the battle!`,
        description: `With ${winner.item.name} (${winner.item.multiplier}x)`,
        variant: "destructive",
      });
    }

    // Update opponent results and stop their spinning
    setOpponentResults(prev => 
      prev.map((result, index) => ({
        ...result,
        finalItem: opponentResults[index]
      }))
    );
    setIsSpinning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-card border-accent">
        <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          {isFreePlay ? "Free Play - " : ""}{caseData.name}
          {isBattleMode && <Swords className="h-6 w-6 text-primary" />}
          {hasRushDraw && (
            <span className="ml-2 inline-flex items-center text-yellow-500">
              <Sparkles className="w-6 h-6 animate-pulse" />
              Rush Draw Active!
            </span>
          )}
        </DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          {isBattleMode ? "Battle Mode" : isFreePlay ? "See what you could win!" : "Opening your case..."}
        </DialogDescription>
        
        {!isSpinning && !finalItem && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-center gap-4">
              <Button onClick={() => startSpinning(true)} className="w-full">
                Solo Open
              </Button>
              <Button 
                onClick={() => setIsBattleMode(true)} 
                variant="secondary"
                className="w-full flex items-center gap-2"
              >
                <Swords className="h-4 w-4" />
                Battle
              </Button>
            </div>
            
            {isBattleMode && (
              <BattleControls 
                onBattleStart={startBattle}
                onSoloOpen={() => startSpinning(true)}
              />
            )}
          </div>
        )}

        <div className="p-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Player's box */}
            <div className="relative h-48 overflow-hidden rounded-lg bg-muted">
              <SpinningItems
                items={currentItems}
                isSpinning={isSpinning}
                spinSpeed={spinSpeed}
                finalItem={finalItem}
                hasRushDraw={hasRushDraw}
                playerName="You"
              />
            </div>

            {/* Opponent boxes */}
            {isBattleMode && opponentResults.map((opponent, index) => (
              <div key={index} className="relative h-48 overflow-hidden rounded-lg bg-muted">
                <SpinningItems
                  items={opponent.items}
                  isSpinning={isSpinning}
                  spinSpeed={spinSpeed}
                  finalItem={opponent.finalItem}
                  hasRushDraw={false}
                  isOpponent={true}
                  playerName={opponent.player}
                />
              </div>
            ))}
          </div>

          {finalItem && !isSpinning && (
            <WinningResult 
              item={finalItem}
              casePrice={caseData.price}
              isFreePlay={isFreePlay}
              hasRushDraw={hasRushDraw}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
