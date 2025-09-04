import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  PlusCircle,
  ArrowUpRight,
  Target,
  Award,
  Zap,
  TrendingUp,
} from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';
import { useUserData } from '../../hooks/useUserData';
import AuthScreen from '../../components/AuthScreen';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { 
    accounts, 
    savingsGoals, 
    transactions, 
    loading: dataLoading, 
    refetchData 
  } = useUserData();

  const [refreshing, setRefreshing] = useState(false);

  if (!user && !authLoading) {
    return <AuthScreen />;
  }

  if (authLoading || (user && dataLoading && !refreshing)) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current_amount, 0);
  const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.target_amount, 0);
  const savingsProgress = totalTargets > 0 ? (totalSaved / totalTargets) * 100 : 0;
  const recentTransactions = transactions.slice(0, 5);
  const activeGoals = savingsGoals.filter(goal => !goal.is_completed).slice(0, 3);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchData();
    setRefreshing(false);
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'New Goal':
        router.push('/(tabs)/goals');
        break;
      case 'Invest':
        router.push('/(tabs)/invest');
        break;
      default:
        Alert.alert('Coming Soon', `${action} feature will be available soon!`);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey {user?.full_name?.split(' ')[0] || 'there'}! 👋</Text>
          <Text style={styles.subtitle}>Ready to grow your money?</Text>
        </View>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/(tabs)/profile')}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileText}>
              {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['#8B5CF6', '#EC4899', '#F59E0B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.balanceCard}
      >
        <View style={styles.balanceContent}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
          <View style={styles.balanceChange}>
            <TrendingUp color="#ffffff" size={16} />
            <Text style={styles.changeText}>
              {savingsProgress.toFixed(1)}% savings progress
            </Text>
          </View>
        </View>
        <View style={styles.cardDecoration}>
          <View style={styles.decorationCircle} />
          <View style={styles.decorationCircle2} />
        </View>
      </LinearGradient>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('Add Money')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
              <PlusCircle color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>Add Money</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('Send')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
              <ArrowUpRight color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('New Goal')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
              <Target color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>New Goal</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleQuickAction('Invest')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F59E0B' }]}>
              <Zap color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionText}>Invest</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Goals</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/goals')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        {activeGoals.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {activeGoals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No active goals yet</Text>
            <Text style={styles.emptyStateSubtext}>Create your first savings goal to get started!</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/wallet')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsList}>
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No transactions yet</Text>
              <Text style={styles.emptyStateSubtext}>Your transaction history will appear here</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.achievementCard}>
        <View style={styles.achievementIcon}>
          <Award color="#F59E0B" size={24} />
        </View>
        <View style={styles.achievementContent}>
          <Text style={styles.achievementTitle}>Welcome to FinZen! 🎉</Text>
          <Text style={styles.achievementText}>
            Start your financial journey by setting your first savings goal!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function GoalCard({ goal }: { goal: any }) {
  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0;

  return (
    <View style={[styles.goalCard, { borderLeftColor: goal.color }]}>
      <View style={styles.goalHeader}>
        <Text style={styles.goalEmoji}>{goal.emoji}</Text>
        <Text style={styles.goalTitle}>{goal.title}</Text>
      </View>
      <Text style={styles.goalAmount}>${goal.current_amount.toLocaleString()}</Text>
      <Text style={styles.goalTarget}>of ${goal.target_amount.toLocaleString()}</Text>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(progress, 100)}%`, backgroundColor: goal.color },
          ]}
        />
      </View>
      <Text style={styles.progressText}>{Math.round(progress)}% complete</Text>
    </View>
  );
}

function TransactionItem({ transaction }: { transaction: any }) {
  const getColor = () => {
    switch (transaction.type) {
      case 'income':
        return '#10B981';
      case 'expense':
        return '#EF4444';
      case 'savings':
        return '#8B5CF6';
      default:
        return '#6B7280';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <View style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionEmoji}>{transaction.emoji || '💰'}</Text>
      </View>
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionTime}>{formatDate(transaction.transaction_date)}</Text>
      </View>
      <Text style={[styles.transactionAmount, { color: getColor() }]}>
        {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount).toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 4,
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  balanceCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    overflow: 'hidden',
  },
  balanceContent: {
    zIndex: 1,
  },
  balanceLabel: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.9,
  },
  balanceAmount: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  balanceChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeText: {
    color: '#ffffff',
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  cardDecoration: {
    position: 'absolute',
    right: -20,
    top: -20,
  },
  decorationCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorationCircle2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    right: 40,
    top: 40,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  seeAll: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  goalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: width * 0.65,
    borderLeftWidth: 4,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalEmoji: {
    fontSize: 24,
    marginRight: 8,
  },
  goalTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  goalAmount: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  goalTarget: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '600',
  },
  transactionsList: {
    gap: 12,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionEmoji: {
    fontSize: 20,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  transactionTime: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  achievementText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#1E293B',
    borderRadius: 12,
  },
  emptyStateText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
  },
});
