export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Profile {
  id: string
  username: string | null
  created_at: string
  updated_at: string
}

export interface Balance {
  id: string
  user_id: string
  amount: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'deposit' | 'withdraw' | 'case_open'
  amount: number
  status: 'pending' | 'completed' | 'failed'
  created_at: string
  updated_at: string
}

export interface RouletteBet {
  id: string;
  user_id: string;
  game_id: string;
  bet_amount: number;
  bet_color: 'red' | 'black' | 'green';
  created_at: string;
}

export interface RouletteGame {
  id: string;
  result: 'red' | 'black' | 'green' | null;
  start_time: string;
  end_time: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'created_at' | 'updated_at'>>
      }
      balances: {
        Row: Balance
        Insert: Omit<Balance, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Balance, 'id' | 'created_at' | 'updated_at'>>
      }
      transactions: {
        Row: Transaction
        Insert: Omit<Transaction, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Transaction, 'id' | 'created_at' | 'updated_at'>>
      }
      roulette_bets: {
        Row: RouletteBet
        Insert: Omit<RouletteBet, 'id' | 'created_at'>
        Update: Partial<Omit<RouletteBet, 'id' | 'created_at'>>
      }
      roulette_games: {
        Row: RouletteGame
        Insert: Omit<RouletteGame, 'id' | 'created_at'>
        Update: Partial<Omit<RouletteGame, 'id' | 'created_at'>>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
