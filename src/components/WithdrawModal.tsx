
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useToast } from "./ui/use-toast";
import { Loader2, DollarSign, Package, CreditCard } from "lucide-react";
import { useBrowserAuth } from "@/contexts/BrowserAuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useBalance } from "@/contexts/BalanceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

type WithdrawalType = 'crypto' | 'item-request';

export const WithdrawModal = ({ isOpen, onOpenChange }: Props) => {
  const { toast } = useToast();
  const { user } = useBrowserAuth();
  const { balance } = useBalance();
  const [withdrawalType, setWithdrawalType] = useState<WithdrawalType>('crypto');
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [contactInfo, setContactInfo] = useState("");
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

    // Add validation for maximum amount
    if (withdrawAmount >= 100000000) {
      toast({
        title: "Amount too large",
        description: "Maximum withdrawal amount is $99,999,999.99",
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

    if (withdrawalType === 'crypto' && !address) {
      toast({
        title: "Missing address",
        description: "Please enter a crypto address for withdrawal.",
        variant: "destructive",
      });
      return;
    }

    if (withdrawalType === 'item-request') {
      if (!itemDescription) {
        toast({
          title: "Missing item description",
          description: "Please describe the item you want to request.",
          variant: "destructive",
        });
        return;
      }

      if (!shippingAddress) {
        toast({
          title: "Missing shipping address",
          description: "Please enter your shipping address.",
          variant: "destructive",
        });
        return;
      }

      if (!contactInfo) {
        toast({
          title: "Missing contact information",
          description: "Please enter your contact information.",
          variant: "destructive",
        });
        return;
      }
    }

    setIsProcessing(true);
    
    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user?.id,
          type: withdrawalType === 'crypto' ? 'withdraw' : 'item_request',
          amount: withdrawAmount,
          status: 'pending',
          pending_amount: withdrawAmount,
          crypto_address: withdrawalType === 'crypto' ? address : null,
          item_details: withdrawalType === 'item-request' ? {
            description: itemDescription,
            shipping_address: shippingAddress,
            contact_info: contactInfo
          } : null
        });

      if (error) throw error;

      toast({
        title: withdrawalType === 'crypto' ? "Withdrawal submitted" : "Item request submitted",
        description: withdrawalType === 'crypto' 
          ? "Your withdrawal request is pending approval. Please wait for admin confirmation."
          : "Your item request is pending approval. We'll contact you with shipping details soon.",
      });
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error processing request:', error);
      toast({
        title: "Error processing request",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Withdraw Funds</DialogTitle>
          <DialogDescription>
            Choose a withdrawal method below.
          </DialogDescription>
        </DialogHeader>

        <Tabs 
          defaultValue="crypto" 
          value={withdrawalType}
          onValueChange={(value) => setWithdrawalType(value as WithdrawalType)}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="crypto" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Crypto Withdrawal
            </TabsTrigger>
            <TabsTrigger value="item-request" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Request Item
            </TabsTrigger>
          </TabsList>

          <TabsContent value="crypto" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Withdrawal Amount (USD)</Label>
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
          </TabsContent>

          <TabsContent value="item-request" className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="amount-item">Item Value (USD)</Label>
              <Input
                id="amount-item"
                type="number"
                min="0"
                max="99999999.99"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter item value..."
              />
              <p className="text-sm text-muted-foreground">
                Available balance: ${balance.toFixed(2)}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="item-description">Item Description</Label>
              <Textarea
                id="item-description"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                placeholder="Describe the item you want (brand, model, specifications, etc.)..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="shipping-address">Shipping Address</Label>
              <Textarea
                id="shipping-address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Enter your complete shipping address..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contact-info">Contact Information</Label>
              <Input
                id="contact-info"
                type="text"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Phone number or alternative contact method..."
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button 
            onClick={handleWithdraw} 
            disabled={isProcessing || !amount || (withdrawalType === 'crypto' && !address) || (withdrawalType === 'item-request' && (!itemDescription || !shippingAddress || !contactInfo))}
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing
              </>
            ) : (
              <>
                {withdrawalType === 'crypto' ? (
                  <>
                    <DollarSign className="mr-2 h-4 w-4" />
                    Withdraw
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Request Item
                  </>
                )}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
