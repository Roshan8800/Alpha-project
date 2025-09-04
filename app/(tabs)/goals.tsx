import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus, Calendar, DollarSign, X } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import { GoalService } from '../../services/goalService';
import AuthScreen from '../../components/AuthScreen';

export default function GoalsScreen() {
  const { user } = useAuth();
  const { savingsGoals, refetchData } = useUserData();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    target_amount: '',
    emoji: '🎯',
    color: '#8B5CF6',
  });

  if (!user) {
    return <AuthScreen />;
  }

  const colors = ['#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#3B82F6', '#EF4444'];

  const createGoal = async () => {
    if (!newGoal.title || !newGoal.target_amount) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const targetAmount = parseFloat(newGoal.target_amount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid target amount');
      return;
    }

    setCreating(true);

    try {
      const { error } = await GoalService.createGoal(user.id, {
        title: newGoal.title,
        target_amount: targetAmount,
        emoji: newGoal.emoji,
        color: newGoal.color,
      });

      if (error) {
        Alert.alert('Error', 'Failed to create goal. Please try again.');
        console.error('Error creating goal:', error);
      } else {
        setShowCreateModal(false);
        setNewGoal({ title: '', target_amount: '', emoji: '🎯', color: '#8B5CF6' });
        Alert.alert('Success', 'Goal created successfully!');
        refetchData();
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
      console.error('Error creating goal:', error);
    } finally {
      setCreating(false);
    }
  };

  const addMoneyToGoal = async (goalId: string, goalTitle: string) => {
    Alert.prompt(
      'Add Money',
      `How much would you like to add to "${goalTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async (amountStr) => {
            if (!amountStr) return;
            
            const amount = parseFloat(amountStr);
            if (isNaN(amount) || amount <= 0) {
              Alert.alert('Error', 'Please enter a valid amount');
              return;
            }

            try {
              const { error } = await GoalService.addMoneyToGoal(goalId, amount);
              if (error) {
                Alert.alert('Error', 'Failed to add money. Please try again.');
              } else {
                Alert.alert('Success', `$${amount} added to ${goalTitle}!`);
                refetchData();
              }
            } catch {
              Alert.alert('Error', 'Something went wrong. Please try again.');
            }
          },
        },
      ],
      'plain-text',
      '',
      'numeric'
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchData();
    setRefreshing(false);
  };

  // Calculate stats
  const activeGoals = savingsGoals.filter(goal => !goal.is_completed);
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const avgProgress = savingsGoals.length > 0 
    ? savingsGoals.reduce((sum, goal) => {
        const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
        return sum + Math.min(progress, 100);
      }, 0) / savingsGoals.length
    : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Goals</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowCreateModal(true)}
        >
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{activeGoals.length}</Text>
          <Text style={styles.statLabel}>Active Goals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>${totalSaved.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Total Saved</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{Math.round(avgProgress)}%</Text>
          <Text style={styles.statLabel}>Avg Progress</Text>
        </View>
      </View>

      {/* Goals List */}
      <ScrollView 
        style={styles.goalsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {savingsGoals.length > 0 ? (
          savingsGoals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onAddMoney={() => addMoneyToGoal(goal.id, goal.title)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No Goals Yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first savings goal to start building your financial future!
            </Text>
            <TouchableOpacity
              style={styles.createFirstGoalButton}
              onPress={() => setShowCreateModal(true)}
            >
              <Text style={styles.createFirstGoalText}>Create Your First Goal</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Create Goal Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Goal</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <X color="#9CA3AF" size={24} />
              </TouchableOpacity>
            </View>

            <View style={styles.emojiSelector}>
              {['🎯', '📱', '🏖️', '🎮', '🚗', '🏠', '💍', '🎓'].map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={[
                    styles.emojiOption,
                    newGoal.emoji === emoji && styles.emojiSelected,
                  ]}
                  onPress={() => setNewGoal({ ...newGoal, emoji })}
                >
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.colorSelector}>
              <Text style={styles.selectorLabel}>Choose Color:</Text>
              <View style={styles.colorOptions}>
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      newGoal.color === color && styles.colorSelected,
                    ]}
                    onPress={() => setNewGoal({ ...newGoal, color })}
                  />
                ))}
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Goal name (e.g., New iPhone)"
              placeholderTextColor="#9CA3AF"
              value={newGoal.title}
              onChangeText={(title) => setNewGoal({ ...newGoal, title })}
            />

            <TextInput
              style={styles.input}
              placeholder="Target amount"
              placeholderTextColor="#9CA3AF"
              value={newGoal.target_amount}
              onChangeText={(target_amount) => setNewGoal({ ...newGoal, target_amount })}
              keyboardType="numeric"
            />

            <TouchableOpacity 
              style={[styles.createButton, creating && styles.createButtonDisabled]} 
              onPress={createGoal}
              disabled={creating}
            >
              <Text style={styles.createButtonText}>
                {creating ? 'Creating...' : 'Create Goal'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function GoalCard({ goal, onAddMoney }: { goal: any; onAddMoney: () => void }) {
  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;
  const remaining = Math.max(0, goal.target_amount - goal.current_amount);

  return (
    <View style={[styles.goalCard, { borderLeftColor: goal.color }]}>
      <View style={styles.goalHeader}>
        <View style={styles.goalTitleRow}>
          <Text style={styles.goalEmoji}>{goal.emoji}</Text>
          <View style={styles.goalInfo}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            {goal.is_completed && (
              <Text style={styles.completedBadge}>✅ Completed!</Text>
            )}
          </View>
        </View>
        {!goal.is_completed && (
          <TouchableOpacity style={styles.addMoneyButton} onPress={onAddMoney}>
            <Plus color="#8B5CF6" size={20} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.goalProgress}>
        <View style={styles.amountRow}>
          <Text style={styles.currentAmount}>
            ${goal.current_amount.toLocaleString()}
          </Text>
          <Text style={styles.targetAmount}>
            of ${goal.target_amount.toLocaleString()}
          </Text>
        </View>

        <View style={styles.progressBar}>
          <LinearGradient
            colors={[goal.color, goal.color + '80']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]}
          />
        </View>

        <View style={styles.progressStats}>
          <Text style={styles.progressPercent}>{Math.round(progress)}% complete</Text>
          {!goal.is_completed && (
            <Text style={styles.remainingAmount}>${remaining.toLocaleString()} to go</Text>
          )}
        </View>
      </View>

      {!goal.is_completed && (
        <View style={styles.goalActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onAddMoney}>
            <DollarSign color="#10B981" size={16} />
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Calendar color="#8B5CF6" size={16} />
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  goalsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  goalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  goalEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  completedBadge: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  addMoneyButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalProgress: {
    marginBottom: 16,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  targetAmount: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  remainingAmount: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  goalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  createFirstGoalButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createFirstGoalText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  emojiSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiSelected: {
    backgroundColor: '#8B5CF6',
  },
  emojiText: {
    fontSize: 20,
  },
  colorSelector: {
    marginBottom: 24,
  },
  selectorLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  colorOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSelected: {
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.7,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
