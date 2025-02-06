import { Button } from "@/components/ui/button";
import { User, Wallet } from "lucide-react";

interface TransactionCardProps {
  transaction: {
    id: string;
    type: string;
    amount: number;
    created_at: string;
    username?: string;
    crypto_address?: string | null;
  };
  isProcessing: boolean;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const TransactionCard = ({ 
  transaction, 
  isProcessing, 
  onApprove, 
  onReject 
}: TransactionCardProps) => {
  return (
    <div className="p-4 rounded-lg border bg-card">
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
              onClick={() => onReject(transaction.id)}
            >
              Reject
            </Button>
            <Button
              variant="default"
              size="sm"
              disabled={isProcessing}
              onClick={() => onApprove(transaction.id)}
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
  );
};