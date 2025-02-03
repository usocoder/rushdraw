import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useBalance } from "@/contexts/BalanceContext";

export const TransactionApprovals = () => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { refreshBalance } = useBalance();

  const { data: pendingTransactions, isLoading, refetch } = useQuery({
    queryKey: ["pending-transactions"],
    queryFn: async () => {
      console.log("🔄 Fetching pending transactions...");
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching transactions:", error);
        throw error;
      }
      console.log("✅ Fetched pending transactions:", data);
      return data;
    },
  });

  const handleApproval = async (transactionId: string, userId: string, amount: number, approved: boolean) => {
    setIsProcessing(true);
    try {
      console.log("🔄 Processing transaction:", { transactionId, approved });

      // Step 1: Update the transaction status
      const { data: updatedTransaction, error: transactionError } = await supabase
        .from("transactions")
        .update({
          status: approved ? "completed" : "rejected",
          pending_amount: 0,
          updated_at: new Date().toISOString(),
        })
        .eq("id", transactionId)
        .select()
        .single();

      if (transactionError) {
        console.error("❌ Error updating transaction:", transactionError);
        throw new Error("Transaction update failed: " + transactionError.message);
      }

      console.log("✅ Transaction updated successfully:", updatedTransaction);

      // Step 2: If approved, update user balance
      if (approved) {
        console.log("🔄 Updating user balance for user:", userId, " Amount:", amount);

        const { error: balanceError } = await supabase
          .from("users") // Change this if balance is stored in another table
          .update({
            balance: supabase.raw("balance + ?", [amount]), // Atomic update
          })
          .eq("id", userId);

        if (balanceError) {
          console.error("❌ Error updating balance:", balanceError);
          throw new Error("Balance update failed: " + balanceError.message);
        }

        console.log("✅ User balance updated successfully.");
        await refreshBalance();
      }

      toast({
        title: approved ? "Transaction approved" : "Transaction rejected",
        description: `The transaction has been ${approved ? "approved" : "rejected"} successfully.`,
      });

      refetch(); // Refresh transactions list
    } catch (error) {
      console.error("❌ Error processing transaction:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to process the transaction",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Subscribe to real-time changes
  useEffect(() => {
    console.log("🔄 Setting up real-time listeners for transactions");
    const channel = supabase
      .channel("transaction-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "transactions",
        },
        async (payload) => {
          console.log("🔔 Transaction change detected:", payload);
          refetch();
          await refreshBalance();
        }
      )
      .subscribe();

    return () => {
      console.log("🧹 Cleaning up real-time listeners");
      supabase.removeChannel(channel);
    };
  }, [refetch, refreshBalance]);

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
                  {transaction.type.charAt(0).toUpperCase() +
                    transaction.type.slice(1)}
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
                  onClick={() =>
                    handleApproval(transaction.id, transaction.user_id, transaction.amount, false)
                  }
                >
                  Reject
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() =>
                    handleApproval(transaction.id, transaction.user_id, transaction.amount, true)
                  }
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
