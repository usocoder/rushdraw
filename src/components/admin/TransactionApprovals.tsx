import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Mail, User, Wallet } from "lucide-react";

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
    auth: {
      email: string;
    } | null;
  } | null;
}

export const TransactionApprovals = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending transactions
  const { data: pendingTransactions, isLoading, refetch } = useQuery({
    queryKey: ['pending-transactions'],
    queryFn: async () => {
      console.log('Fetching pending transactions...');
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          user_id,
          type,
          amount,
          status,
          pending_amount,
          created_at,
          crypto_address,
          profiles (
            username,
            auth (
              email
            )
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }

      // Transform data to match TransactionWithProfile interface
      const transformedData = data.map(transaction => ({
        ...transaction,
        profiles: transaction.profiles || null
      }));

      console.log('Fetched pending transactions:', transformedData);
      return transformedData as TransactionWithProfile[];
    },
  });

  // Handle transaction approval or rejection
  const handleApproval = async (transactionId: string, approve: boolean) => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const status = approve ? "approved" : "rejected";
      const { error } = await supabase
        .from("transactions")
        .update({ status })
        .eq("id", transactionId);

      if (error) {
        throw error;
      }

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
                      {transaction.profiles?.auth?.email || 'No email'}
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