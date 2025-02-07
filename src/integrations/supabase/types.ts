export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      balances: {
        Row: {
          amount: number
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      case_items: {
        Row: {
          case_id: string | null
          created_at: string
          id: string
          image_url: string
          multiplier: number | null
          name: string
          odds: number
          rarity: string
          updated_at: string
          value: number
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          id?: string
          image_url: string
          multiplier?: number | null
          name: string
          odds: number
          rarity: string
          updated_at?: string
          value: number
        }
        Update: {
          case_id?: string | null
          created_at?: string
          id?: string
          image_url?: string
          multiplier?: number | null
          name?: string
          odds?: number
          rarity?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "case_items_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      case_openings: {
        Row: {
          case_id: string
          created_at: string
          id: string
          item_won: string
          user_id: string
          value_won: number
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          item_won: string
          user_id: string
          value_won: number
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          item_won?: string
          user_id?: string
          value_won?: number
        }
        Relationships: [
          {
            foreignKeyName: "case_openings_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "case_openings_item_won_fkey"
            columns: ["item_won"]
            isOneToOne: false
            referencedRelation: "case_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cases: {
        Row: {
          best_drop: string | null
          category: string
          created_at: string
          id: string
          image_url: string
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          best_drop?: string | null
          category: string
          created_at?: string
          id?: string
          image_url: string
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          best_drop?: string | null
          category?: string
          created_at?: string
          id?: string
          image_url?: string
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_rewards: {
        Row: {
          case_id: string | null
          created_at: string
          id: string
          level_required: number
          updated_at: string
        }
        Insert: {
          case_id?: string | null
          created_at?: string
          id?: string
          level_required: number
          updated_at?: string
        }
        Update: {
          case_id?: string | null
          created_at?: string
          id?: string
          level_required?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_rewards_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "cases"
            referencedColumns: ["id"]
          },
        ]
      }
      levels: {
        Row: {
          created_at: string
          id: number
          level_number: number
          updated_at: string
          xp_required: number
        }
        Insert: {
          created_at?: string
          id?: number
          level_number: number
          updated_at?: string
          xp_required: number
        }
        Update: {
          created_at?: string
          id?: number
          level_number?: number
          updated_at?: string
          xp_required?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          balance: number | null
          created_at: string
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          crypto_address: string | null
          id: string
          pending_amount: number | null
          status: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          crypto_address?: string | null
          id?: string
          pending_amount?: number | null
          status?: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          crypto_address?: string | null
          id?: string
          pending_amount?: number | null
          status?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          created_at: string
          current_level: number
          current_xp: number
          id: string
          last_reward_claim: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: number
          current_xp?: number
          id?: string
          last_reward_claim?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: number
          current_xp?: number
          id?: string
          last_reward_claim?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"] | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_daily_reward: {
        Args: {
          user_id: string
        }
        Returns: {
          case_id: string
          case_name: string
          success: boolean
          message: string
        }[]
      }
      increment_balance: {
        Args: {
          user_id: string
          amount: number
        }
        Returns: undefined
      }
      update_user_xp: {
        Args: {
          user_id: string
          xp_gained: number
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
