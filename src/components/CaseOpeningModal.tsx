
import { Dialog, DialogContent } from "./ui/dialog";
import { useState, useEffect } from "react";
import { Case, CaseItem } from "../types/case";
import { useBalance } from "@/contexts/BalanceContext";
import { useToast } from "./ui/use-toast";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { ModalControls } from "./case-opening/ModalControls";
import { OpeningHeader } from "./case-opening/OpeningHeader";
import { CaseOpeningContent } from "./case-opening/CaseOpeningContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

interface CaseOpeningModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case;
  isFreePlay?: boolean;
}

const MAX_TRANSACTION_AMOUNT = 99999999.99;

// Function to calculate multiplier from item value and case price
const calculateMultiplier = (item: CaseItem, casePrice: number): number => {
  if (item.multiplier !== null && item.multiplier !== undefined) {
    return item.multiplier;
  }
  return item.value && casePrice > 0 ? item.value / casePrice : 1;
};

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
  const [isResetting, setIsResetting] = useState(false);
  
  const { balance, createTransaction } = useBalance();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const resetState = () => {
    setIsSpinning(false);
    setFinalItem(null);
    setIsBattleMode(false);
    setOpponents([]);
    setBattleWinner(null);
    setHasRushDraw(false);
    setIsResetting(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsResetting(true);
      const timeout = setTimeout(() => {
        resetState();
      }, 300);
      return () => clearTimeout(timeout);
    }

    if (!isFreePlay) {
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

      if (caseData.price > MAX_TRANSACTION_AMOUNT) {
        toast({
          title: "Case price too high",
          description: "This case exceeds the maximum transaction amount.",
          variant: "destructive",
        });
        onOpenChange(false);
        return;
      }
    }
  }, [isOpen, balance, caseData.price, user, isFreePlay, onOpenChange, toast]);

  // Record the case opening to the database
  const recordCaseOpening = async (item: CaseItem, winAmount: number) => {
    if (!user || isFreePlay) return;
    
    try {
      const { error } = await supabase
        .from('case_openings')
        .insert({
          user_id: user.id,
          case_id: caseData.id,
          item_won: item.id,
          value_won: winAmount
        });
        
      if (error) {
        console.error('Error recording case opening:', error);
      } else {
        console.log('Case opening recorded successfully');
      }
    } catch (err) {
      console.error('Exception recording case opening:', err);
    }
  };

  const handleSpinComplete = async (item: CaseItem, player: string) => {
    if (isBattleMode) {
      if (!battleWinner || calculateMultiplier(item, caseData.price) > calculateMultiplier(battleWinner.item, caseData.price)) {
        setBattleWinner({ player, item });
      }
    } else {
      setFinalItem(item);
      if (!isFreePlay) {
        const effectiveMultiplier = calculateMultiplier(item, caseData.price);
        const winAmount = Math.min(caseData.price * effectiveMultiplier, MAX_TRANSACTION_AMOUNT);
        console.log(`Win calculation: ${caseData.price} × ${effectiveMultiplier} = ${winAmount}`);
        
        if (winAmount >= MAX_TRANSACTION_AMOUNT) {
          toast({
            title: "Maximum win amount exceeded",
            description: "Your win has been capped at the maximum allowed amount.",
            variant: "default",
          });
        }
        
        // Record the case opening in the database
        await recordCaseOpening(item, winAmount);
        
        // Update user balance
        await createTransaction('case_win', winAmount);
      }
    }
    setIsSpinning(false);
  };

  const startSpinning = async () => {
    if (isSpinning || isResetting) return;
    
    setFinalItem(null);
    setBattleWinner(null);
    
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
    if (isSpinning || isResetting) return;
    
    const botNames = ["Bot_Alpha", "Bot_Beta", "Bot_Gamma", "Bot_Delta"];
    const selectedOpponents = botNames.slice(0, numOpponents);
    setOpponents(selectedOpponents);
    setIsBattleMode(true);
    await startSpinning();
  };

  const handleWin = async (amount: number) => {
    if (!isFreePlay) {
      const cappedAmount = Math.min(amount, MAX_TRANSACTION_AMOUNT);
      if (cappedAmount !== amount) {
        toast({
          title: "Maximum win amount exceeded",
          description: "Your win has been capped at the maximum allowed amount.",
          variant: "default",
        });
      }
      await createTransaction('case_win', cappedAmount);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className={`
        fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] 
        w-full max-w-[800px] bg-background/95 backdrop-blur-sm border-accent
        ${isMobile ? 'h-[90vh] overflow-y-auto' : ''}
        p-4 sm:p-6
      `}>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 sm:right-4 sm:top-4 rounded-full z-50"
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

        <CaseOpeningContent 
          caseData={caseData}
          isSpinning={isSpinning}
          isBattleMode={isBattleMode}
          finalItem={finalItem}
          opponents={opponents}
          battleWinner={battleWinner}
          onSpinComplete={handleSpinComplete}
          isFreePlay={isFreePlay}
          hasRushDraw={hasRushDraw}
          onWin={handleWin}
        />
      </DialogContent>
    </Dialog>
  );
};
