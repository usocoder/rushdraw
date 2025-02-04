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
    setCurrentItems(generateSpinningItems());

    const speedPattern = [
      { speed: 40, time: 0 },     // Start faster
      { speed: 35, time: 500 },   // Quick acceleration
      { speed: 30, time: 1000 },
      { speed: 25, time: 2000 },
      { speed: 20, time: 3000 },
      { speed: 15, time: 4000 },
      { speed: 10, time: 5000 },
      { speed: 5, time: 5500 },   // Start slowing down more gradually
      { speed: 3, time: 6000 },
      { speed: 1, time: 6500 }    // Final slow approach
    ];

    speedPattern.forEach(({ speed, time }) => {
      setTimeout(() => setSpinSpeed(speed), time);
    });
    
    return new Promise((resolve) => {
      setTimeout(async () => {
        setIsSpinning(false);
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
      }, 7000);
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

    await Promise.all([
      startSpinning(true),
      ...selectedOpponents.map(async (_, index) => {
        const opponentResult = await startSpinning(false);
        setOpponentResults(prev => {
          const newResults = [...prev];
          if (newResults[index]) {
            newResults[index].finalItem = opponentResult;
          }
          return newResults;
        });
      })
    ]);
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
              <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-primary -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-primary rotate-45"></div>
                <div className="absolute bottom-0 left-1/2 w-4 h-4 -translate-x-1/2 translate-y-1/2 bg-primary rotate-45"></div>
              </div>
              <SpinningItems
                items={currentItems}
                isSpinning={isSpinning}
                spinSpeed={spinSpeed}
                finalItem={finalItem}
                hasRushDraw={hasRushDraw}
              />
            </div>

            {/* Opponent boxes */}
            {isBattleMode && opponentResults.map((opponent, index) => (
              <div key={index} className="relative h-48 overflow-hidden rounded-lg bg-muted">
                <div className="absolute top-1/2 left-1/2 w-0.5 h-full bg-primary -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 bg-primary rotate-45"></div>
                  <div className="absolute bottom-0 left-1/2 w-4 h-4 -translate-x-1/2 translate-y-1/2 bg-primary rotate-45"></div>
                </div>
                <SpinningItems
                  items={opponent.items}
                  isSpinning={isSpinning}
                  spinSpeed={spinSpeed}
                  finalItem={opponent.finalItem}
                  hasRushDraw={false}
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
