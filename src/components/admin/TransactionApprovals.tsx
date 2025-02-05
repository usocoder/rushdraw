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
  user_email?: string;
  username?: string;
}

export const TransactionApprovals = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch pending transactions
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

      // Get user profiles with emails
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', transactions.map(t => t.user_id));

      if (profileError) {
        console.error('Error fetching profiles:', profileError);
        throw profileError;
      }

      // Get user emails from auth.users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

      if (authError) {
        console.error('Error fetching auth users:', authError);
        throw authError;
      }

      // Combine transactions with profile data and emails
      const transformedData: TransactionWithProfile[] = transactions.map(transaction => {
        const userProfile = profiles?.find(p => p.id === transaction.user_id);
        const authUser = authUsers?.users?.find(u => u.id === transaction.user_id);
        
        return {
          ...transaction,
          user_email: authUser?.email || 'No email',
          username: userProfile?.username || 'No username'
        };
      });

      console.log('Transformed transactions:', transformedData);
      return transformedData;
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
                    <span>{transaction.username}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{transaction.user_email}</span>
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