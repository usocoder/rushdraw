import { Dialog, DialogContent } from "./ui/dialog";
import { useState, useEffect } from "react";
import { Case, CaseItem } from "../types/case";
import { useBalance } from "@/contexts/BalanceContext";
import { useToast } from "./ui/use-toast";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { OpeningHeader } from "./case-opening/OpeningHeader";
import { CaseOpeningContent } from "./case-opening/CaseOpeningContent";
import { useIsMobile } from "@/hooks/use-mobile";

interface CaseOpeningModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case;
}

const MAX_TRANSACTION_AMOUNT = 99999999.99;

export const CaseOpeningModal = ({
  isOpen,
  onOpenChange,
  caseData,
}: CaseOpeningModalProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);
  const [hasRushDraw, setHasRushDraw] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  
  const { balance, createTransaction } = useBalance();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const resetState = () => {
    setIsSpinning(false);
    setFinalItem(null);
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
  }, [isOpen, balance, caseData.price, user, onOpenChange, toast]);

  const handleSpinComplete = async (item: CaseItem) => {
    setFinalItem(item);
    if (item.value >= MAX_TRANSACTION_AMOUNT) {
      toast({
        title: "Maximum win amount exceeded",
        description: "Your win has been capped at the maximum allowed amount.",
        variant: "default",
      });
    }
    await createTransaction('case_win', Math.min(item.value, MAX_TRANSACTION_AMOUNT));
    setIsSpinning(false);
  };

  const startSpinning = async () => {
    if (isSpinning || isResetting) return;
    
    setFinalItem(null);
    
    const success = await createTransaction('case_open', caseData.price);
    if (!success) {
      onOpenChange(false);
      return;
    }
    setIsSpinning(true);
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
          isBattleMode={false}
          hasRushDraw={hasRushDraw}
        />
        
        <div className="flex justify-center my-4">
          <Button 
            onClick={startSpinning}
            disabled={isSpinning || finalItem !== null}
            size="lg"
          >
            Open Case
          </Button>
        </div>

        <CaseOpeningContent 
          caseData={caseData}
          isSpinning={isSpinning}
          isBattleMode={false}
          finalItem={finalItem}
          opponents={[]}
          battleWinner={null}
          onSpinComplete={handleSpinComplete}
          hasRushDraw={hasRushDraw}
          onWin={async (amount) => {
            await createTransaction('case_win', Math.min(amount, MAX_TRANSACTION_AMOUNT));
          }}
        />
      </DialogContent>
    </Dialog>
  );
};