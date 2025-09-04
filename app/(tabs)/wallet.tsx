import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  MoreHorizontal,
  Eye,
  EyeOff,
  Plus,
  Banknote,
} from 'lucide-react-native';

export default function WalletScreen() {
  const [showBalance, setShowBalance] = React.useState(true);

  const cards = [
    {
      id: 1,
      name: 'Spending Card',
      type: 'Debit',
      balance: 1247.89,
      number: '**** 4829',
      gradient: ['#8B5CF6', '#EC4899'],
    },
    {
      id: 2,
      name: 'Savings Card',
      type: 'Savings',
      balance: 3425.67,
      number: '**** 7234',
      gradient: ['#10B981', '#059669'],
    },
  ];

  const transactions = [
    {
      id: 1,
      title: 'Coffee Shop',
      category: 'Food & Drink',
      amount: -4.50,
      time: '2 hours ago',
      icon: '☕',
      merchant: 'Starbucks',
    },
    {
      id: 2,
      title: 'Salary Deposit',
      category: 'Income',
      amount: 2500.00,
      time: '1 day ago',
      icon: '💼',
      merchant: 'Tech Corp',
    },
    {
      id: 3,
      title: 'Uber Ride',
      category: 'Transportation',
      amount: -12.30,
      time: '2 days ago',
      icon: '🚗',
      merchant: 'Uber',
    },
    {
      id: 4,
      title: 'Online Shopping',
      category: 'Shopping',
      amount: -89.99,
      time: '3 days ago',
      icon: '🛍️',
      merchant: 'Amazon',
    },
    {
      id: 5,
      title: 'Gym Membership',
      category: 'Health',
      amount: -29.99,
      time: '5 days ago',
      icon: '💪',
      merchant: 'Planet Fitness',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Wallet</Text>
        <TouchableOpacity style={styles.addCardButton}>
          <Plus color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>

      {/* Cards Section */}
      <View style={styles.cardsSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {cards.map((card) => (
            <CardComponent key={card.id} card={card} showBalance={showBalance} />
          ))}
          <AddCardButton />
        </ScrollView>
      </View>

      {/* Balance Visibility Toggle */}
      <View style={styles.balanceToggle}>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowBalance(!showBalance)}
        >
          {showBalance ? (
            <EyeOff color="#9CA3AF" size={20} />
          ) : (
            <Eye color="#9CA3AF" size={20} />
          )}
          <Text style={styles.toggleText}>
            {showBalance ? 'Hide Balance' : 'Show Balance'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#10B981' }]}>
              <ArrowDownLeft color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionTitle}>Receive</Text>
            <Text style={styles.actionSubtitle}>Get money from friends</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#3B82F6' }]}>
              <ArrowUpRight color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionTitle}>Send</Text>
            <Text style={styles.actionSubtitle}>Transfer to anyone</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard}>
            <View style={[styles.actionIcon, { backgroundColor: '#8B5CF6' }]}>
              <Banknote color="#ffffff" size={24} />
            </View>
            <Text style={styles.actionTitle}>Add Cash</Text>
            <Text style={styles.actionSubtitle}>Top up your wallet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionsList}>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

function CardComponent({ card, showBalance }: { card: any; showBalance: boolean }) {
  return (
    <LinearGradient
      colors={card.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardType}>{card.type}</Text>
        <TouchableOpacity>
          <MoreHorizontal color="#ffffff" size={24} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardName}>{card.name}</Text>
        <Text style={styles.cardBalance}>
          {showBalance ? `$${card.balance.toLocaleString()}` : '••••••'}
        </Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.cardNumber}>{card.number}</Text>
        <CreditCard color="rgba(255, 255, 255, 0.8)" size={32} />
      </View>

      {/* Card decorations */}
      <View style={styles.cardDecoration}>
        <View style={styles.decorationDot} />
        <View style={[styles.decorationDot, { marginLeft: 20, opacity: 0.6 }]} />
        <View style={[styles.decorationDot, { marginLeft: 40, opacity: 0.3 }]} />
      </View>
    </LinearGradient>
  );
}

function AddCardButton() {
  return (
    <TouchableOpacity style={styles.addCard}>
      <View style={styles.addCardContent}>
        <Plus color="#9CA3AF" size={32} />
        <Text style={styles.addCardText}>Add New Card</Text>
      </View>
    </TouchableOpacity>
  );
}

function TransactionItem({ transaction }: { transaction: any }) {
  const isPositive = transaction.amount > 0;

  return (
    <TouchableOpacity style={styles.transactionItem}>
      <View style={styles.transactionIcon}>
        <Text style={styles.transactionEmoji}>{transaction.icon}</Text>
      </View>
      
      <View style={styles.transactionDetails}>
        <Text style={styles.transactionTitle}>{transaction.title}</Text>
        <Text style={styles.transactionMerchant}>{transaction.merchant}</Text>
        <Text style={styles.transactionTime}>{transaction.time}</Text>
      </View>
      
      <View style={styles.transactionAmount}>
        <Text style={[
          styles.amountText,
          { color: isPositive ? '#10B981' : '#ffffff' }
        ]}>
          {isPositive ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
        </Text>
        <Text style={styles.categoryText}>{transaction.category}</Text>
      </View>
    </TouchableOpacity>
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
  addCardButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsSection: {
    paddingLeft: 20,
    marginBottom: 16,
  },
  card: {
    width: 300,
    height: 180,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardType: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '600',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  cardName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardBalance: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardNumber: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  cardDecoration: {
    position: 'absolute',
    top: -20,
    right: -20,
    flexDirection: 'row',
  },
  decorationDot: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  addCard: {
    width: 300,
    height: 180,
    borderRadius: 20,
    backgroundColor: '#1E293B',
    borderWidth: 2,
    borderColor: '#374151',
    borderStyle: 'dashed',
    marginRight: 16,
  },
  addCardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCardText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  balanceToggle: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  toggleText: {
    color: '#9CA3AF',
    fontSize: 14,
    marginLeft: 8,
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
    marginBottom: 16,
  },
  seeAll: {
    color: '#8B5CF6',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
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
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#374151',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
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
  transactionMerchant: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  transactionTime: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    alignItems: 'flex-end',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  categoryText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 2,
  },
});
