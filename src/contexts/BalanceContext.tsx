
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
        .maybeSingle();

      if (error) {
        console.error('Error fetching balance:', error);
        throw error;
      }
      
      const newBalance = data?.balance || 0;
      console.log('Fetched balance:', newBalance);
      setBalance(newBalance);
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
    
    // Validate amount
    if (amount <= 0 || amount >= 100000000) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return false;
    }

    // For case openings, check if user has enough balance
    if (type === 'case_open' && balance < amount) {
      toast({
        title: 'Insufficient balance',
        description: 'Please deposit more funds to open this case',
        variant: 'destructive',
      });
      return false;
    }

    try {
      // First, check if the profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        // Create profile if it doesn't exist
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, balance: 0 }]);

        if (insertError) throw insertError;
      }

      console.log('Creating transaction:', { type, amount, user_id: user.id });
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type,
          amount,
          status: type === 'deposit' ? 'pending' : 'completed'
        })
        .select();

      if (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
      
      console.log('Transaction created successfully:', data);
      
      // For non-deposit transactions, update balance immediately
      if (type !== 'deposit') {
        const balanceChange = type === 'case_open' ? -amount : amount;
        const { error: updateError } = await supabase.rpc('increment_balance', {
          user_id: user.id,
          amount: balanceChange
        });

        if (updateError) throw updateError;
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

      // Create a single channel for all changes
      const channel = supabase
        .channel('db-changes')
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
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${user.id}`,
          },
          (payload) => {
            console.log('Profile updated:', payload);
            fetchBalance();
          }
        )
        .subscribe((status, err) => {
          console.log('Subscription status:', status, err);
        });

      return () => {
        console.log('Cleaning up real-time listeners');
        supabase.removeChannel(channel);
      };
    } else {
      setBalance(0);
      setLoading(false);
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
