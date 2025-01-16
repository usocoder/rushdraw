import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, Copy, Loader2, AlertCircle } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";

interface CryptoAddress {
  currency: string;
  address: string;
  icon: string;
}

const CRYPTO_ADDRESSES: CryptoAddress[] = [
  {
    currency: "BTC",
    address: "bc1qhl5rsa5yhpqhh8du47579k2fd96erj2htyjn25",
    icon: "₿"
  },
  {
    currency: "ETH/USDT",
    address: "0xe5052AE7cA12bd144362cB33ca6BB7a0C2c5Cf4F",
    icon: "Ξ"
  },
  {
    currency: "SOL",
    address: "AswWDkR1mXoC1ZhYaJx8yQvv6f8hfz2ZJD6fyJ81Mmxb",
    icon: "◎"
  },
  {
    currency: "LTC",
    address: "ltc1q3efa77t36fhvln7kv0cukxdwum582k9atkm0ur",
    icon: "Ł"
  }
];

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CryptoDeposit = ({ isOpen, onOpenChange }: Props) => {
  const { toast } = useToast();
  const { user } = useBrowserAuth();
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
    
    toast({
      title: "Address copied!",
      description: "The crypto address has been copied to your clipboard.",
    });
  };

  const simulateDeposit = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid deposit amount.",
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
          type: 'deposit',
          amount: Number(amount),
          status: 'pending',
          pending_amount: Number(amount)
        });

      if (error) throw error;

      toast({
        title: "Processing deposit",
        description: "Your deposit is being processed. Please allow up to 10 minutes for the funds to reflect in your account.",
      });

      setTimeout(async () => {
        const { error: updateError } = await supabase
          .from('transactions')
          .update({ 
            status: 'completed',
            pending_amount: 0
          })
          .eq('user_id', user?.id)
          .eq('type', 'deposit')
          .eq('status', 'pending');

        if (updateError) {
          console.error('Error updating transaction:', updateError);
          toast({
            title: "Error processing deposit",
            description: "Please contact support if the issue persists.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Deposit confirmed!",
            description: "Your deposit has been confirmed and credited to your account.",
          });
          onOpenChange(false);
        }
        setIsProcessing(false);
      }, 600000); // 10 minutes
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Error processing deposit",
        description: "Please try again later.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Crypto</DialogTitle>
          <DialogDescription>
            Send crypto to one of the addresses below, then click "I've sent the crypto" to initiate the deposit process.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Deposit Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount..."
            />
          </div>

          {CRYPTO_ADDRESSES.map((crypto) => (
            <div key={crypto.currency} className="flex items-center gap-4 p-4 rounded-lg bg-card hover:bg-accent/5 transition-colors">
              <div className="text-2xl font-mono">{crypto.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{crypto.currency}</h3>
                <p className="text-sm text-muted-foreground font-mono truncate">
                  {crypto.address}
                </p>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(crypto.address)}
                className="flex-shrink-0"
              >
                {copiedAddress === crypto.address ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>Only click "I've sent the crypto" after you have completed the transfer. Once clicked, please allow up to 10 minutes for the deposit to reflect in your account.</p>
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={simulateDeposit} 
              disabled={isProcessing || !amount}
              className="w-full sm:w-auto"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing Deposit
                </>
              ) : (
                "I've sent the crypto"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};