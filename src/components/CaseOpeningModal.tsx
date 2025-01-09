import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Case, CaseItem } from "../types/case";
import { useBalance } from "@/contexts/BalanceContext";
import { useToast } from "./ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to open cases",
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
      
      startSpinning();
    } else {
      setIsSpinning(false);
      setFinalItem(null);
      setSpinSpeed(20);
    }
  }, [isOpen, balance, caseData.price, user]);

  const startSpinning = async () => {
    // Create transaction first
    const success = await createTransaction('case_open', caseData.price);
    if (!success) {
      onOpenChange(false);
      return;
    }

    setIsSpinning(true);
    // Generate random items for the spinning animation
    const spinningItems = Array(100)
      .fill(null)
      .map(() => caseData.items[Math.floor(Math.random() * caseData.items.length)]);
    setCurrentItems(spinningItems);

    // Fast spin for 4 seconds
    setTimeout(() => setSpinSpeed(15), 1000);
    setTimeout(() => setSpinSpeed(10), 2000);
    setTimeout(() => setSpinSpeed(5), 3000);
    
    // Slow down over 3 seconds
    setTimeout(() => setSpinSpeed(8), 4000);
    setTimeout(() => setSpinSpeed(12), 5000);
    setTimeout(() => setSpinSpeed(15), 6000);
    setTimeout(() => {
      setIsSpinning(false);
      const random = Math.random();
      let cumulative = 0;
      const winner = caseData.items.find((item) => {
        cumulative += item.odds;
        return random <= cumulative;
      }) || caseData.items[0];
      setFinalItem(winner);
    }, 7000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-card border-accent">
        <DialogTitle className="text-2xl font-bold text-center">{caseData.name}</DialogTitle>
        <DialogDescription className="text-center text-muted-foreground">
          Opening your case...
        </DialogDescription>
        
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
                x: isSpinning ? [0, -4000] : -240,
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
                        src={item.image || "https://images.unsplash.com/photo-1579621970795-87facc2f976d"}
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
                  src={finalItem.image || "https://images.unsplash.com/photo-1579621970795-87facc2f976d"}
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