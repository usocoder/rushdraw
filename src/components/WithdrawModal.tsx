import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useBalance } from "@/contexts/BalanceContext";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WithdrawModal = ({ isOpen, onOpenChange }: Props) => {
  const { toast } = useToast();
  const { user } = useBrowserAuth();
  const { balance } = useBalance();
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = async () => {
    const withdrawAmount = Number(amount);
    if (!amount || isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid withdrawal amount.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawAmount > balance) {
      toast({
        title: "Insufficient balance",
        description: "You don't have enough funds to withdraw this amount.",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Missing address",
        description: "Please enter a crypto address for withdrawal.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          type: 'withdraw',
          amount: withdrawAmount,
          status: 'completed',
        });

      if (error) throw error;

      toast({
        title: "Withdrawal successful",
        description: "Your funds have been sent to the provided address.",
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast({
        title: "Error processing withdrawal",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you want to withdraw and your crypto address.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Withdrawal Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              max={balance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
            />
            <p className="text-sm text-muted-foreground">
              Available balance: ${balance.toFixed(2)}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="address">Crypto Address</Label>
            <Input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your crypto address..."
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleWithdraw} 
            disabled={isProcessing || !amount || !address}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "Withdraw"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};