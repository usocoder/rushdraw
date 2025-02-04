import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, User, Wallet } from "lucide-react";
import { useBalance } from "@/contexts/BalanceContext";

interface TransactionWithProfile {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  pending_amount: number;
  created_at: string;
  crypto_address: string | null;
  profiles: {
    username: string | null;
    email: {
      email: string;
    } | null;
  } | null;
}

export const TransactionApprovals = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { refreshBalance } = useBalance();

  const { data: pendingTransactions, isLoading, refetch } = useQuery({
    queryKey: ['pending-transactions'],
    queryFn: async () => {
      console.log('Fetching pending transactions...');
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          profiles:user_id (
            username,
            email:auth_users!auth_users_id_fkey(email)
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      console.log('Fetched pending transactions:', data);
      return data as TransactionWithProfile[];
    },
  });

  const handleApproval = async (transactionId: string, approved: boolean) => {
    setIsProcessing(true);
    try {
      console.log('Processing transaction:', { transactionId, approved });
      
      const { data: updatedTransaction, error: transactionError } = await supabase
        .from('transactions')
        .update({ 
          status: approved ? 'completed' : 'rejected',
          pending_amount: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId)
        .select()
        .single();

      if (transactionError) {
        console.error('Error updating transaction:', transactionError);
        throw transactionError;
      }

      console.log('Transaction updated successfully:', updatedTransaction);

      if (approved) {
        console.log('Refreshing balance after approval');
        await refreshBalance();
      }

      toast({
        title: approved ? "Transaction approved" : "Transaction rejected",
        description: `The transaction has been ${approved ? 'approved' : 'rejected'} successfully.`,
      });

      refetch();
    } catch (error) {
      console.error('Error processing transaction:', error);
      toast({
        title: "Error",
        description: "Failed to process the transaction",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    console.log('Setting up real-time listeners for transactions');
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
        (payload) => {
          console.log('Transaction change detected:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up real-time listeners');
      supabase.removeChannel(channel);
    };
  }, [refetch]);

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
      {pendingTransactions?.length === 0 ? (
        <p className="text-muted-foreground">No pending transactions</p>
      ) : (
        <div className="grid gap-4">
          {pendingTransactions?.map((transaction) => (
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
                
                {/* User Details Section */}
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>
                      {transaction.profiles?.username || 'No username'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>
                      {transaction.profiles?.email?.email || 'No email'}
                    </span>
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
