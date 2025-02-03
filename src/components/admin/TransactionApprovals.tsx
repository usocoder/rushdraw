import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export const TransactionApprovals = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: pendingTransactions, isLoading, refetch } = useQuery({
    queryKey: ['pending-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleApproval = async (transactionId: string, approved: boolean) => {
    setIsProcessing(true);
    try {
      // First update the transaction status
      const { error: transactionError } = await supabase
        .from('transactions')
        .update({ 
          status: approved ? 'completed' : 'rejected',
          pending_amount: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      if (transactionError) throw transactionError;

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

  // Subscribe to real-time changes
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
              className="p-4 rounded-lg border bg-card flex items-center justify-between"
            >
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
          ))}
        </div>
      )}
    </div>
  );
};