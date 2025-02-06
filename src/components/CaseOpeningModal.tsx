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
import { BattleControls } from "./case-opening/BattleControls";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CaseOpeningModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  caseData: Case;
  isBattleMode?: boolean;
}

const MAX_TRANSACTION_AMOUNT = 99999999.99;

export const CaseOpeningModal = ({
  isOpen,
  onOpenChange,
  caseData,
  isBattleMode = false,
}: CaseOpeningModalProps) => {
  const [selectedCases, setSelectedCases] = useState<Case[]>([caseData]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalItem, setFinalItem] = useState<CaseItem | null>(null);
  const [hasRushDraw, setHasRushDraw] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [opponents, setOpponents] = useState<string[]>([]);
  const [battleWinner, setBattleWinner] = useState<{ player: string; item: CaseItem } | null>(null);
  const [isCrazyMode, setIsCrazyMode] = useState(false);
  
  const { balance, createTransaction } = useBalance();
  const { user } = useBrowserAuth();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const resetState = () => {
    setIsSpinning(false);
    setFinalItem(null);
    setHasRushDraw(false);
    setIsResetting(false);
    setOpponents([]);
    setBattleWinner(null);
    setIsCrazyMode(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setIsResetting(true);
      const timeout = setTimeout(() => {
        resetState();
        setSelectedCases([caseData]);
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
    
    const totalPrice = selectedCases.reduce((sum, case_) => sum + case_.price, 0);
    if (balance < totalPrice) {
      toast({
        title: "Insufficient balance",
        description: "Please deposit more funds to open these cases",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }

    if (totalPrice > MAX_TRANSACTION_AMOUNT) {
      toast({
        title: "Case price too high",
        description: "This case exceeds the maximum transaction amount.",
        variant: "destructive",
      });
      onOpenChange(false);
      return;
    }
  }, [isOpen, balance, selectedCases, user, onOpenChange, toast, caseData]);

  const { data: cases } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cases')
        .select(`
          *,
          case_items (*)
        `);
      
      if (error) throw error;
      
      // Map the Supabase response to match our Case type
      return data?.map(case_ => ({
        id: case_.id,
        name: case_.name,
        price: case_.price,
        image: case_.image_url,
        bestDrop: case_.best_drop || '',
        category: case_.category,
        items: case_.case_items?.map(item => ({
          id: item.id,
          name: item.name,
          value: item.value,
          odds: item.odds,
          multiplier: item.multiplier || 1,
          rarity: item.rarity as 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary',
          image: item.image_url
        })) || []
      }));
    },
  });

  const handleCaseSelect = (caseId: string) => {
    const selectedCase = cases?.find(c => c.id === caseId);
    if (selectedCase) {
      setSelectedCases(prev => [...prev, selectedCase]);
    }
  };

  const handleSpinComplete = async (item: CaseItem, player: string) => {
    if (player === "You") {
      setFinalItem(item);
    }
    
    if (!isBattleMode) {
      if (item.value >= MAX_TRANSACTION_AMOUNT) {
        toast({
          title: "Maximum win amount exceeded",
          description: "Your win has been capped at the maximum allowed amount.",
          variant: "default",
        });
      }
      await createTransaction('case_win', Math.min(item.value, MAX_TRANSACTION_AMOUNT));
      setIsSpinning(false);
      return;
    }

    const allSpinsComplete = finalItem !== null || player !== "You";
    if (allSpinsComplete) {
      const winner = isCrazyMode ? 
        { player, item: { ...item, value: -item.value } } : 
        { player, item };
      setBattleWinner(winner);
      
      if (winner.player === "You") {
        const winAmount = Math.min(winner.item.value, MAX_TRANSACTION_AMOUNT);
        await createTransaction('case_win', winAmount);
      }
      setIsSpinning(false);
    }
  };

  const startSpinning = async () => {
    if (isSpinning || isResetting) return;
    
    setFinalItem(null);
    setBattleWinner(null);
    
    const totalPrice = selectedCases.reduce((sum, case_) => sum + case_.price, 0);
    const success = await createTransaction('case_open', totalPrice);
    if (!success) {
      onOpenChange(false);
      return;
    }
    setIsSpinning(true);
  };

  const handleBattleStart = (numOpponents: number) => {
    const bots = Array.from({ length: numOpponents }, (_, i) => `Rushbot${i + 1}`);
    setOpponents(bots);
    startSpinning();
  };

  const handleSoloOpen = () => {
    setOpponents([]);
    startSpinning();
  };

  const toggleCrazyMode = () => {
    setIsCrazyMode(!isCrazyMode);
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
          name={selectedCases.map(c => c.name).join(", ")}
          isBattleMode={isBattleMode}
          hasRushDraw={hasRushDraw}
          isCrazyMode={isCrazyMode}
        />
        
        {isBattleMode ? (
          <div className="space-y-4">
            <BattleControls 
              onSoloOpen={handleSoloOpen}
              onBattleStart={handleBattleStart}
              isCrazyMode={isCrazyMode}
              onToggleCrazyMode={toggleCrazyMode}
              onCaseSelect={handleCaseSelect}
              selectedCases={selectedCases}
            />
          </div>
        ) : (
          <div className="flex justify-center my-4">
            <Button 
              onClick={startSpinning}
              disabled={isSpinning || finalItem !== null}
              size="lg"
            >
              Open Case
            </Button>
          </div>
        )}

        <CaseOpeningContent 
          caseData={selectedCases[0]}
          isSpinning={isSpinning}
          isBattleMode={isBattleMode}
          finalItem={finalItem}
          opponents={opponents}
          battleWinner={battleWinner}
          onSpinComplete={handleSpinComplete}
          hasRushDraw={hasRushDraw}
          onWin={async (amount) => {
            await createTransaction('case_win', Math.min(amount, MAX_TRANSACTION_AMOUNT));
          }}
          isCrazyMode={isCrazyMode}
        />
      </DialogContent>
    </Dialog>
  );
};