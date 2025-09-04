import { supabase } from '../lib/supabase';
import { SavingsGoal } from '../hooks/useUserData';

export interface CreateGoalData {
  title: string;
  description?: string;
  target_amount: number;
  emoji?: string;
  color?: string;
  target_date?: string;
}

export interface UpdateGoalData extends Partial<CreateGoalData> {
  current_amount?: number;
  is_completed?: boolean;
}

export class GoalService {
  static async createGoal(userId: string, goalData: CreateGoalData): Promise<{ data: SavingsGoal | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .insert({
          user_id: userId,
          ...goalData,
        })
        .select()
        .single();

      if (error) throw error;

      // Check for achievements
      await this.checkGoalAchievements(userId);

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async updateGoal(goalId: string, updates: UpdateGoalData): Promise<{ data: SavingsGoal | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('savings_goals')
        .update(updates)
        .eq('id', goalId)
        .select()
        .single();

      if (error) throw error;

      // If goal was completed, check for achievements
      if (updates.is_completed) {
        const { data: goalData } = await supabase
          .from('savings_goals')
          .select('user_id')
          .eq('id', goalId)
          .single();

        if (goalData) {
          await this.checkGoalAchievements(goalData.user_id);
        }
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  static async deleteGoal(goalId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('savings_goals')
        .delete()
        .eq('id', goalId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  static async addMoneyToGoal(goalId: string, amount: number, description?: string): Promise<{ error: any }> {
    try {
      // Get current goal data
      const { data: goal, error: goalError } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('id', goalId)
        .single();

      if (goalError) throw goalError;

      const newAmount = goal.current_amount + amount;
      const isCompleted = newAmount >= goal.target_amount;

      // Update goal amount
      const { error: updateError } = await supabase
        .from('savings_goals')
        .update({
          current_amount: newAmount,
          is_completed: isCompleted,
        })
        .eq('id', goalId);

      if (updateError) throw updateError;

      // Create transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: goal.user_id,
          savings_goal_id: goalId,
          title: `${goal.title} - Savings`,
          description: description || 'Added to savings goal',
          amount: amount,
          category: 'Savings',
          type: 'savings',
          emoji: goal.emoji,
        });

      if (transactionError) throw transactionError;

      // Check for achievements if goal completed
      if (isCompleted) {
        await this.checkGoalAchievements(goal.user_id);
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  private static async checkGoalAchievements(userId: string) {
    try {
      // Get user's goal stats
      const { data: goals } = await supabase
        .from('savings_goals')
        .select('*')
        .eq('user_id', userId);

      if (!goals) return;

      const completedGoals = goals.filter(g => g.is_completed).length;
      const totalGoals = goals.length;

      // Check for achievements
      const achievementsToGrant = [];

      if (totalGoals >= 1) {
        achievementsToGrant.push('First Goal');
      }

      if (completedGoals >= 1) {
        achievementsToGrant.push('Goal Achiever');
      }

      // Grant achievements
      for (const achievementTitle of achievementsToGrant) {
        await this.grantAchievement(userId, achievementTitle);
      }
    } catch (error) {
      console.error('Error checking goal achievements:', error);
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
