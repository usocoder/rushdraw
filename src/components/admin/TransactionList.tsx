import { TransactionCard } from "./TransactionCard";

interface TransactionListProps {
  transactions: Array<{
    id: string;
    type: string;
    amount: number;
    created_at: string;
    username?: string;
    crypto_address?: string | null;
  }>;
  isProcessing: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const TransactionList = ({ 
  transactions, 
  isProcessing, 
  onApprove, 
  onReject 
}: TransactionListProps) => {
  if (!transactions || transactions.length === 0) {
    return <p className="text-muted-foreground">No pending transactions</p>;
  }

  return (
    <div className="grid gap-4">
      {transactions.map((transaction) => (
        <TransactionCard
          key={transaction.id}
          transaction={transaction}
          isProcessing={isProcessing}
          onApprove={onApprove}
          onReject={onReject}
        />
      ))}
    </div>
  );
};