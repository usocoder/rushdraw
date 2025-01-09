import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, Copy, Loader2 } from "lucide-react";
import { useToast } from "./ui/use-toast";

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
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
    
    toast({
      title: "Address copied!",
      description: "The crypto address has been copied to your clipboard.",
    });
  };

  const simulateDeposit = () => {
    setIsProcessing(true);
    toast({
      title: "Processing deposit",
      description: "Please wait while we confirm your transaction (up to 5 minutes).",
    });

    // Simulate blockchain confirmations
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Deposit confirmed!",
        description: "Your deposit has been confirmed and credited to your account.",
      });
      onOpenChange(false);
    }, 5 * 60 * 1000); // 5 minutes
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Deposit Crypto</DialogTitle>
          <DialogDescription>
            Choose your preferred cryptocurrency to make a deposit. Confirmations may take up to 5 minutes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {CRYPTO_ADDRESSES.map((crypto) => (
            <div key={crypto.currency} className="flex items-center gap-4 p-4 rounded-lg bg-card">
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

        <div className="flex justify-end">
          <Button 
            onClick={simulateDeposit} 
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              "I've sent the crypto"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};