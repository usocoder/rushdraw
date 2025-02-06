import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, User, Wallet } from "lucide-react";

interface TransactionWithProfile {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  pending_amount: number;
  created_at: string;
  crypto_address: string | null;
  username?: string;
}

export const TransactionApprovals = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: pendingTransactions, isLoading, refetch } = useQuery({
    queryKey: ['pending-transactions'],
    queryFn: async () => {
      console.log('Fetching pending transactions...');
      
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

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', transactions.map(t => t.user_id));

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        throw profileError;
      }

      const transformedData: TransactionWithProfile[] = transactions.map(transaction => ({
        ...transaction,
        username: profiles?.find(p => p.id === transaction.user_id)?.username || 'Unknown User'
      }));

      console.log('Transformed transactions:', transformedData);
      return transformedData;
    },
  });

  // Set up real-time subscription for transactions
  useEffect(() => {
    const channel = supabase
      .channel('transaction-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `status=eq.pending`,
        },
        () => {
          console.log('Transaction updated, refreshing...');
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleApproval = async (transactionId: string, approve: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const { data: transaction, error: transactionError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", transactionId)
        .single();

      if (transactionError) throw transactionError;
      if (!transaction) throw new Error("Transaction not found");

      const status = approve ? "completed" : "rejected";

      // If approved, update the user's balance first
      if (approve) {
        const { data: profileData, error: profileFetchError } = await supabase
          .from('profiles')
          .select('balance, referral_code_used')
          .eq('id', transaction.user_id)
          .single();

        if (profileFetchError) throw profileFetchError;

        const currentBalance = profileData?.balance || 0;
        let finalAmount = transaction.amount;

        // If there's a referral code, apply the bonus
        if (profileData?.referral_code_used) {
          const { data: commissionRate } = await supabase.rpc(
            'get_referral_commission_rate',
            { user_id: transaction.user_id }
          );
          
          // Apply referral bonus (default to 10% if no specific rate)
          const bonusRate = commissionRate || 0.10;
          finalAmount = finalAmount * (1 + bonusRate);
        }

        // Update the balance
        const { error: profileUpdateError } = await supabase
          .from('profiles')
          .update({ balance: currentBalance + finalAmount })
          .eq('id', transaction.user_id);

        if (profileUpdateError) throw profileUpdateError;

        // Update the transaction amount to include any bonuses
        transaction.amount = finalAmount;
      }
      
      // Then update transaction status
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ 
          status,
          amount: transaction.amount // Update with potentially modified amount
        })
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
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};