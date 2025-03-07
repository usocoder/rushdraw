import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, Wallet, Package } from "lucide-react";

interface TransactionWithProfile {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  pending_amount: number;
  created_at: string;
  crypto_address: string | null;
  item_details: any;  // Using any to avoid TypeScript issues with JSON type
  username?: string;
}

export const TransactionApprovals = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: pendingTransactions, isLoading, refetch } = useQuery({
    queryKey: ['pending-transactions'],
    queryFn: async () => {
      console.log('Fetching pending transactions...');
      
      // First, fetch transactions
      const { data: transactions, error: transactionError } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (transactionError) {
        console.error('Error fetching transactions:', transactionError);
        throw transactionError;
      }

      if (!transactions) {
        return [];
      }

      // Then, fetch profiles for these transactions
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', transactions.map(t => t.user_id));

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        throw profileError;
      }

      // Combine the data
      const transformedData: TransactionWithProfile[] = transactions.map(transaction => ({
        ...transaction,
        username: profiles?.find(p => p.id === transaction.user_id)?.username || 'Unknown User'
      }));

      console.log('Transformed transactions:', transformedData);
      return transformedData;
    },
  });

  // Handle transaction approval or rejection
  const handleApproval = async (transactionId: string, approve: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const status = approve ? "completed" : "rejected";
      
      // Update transaction status only - the trigger will handle the balance update
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ status })
        .eq("id", transactionId);

      if (updateError) throw updateError;

      toast({
        title: `Transaction ${approve ? "Approved" : "Rejected"}`,
        description: `Transaction ${transactionId} has been ${status}.`,
      });

      refetch();
    } catch (error) {
      console.error("Error updating transaction:", error);
      toast({
        title: "Error",
        description: "Failed to update transaction status.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Pending Transactions</h2>
      {!pendingTransactions || pendingTransactions.length === 0 ? (
        <p className="text-muted-foreground">No pending transactions</p>
      ) : (
        <div className="grid gap-4">
          {pendingTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="p-4 rounded-lg border bg-card"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {transaction.type === 'item_request' ? 'Item Request' : 
                       transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Amount: ${transaction.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => handleApproval(transaction.id, false)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      disabled={isProcessing}
                      onClick={() => handleApproval(transaction.id, true)}
                    >
                      Approve
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{transaction.username}</span>
                  </div>
                  
                  {transaction.type === 'withdraw' && transaction.crypto_address && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Wallet className="w-4 h-4" />
                      <span className="font-mono break-all">
                        {transaction.crypto_address}
                      </span>
                    </div>
                  )}
                  
                  {transaction.type === 'item_request' && transaction.item_details && (
                    <div className="mt-3 space-y-2 border-t pt-2">
                      <h4 className="font-medium flex items-center gap-1">
                        <Package className="w-4 h-4" /> Item Details
                      </h4>
                      <div className="text-muted-foreground space-y-1">
                        <p><strong>Description:</strong> {transaction.item_details.description}</p>
                        <p><strong>Shipping:</strong> {transaction.item_details.shipping_address}</p>
                        <p><strong>Contact:</strong> {transaction.item_details.contact_info}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
