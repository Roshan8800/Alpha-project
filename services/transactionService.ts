import { supabase } from '../lib/supabase';
import { Transaction } from '../hooks/useUserData';

export interface CreateTransactionData {
  title: string;
  description?: string;
  amount: number;
  category: string;
  type: 'income' | 'expense' | 'transfer' | 'savings';
  merchant?: string;
  emoji?: string;
  account_id?: string;
  savings_goal_id?: string;
}

export class TransactionService {
  static async createTransaction(userId: string, transactionData: CreateTransactionData): Promise<{ data: Transaction | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          ...transactionData,
        })
        .select()
        .single();

      if (error) throw error;

      // Update account balance if account_id is provided
      if (transactionData.account_id) {
        await this.updateAccountBalance(transactionData.account_id, transactionData.amount, transactionData.type);
      }

      // Check for achievements
      await this.checkTransactionAchievements(userId);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async updateTransaction(transactionId: string, updates: Partial<CreateTransactionData>): Promise<{ data: Transaction | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .update(updates)
        .eq('id', transactionId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async deleteTransaction(transactionId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  static async getTransactionsByCategory(userId: string, category?: string): Promise<{ data: Transaction[] | null; error: any }> {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('transaction_date', { ascending: false });

      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async getTransactionsByDateRange(userId: string, startDate: string, endDate: string): Promise<{ data: Transaction[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .gte('transaction_date', startDate)
        .lte('transaction_date', endDate)
        .order('transaction_date', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  private static async updateAccountBalance(accountId: string, amount: number, type: 'income' | 'expense' | 'transfer' | 'savings') {
    try {
      const { data: account } = await supabase
        .from('accounts')
        .select('balance')
        .eq('id', accountId)
        .single();

      if (!account) return;

      let balanceChange = 0;
      switch (type) {
        case 'income':
          balanceChange = amount;
          break;
        case 'expense':
          balanceChange = -Math.abs(amount);
          break;
        case 'savings':
          balanceChange = -Math.abs(amount);
          break;
        case 'transfer':
          // Handle transfer logic separately
          break;
      }

      if (balanceChange !== 0) {
        await supabase
          .from('accounts')
          .update({
            balance: account.balance + balanceChange,
          })
          .eq('id', accountId);
      }
    } catch (error) {
      console.error('Error updating account balance:', error);
    }
  }

  private static async checkTransactionAchievements(userId: string) {
    try {
      // Get user's transaction stats
      const { data: transactions } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);

      if (!transactions) return;

      const totalTransactions = transactions.length;
      const savingsTransactions = transactions.filter(t => t.type === 'savings').length;

      // Check for achievements
      const achievementsToGrant = [];

      if (totalTransactions >= 1) {
        achievementsToGrant.push('Saver');
      }

      if (savingsTransactions >= 10) {
        achievementsToGrant.push('Consistent Saver');
      }

      // Grant achievements
      for (const achievementTitle of achievementsToGrant) {
        await this.grantAchievement(userId, achievementTitle);
      }
    } catch (error) {
      console.error('Error checking transaction achievements:', error);
    }
  }

  private static async grantAchievement(userId: string, achievementTitle: string) {
    try {
      // Get achievement
      const { data: achievement } = await supabase
        .from('achievements')
        .select('*')
        .eq('title', achievementTitle)
        .single();

      if (!achievement) return;

      // Check if user already has this achievement
      const { data: existing } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id)
        .single();

      if (existing) return;

      // Grant achievement
      await supabase
        .from('user_achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
        });

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: 'Achievement Unlocked!',
          message: `You've earned the "${achievement.title}" achievement!`,
          type: 'achievement',
          data: { achievement_id: achievement.id },
        });
    } catch (error) {
      console.error('Error granting achievement:', error);
    }
  }
}
