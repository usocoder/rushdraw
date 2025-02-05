import { Dialog, DialogContent } from "./ui/dialog";
import { useState, useEffect } from "react";
import { Case, CaseItem } from "../types/case";
import { useBalance } from "@/contexts/BalanceContext";
import { useToast } from "./ui/use-toast";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { WinningResult } from "./case-opening/WinningResult";
import { OpeningHeader } from "./case-opening/OpeningHeader";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ModalControls } from "./case-opening/ModalControls";
import { BattleModalContent } from "./case-opening/BattleModalContent";

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
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);
  const [isBattleMode, setIsBattleMode] = useState(false);
  const [opponents, setOpponents] = useState<string[]>([]);
  const [hasRushDraw, setHasRushDraw] = useState(false);
  const [battleWinner, setBattleWinner] = useState<{ player: string; item: CaseItem } | null>(null);
  const { balance, createTransaction } = useBalance();
  const { user } = useBrowserAuth();
  const { toast } = useToast();

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
      setIsBattleMode(false);
      setOpponents([]);
      setBattleWinner(null);
    }
  }, [isOpen, balance, caseData.price, user, isFreePlay]);

  const handleSpinComplete = async (item: CaseItem, player: string) => {
    if (isBattleMode) {
      if (!battleWinner || item.multiplier > battleWinner.item.multiplier) {
        setBattleWinner({ player, item });
      }
    } else {
      setFinalItem(item);
      if (!isFreePlay) {
        const winAmount = caseData.price * item.multiplier;
        await createTransaction('case_win', winAmount);
      }
    }
  };

  const startSpinning = async () => {
    if (!isFreePlay) {
      const success = await createTransaction('case_open', caseData.price);
      if (!success) {
        onOpenChange(false);
        return;
      }
    }
    setIsSpinning(true);
  };

  const startBattle = async (numOpponents: number) => {
    const botNames = ["Bot_Alpha", "Bot_Beta", "Bot_Gamma", "Bot_Delta"];
    const selectedOpponents = botNames.slice(0, numOpponents);
    setOpponents(selectedOpponents);
    setIsBattleMode(true);
    await startSpinning();
  };

  const handleWin = async (amount: number) => {
    if (!isFreePlay) {
      await createTransaction('case_win', amount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] bg-card border-accent relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full z-50"
          onClick={() => onOpenChange(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        
        <OpeningHeader
          name={caseData.name}
          isFreePlay={isFreePlay}
          isBattleMode={isBattleMode}
          hasRushDraw={hasRushDraw}
        />
        
        <ModalControls 
          isSpinning={isSpinning}
          finalItem={!!finalItem}
          battleWinner={!!battleWinner}
          isBattleMode={isBattleMode}
          onSoloOpen={startSpinning}
          onBattleMode={() => setIsBattleMode(true)}
          onBattleStart={startBattle}
        />

        {!isBattleMode && finalItem && !isSpinning && (
          <WinningResult 
            item={finalItem}
            casePrice={caseData.price}
            isFreePlay={isFreePlay}
            hasRushDraw={hasRushDraw}
          />
        )}

        <BattleModalContent 
          caseData={caseData}
          isSpinning={isSpinning}
          isBattleMode={isBattleMode}
          opponents={opponents}
          battleWinner={battleWinner}
          onSpinComplete={handleSpinComplete}
          isFreePlay={isFreePlay}
          casePrice={caseData.price}
          onWin={handleWin}
        />
      </DialogContent>
    </Dialog>
  );
};