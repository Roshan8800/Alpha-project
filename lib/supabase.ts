import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          date_of_birth: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          date_of_birth?: string | null;
        };
      };
      accounts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          type: 'checking' | 'savings' | 'credit' | 'investment';
          balance: number;
          card_number: string | null;
          account_number: string | null;
          routing_number: string | null;
          is_primary: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          name: string;
          type: 'checking' | 'savings' | 'credit' | 'investment';
          balance?: number;
          card_number?: string | null;
          account_number?: string | null;
          routing_number?: string | null;
          is_primary?: boolean;
          is_active?: boolean;
        };
        Update: {
          name?: string;
          type?: 'checking' | 'savings' | 'credit' | 'investment';
          balance?: number;
          card_number?: string | null;
          account_number?: string | null;
          routing_number?: string | null;
          is_primary?: boolean;
          is_active?: boolean;
        };
      };
      savings_goals: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          target_amount: number;
          current_amount: number;
          emoji: string;
          color: string;
          target_date: string | null;
          is_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          description?: string | null;
          target_amount: number;
          current_amount?: number;
          emoji?: string;
          color?: string;
          target_date?: string | null;
          is_completed?: boolean;
        };
        Update: {
          title?: string;
          description?: string | null;
          target_amount?: number;
          current_amount?: number;
          emoji?: string;
          color?: string;
          target_date?: string | null;
          is_completed?: boolean;
        };
      };
      transactions: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          savings_goal_id: string | null;
          title: string;
          description: string | null;
          amount: number;
          category: string;
          type: 'income' | 'expense' | 'transfer' | 'savings';
          merchant: string | null;
          emoji: string | null;
          transaction_date: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          account_id?: string | null;
          savings_goal_id?: string | null;
          title: string;
          description?: string | null;
          amount: number;
          category: string;
          type: 'income' | 'expense' | 'transfer' | 'savings';
          merchant?: string | null;
          emoji?: string | null;
          transaction_date?: string;
        };
        Update: {
          account_id?: string | null;
          savings_goal_id?: string | null;
          title?: string;
          description?: string | null;
          amount?: number;
          category?: string;
          type?: 'income' | 'expense' | 'transfer' | 'savings';
          merchant?: string | null;
          emoji?: string | null;
          transaction_date?: string;
        };
      };
      investments: {
        Row: {
          id: string;
          user_id: string;
          symbol: string;
          name: string;
          investment_type: 'stock' | 'etf' | 'crypto' | 'bond' | 'mutual_fund';
          shares: number;
          average_cost: number;
          current_price: number;
          current_value: number;
          total_return: number;
          return_percentage: number;
          color: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          symbol: string;
          name: string;
          investment_type: 'stock' | 'etf' | 'crypto' | 'bond' | 'mutual_fund';
          shares?: number;
          average_cost?: number;
          current_price?: number;
          current_value?: number;
          total_return?: number;
          return_percentage?: number;
          color?: string;
        };
        Update: {
          symbol?: string;
          name?: string;
          investment_type?: 'stock' | 'etf' | 'crypto' | 'bond' | 'mutual_fund';
          shares?: number;
          average_cost?: number;
          current_price?: number;
          current_value?: number;
          total_return?: number;
          return_percentage?: number;
          color?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          emoji: string;
          category: string;
          requirement_type: string;
          requirement_value: number | null;
          is_active: boolean;
          created_at: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          earned_at: string;
        };
        Insert: {
          user_id: string;
          achievement_id: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string | null;
          type: 'goal_progress' | 'transaction' | 'achievement' | 'reminder' | 'system';
          is_read: boolean;
          data: any;
          created_at: string;
        };
        Insert: {
          user_id: string;
          title: string;
          message?: string | null;
          type: 'goal_progress' | 'transaction' | 'achievement' | 'reminder' | 'system';
          is_read?: boolean;
          data?: any;
        };
        Update: {
          is_read?: boolean;
        };
      };
    };
  };
};
