import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  date_of_birth: string | null;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  balance: number;
  card_number: string | null;
  is_primary: boolean;
}

export interface SavingsGoal {
  id: string;
  title: string;
  description: string | null;
  target_amount: number;
  current_amount: number;
  emoji: string;
  color: string;
  target_date: string | null;
  is_completed: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  description: string | null;
  amount: number;
  category: string;
  type: 'income' | 'expense' | 'transfer' | 'savings';
  merchant: string | null;
  emoji: string | null;
  transaction_date: string;
  account_id: string | null;
  savings_goal_id: string | null;
}

export interface Investment {
  id: string;
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
}

export function useUserData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
      setupRealtimeSubscriptions();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all user data in parallel
      const [
        profileRes,
        accountsRes,
        goalsRes,
        transactionsRes,
        investmentsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user!.id).single(),
        supabase.from('accounts').select('*').eq('user_id', user!.id).order('created_at'),
        supabase.from('savings_goals').select('*').eq('user_id', user!.id).order('created_at'),
        supabase.from('transactions').select('*').eq('user_id', user!.id).order('transaction_date', { ascending: false }).limit(50),
        supabase.from('investments').select('*').eq('user_id', user!.id).order('created_at'),
      ]);

      if (profileRes.error) throw profileRes.error;
      if (accountsRes.error) throw accountsRes.error;
      if (goalsRes.error) throw goalsRes.error;
      if (transactionsRes.error) throw transactionsRes.error;
      if (investmentsRes.error) throw investmentsRes.error;

      setProfile(profileRes.data);
      setAccounts(accountsRes.data || []);
      setSavingsGoals(goalsRes.data || []);
      setTransactions(transactionsRes.data || []);
      setInvestments(investmentsRes.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    if (!user) return;

    // Subscribe to accounts changes
    const accountsSubscription = supabase
      .channel('accounts')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'accounts', filter: `user_id=eq.${user.id}` },
        () => {
          loadUserData();
        }
      )
      .subscribe();

    // Subscribe to goals changes
    const goalsSubscription = supabase
      .channel('savings_goals')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'savings_goals', filter: `user_id=eq.${user.id}` },
        () => {
          loadUserData();
        }
      )
      .subscribe();

    // Subscribe to transactions changes
    const transactionsSubscription = supabase
      .channel('transactions')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${user.id}` },
        () => {
          loadUserData();
        }
      )
      .subscribe();

    return () => {
      accountsSubscription.unsubscribe();
      goalsSubscription.unsubscribe();
      transactionsSubscription.unsubscribe();
    };
  };

  const refetchData = () => {
    if (user) {
      loadUserData();
    }
  };

  return {
    profile,
    accounts,
    savingsGoals,
    transactions,
    investments,
    loading,
    error,
    refetchData,
  };
}
