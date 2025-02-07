
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DepositFormProps {
  userId: string;
  onSuccess: () => void;
}

export const DepositForm = ({ userId, onSuccess }: DepositFormProps) => {
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDeposit = async () => {
    const depositAmount = Number(amount);
    
    if (!amount || isNaN(depositAmount) || depositAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount.",
        variant: "destructive",
      });
      return;
    }

    if (depositAmount >= 100000000) {
      toast({
        title: "Amount too large",
        description: "Maximum deposit amount is $99,999,999.99",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'deposit',
          amount: depositAmount,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Deposit submitted",
        description: "Your deposit is pending approval. Please wait for admin confirmation.",
      });
      onSuccess();
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Error processing deposit",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="amount">Deposit Amount (USD)</Label>
        <Input
          id="amount"
          type="number"
          min="0"
          max="99999999.99"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount..."
        />
      </div>

      <Button 
        onClick={handleDeposit} 
        disabled={isProcessing || !amount}
        className="w-full"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          "Click Here To Confirm Deposit"
        )}
      </Button>
    </div>
  );
};
