import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { TransactionList } from "./TransactionList";
import { useEffect, useState } from "react";

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

      return transactions.map(transaction => ({
        ...transaction,
        username: profiles?.find(p => p.id === transaction.user_id)?.username || 'Unknown User'
      }));
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions' },
        () => refetch()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => refetch()
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

      if (approve && transaction.type === 'deposit') {
        // For deposits, update balance first then mark transaction as completed
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('balance')
          .eq('id', transaction.user_id)
          .single();

        if (profileError) throw profileError;

        const newBalance = (profile?.balance || 0) + transaction.amount;
        const { error: updateBalanceError } = await supabase
          .from('profiles')
          .update({ balance: newBalance })
          .eq('id', transaction.user_id);

        if (updateBalanceError) throw updateBalanceError;
      }

      // Update transaction status
      const { error: updateError } = await supabase
        .from("transactions")
        .update({ status })
        .eq("id", transactionId);

      if (updateError) throw updateError;

      toast({
        title: `Transaction ${approve ? "Approved" : "Rejected"}`,
        description: `Transaction has been ${status}.`,
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
      <TransactionList
        transactions={pendingTransactions || []}
        isProcessing={isProcessing}
        onApprove={(id) => handleApproval(id, true)}
        onReject={(id) => handleApproval(id, false)}
      />
    </div>
  );
};