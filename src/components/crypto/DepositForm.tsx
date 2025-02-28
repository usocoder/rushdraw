
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader2 } from "lucide-react";
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
      // Create deposit transaction as pending
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'deposit',
          amount: depositAmount,
          status: 'pending',
          pending_amount: depositAmount
        });

      if (error) throw error;

      toast({
        title: "Deposit submitted",
        description: "Your deposit is pending approval. Please wait for admin confirmation.",
      });
      onSuccess();
      setAmount(""); // Clear the form field after successful submission
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
          className="bg-background/50 border-accent/30 focus:border-accent/60"
        />
      </div>

      <div className="flex items-start gap-2 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>Only Confirm after you have completed the transfer. Once clicked, please allow up to 10 minutes for the deposit to reflect in your account.</p>
      </div>

      <Button 
        onClick={handleDeposit} 
        disabled={isProcessing || !amount}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Deposit
          </>
        ) : (
          "Click Here To Confirm Deposit"
        )}
      </Button>
    </div>
  );
};
