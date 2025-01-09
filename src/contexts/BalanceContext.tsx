import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import { Balance, Transaction } from '@/types/supabase'
import { useToast } from '@/components/ui/use-toast'

interface BalanceContextType {
  balance: number
  loading: boolean
  refreshBalance: () => Promise<void>
  createTransaction: (type: Transaction['type'], amount: number) => Promise<boolean>
}

const BalanceContext = createContext<BalanceContextType>({
  balance: 0,
  loading: true,
  refreshBalance: async () => {},
  createTransaction: async () => false,
})

export const BalanceProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  const [balance, setBalance] = useState(0)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchBalance = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('balances')
        .select('amount')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setBalance(data.amount)
    } catch (error) {
      console.error('Error fetching balance:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch balance',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const createTransaction = async (type: Transaction['type'], amount: number) => {
    if (!user) return false

    try {
      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type,
          amount,
          status: 'completed'
        })

      if (error) throw error
      await fetchBalance()
      return true
    } catch (error) {
      console.error('Error creating transaction:', error)
      toast({
        title: 'Error',
        description: 'Failed to process transaction',
        variant: 'destructive',
      })
      return false
    }
  }

  useEffect(() => {
    if (user) {
      fetchBalance()
    }
  }, [user])

  return (
    <BalanceContext.Provider value={{ 
      balance, 
      loading, 
      refreshBalance: fetchBalance,
      createTransaction 
    }}>
      {children}
    </BalanceContext.Provider>
  )
}

export const useBalance = () => {
  const context = useContext(BalanceContext)
  if (context === undefined) {
    throw new Error('useBalance must be used within a BalanceProvider')
  }
  return context
}