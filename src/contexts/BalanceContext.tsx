import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useBrowserAuth } from './BrowserAuthContext';
import { useToast } from '@/components/ui/use-toast';

interface BalanceContextType {
  balance: number;
  loading: boolean;
  refreshBalance: () => Promise<void>;
  createTransaction: (type: 'deposit' | 'case_open' | 'case_win', amount: number) => Promise<boolean>;
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
    if (!user) return;
    try {
      console.log('Fetching balance for user:', user.id);
      const { data, error } = await supabase
        .from('balances')
        .select('amount')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching balance:', error);
        throw error;
      }
      
      console.log('Fetched balance:', data.amount);
      setBalance(data.amount);
    } catch (error) {
      console.error('Error fetching balance:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch balance',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createTransaction = async (type: 'deposit' | 'case_open' | 'case_win', amount: number): Promise<boolean> => {
    if (!user) return false;
    try {
      console.log('Creating transaction:', { type, amount, user_id: user.id });
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type,
          amount,
          status: type === 'deposit' ? 'pending' : 'completed',
          pending_amount: type === 'deposit' ? amount : 0
        })
        .select();

      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
      
      console.log('Transaction created successfully:', data);
      
      // Only fetch balance immediately for non-deposit transactions
      if (type !== 'deposit') {
        await fetchBalance();
      }
      return true;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: 'Error',
        description: 'Failed to process transaction',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      console.log('Setting up real-time listeners for user:', user.id);
      fetchBalance();

      // Subscribe to real-time changes on transactions table
      const transactionsChannel = supabase
        .channel('transaction-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'transactions',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Transaction updated:', payload);
            fetchBalance();
          }
        )
        .subscribe();

      // Subscribe to real-time changes on balances table
      const balancesChannel = supabase
        .channel('balance-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'balances',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Balance updated:', payload);
            fetchBalance();
          }
        )
        .subscribe();

      return () => {
        console.log('Cleaning up real-time listeners');
        supabase.removeChannel(transactionsChannel);
        supabase.removeChannel(balancesChannel);
      };
    }
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