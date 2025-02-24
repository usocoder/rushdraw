
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBrowserAuth } from './BrowserAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

interface BalanceContextType {
  balance: number;
  loading: boolean;
  refreshBalance: () => Promise<void>;
  createTransaction: (type: 'deposit' | 'case_open' | 'case_win', amount: number) => Promise<boolean>;
}

interface ProfileChanges {
  balance: number;
  [key: string]: any;
}

interface TransactionChanges {
  status: string;
  [key: string]: any;
}

const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  loading: true,
  refreshBalance: async () => {},
  createTransaction: async () => false,
});

export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useBrowserAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchBalance = async () => {
    if (!user) {
      setBalance(0);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching balance for user:', user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching balance:', error);
        throw error;
      }
      
      const newBalance = data?.balance ?? 0;
      console.log('Fetched balance:', newBalance);
      setBalance(newBalance);
    } catch (error: any) {
      console.error('Error fetching balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch balance: ' + error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (type: 'deposit' | 'case_open' | 'case_win', amount: number): Promise<boolean> => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to perform transactions',
        variant: 'destructive',
      });
      return false;
    }
    
    if (amount <= 0 || amount >= 100000000) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount between 0 and 100,000,000',
        variant: 'destructive',
      });
      return false;
    }

    if (type === 'case_open' && balance < amount) {
      toast({
        title: 'Insufficient balance',
        description: 'Please deposit more funds to open this case',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // Create the transaction
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type,
          amount,
          status: type === 'deposit' ? 'pending' : 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (transactionError) throw transactionError;

      // For non-deposit transactions, immediately fetch the new balance
      if (type !== 'deposit') {
        await fetchBalance();
      }

      return true;
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Transaction failed',
        description: error.message || 'Failed to process transaction',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (!user) {
      setBalance(0);
      setLoading(false);
      return;
    }

    fetchBalance();

    // Set up realtime subscriptions for both profiles and transactions
    const channel = supabase.channel('balance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${user.id}`,
        },
        (payload: RealtimePostgresChangesPayload<ProfileChanges>) => {
          console.log('Profile changed:', payload);
          if (payload.new && typeof payload.new.balance === 'number') {
            setBalance(payload.new.balance);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload: RealtimePostgresChangesPayload<TransactionChanges>) => {
          console.log('Transaction changed:', payload);
          if (payload.new && payload.new.status === 'completed') {
            await fetchBalance();
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <BalanceContext.Provider
      value={{
        balance,
        loading,
        refreshBalance: fetchBalance,
        createTransaction,
      }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider');
  }
  return context;
};
