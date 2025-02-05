import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface CryptoAddress {
  currency: string;
  address: string;
  icon: string;
}

interface CryptoAddressListProps {
  addresses: CryptoAddress[];
}

export const CryptoAddressList = ({ addresses }: CryptoAddressListProps) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const { toast } = useToast();

  const handleCopy = async (address: string) => {
    await navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
    
    toast({
      title: "Address copied!",
      description: "The crypto address has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-3">
      {addresses.map((crypto) => (
        <div 
          key={crypto.currency} 
          className="flex items-center gap-2 p-3 rounded-lg bg-card hover:bg-accent/5 transition-colors"
        >
          <div className="text-xl font-mono">{crypto.icon}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">{crypto.currency}</h3>
            <p className="text-xs text-muted-foreground font-mono truncate">
              {crypto.address}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(crypto.address)}
            className="flex-shrink-0 h-8 w-8"
          >
            {copiedAddress === crypto.address ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      ))}
    </div>
  );
};