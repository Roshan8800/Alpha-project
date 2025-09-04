import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  TrendingUp,
  TrendingDown,
  PieChart,
  BarChart3,
  Zap,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function InvestScreen() {
  const portfolioValue = 2847.92;
  const todayChange = 42.67;
  const todayChangePercent = 1.52;

  const investments = [
    {
      name: 'Tech Growth ETF',
      symbol: 'TECH',
      value: 1245.67,
      change: 23.45,
      changePercent: 1.92,
      color: '#10B981',
    },
    {
      name: 'S&P 500 Index',
      symbol: 'SPY',
      value: 892.33,
      change: 12.22,
      changePercent: 1.39,
      color: '#3B82F6',
    },
    {
      name: 'Crypto Bundle',
      symbol: 'CRYPTO',
      value: 456.78,
      change: -8.91,
      changePercent: -1.91,
      color: '#F59E0B',
    },
    {
      name: 'Clean Energy',
      symbol: 'CLEAN',
      value: 253.14,
      change: 15.91,
      changePercent: 6.72,
      color: '#10B981',
    },
  ];

  const recommendations = [
    {
      title: 'Diversify with Bonds',
      description: 'Add stability to your portfolio',
      risk: 'Low',
      potentialReturn: '4-6%',
      color: '#3B82F6',
    },
    {
      title: 'Growth Stocks',
      description: 'High potential tech companies',
      risk: 'High',
      potentialReturn: '10-15%',
      color: '#8B5CF6',
    },
    {
      title: 'Real Estate ETF',
      description: 'Exposure to property market',
      risk: 'Medium',
      potentialReturn: '6-9%',
      color: '#10B981',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Invest & Grow</Text>
        <TouchableOpacity style={styles.analyticsButton}>
          <BarChart3 color="#8B5CF6" size={24} />
        </TouchableOpacity>
      </View>

      {/* Portfolio Overview */}
      <LinearGradient
        colors={['#1E293B', '#374151']}
        style={styles.portfolioCard}
      >
        <View style={styles.portfolioHeader}>
          <Text style={styles.portfolioLabel}>Portfolio Value</Text>
          <View style={styles.changeIndicator}>
            <TrendingUp color="#10B981" size={16} />
            <Text style={styles.changeText}>+{todayChangePercent}%</Text>
          </View>
        </View>
        <Text style={styles.portfolioValue}>
          ${portfolioValue.toLocaleString()}
        </Text>
        <Text style={styles.portfolioChange}>
          +${todayChange.toFixed(2)} today
        </Text>
      </LinearGradient>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Invest</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#10B981' }]}>
              <Zap color="#ffffff" size={24} />
            </View>
            <Text style={styles.quickActionText}>Auto Invest</Text>
            <Text style={styles.quickActionSubtext}>$50/week</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#3B82F6' }]}>
              <PieChart color="#ffffff" size={24} />
            </View>
            <Text style={styles.quickActionText}>Balanced</Text>
            <Text style={styles.quickActionSubtext}>Mix of assets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickAction}>
            <View style={[styles.quickActionIcon, { backgroundColor: '#8B5CF6' }]}>
              <TrendingUp color="#ffffff" size={24} />
            </View>
            <Text style={styles.quickActionText}>Aggressive</Text>
            <Text style={styles.quickActionSubtext}>High growth</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Holdings */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Holdings</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.holdingsList}>
          {investments.map((investment, index) => (
            <InvestmentCard key={index} investment={investment} />
          ))}
        </View>
      </View>

      {/* Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended for You</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {recommendations.map((rec, index) => (
            <RecommendationCard key={index} recommendation={rec} />
          ))}
        </ScrollView>
      </View>

      {/* Learning Section */}
      <View style={styles.learningSection}>
        <Text style={styles.learnTitle}>📚 Learn as You Grow</Text>
        <Text style={styles.learnDescription}>
          Check out our bite-sized lessons on investing basics
        </Text>
        <TouchableOpacity style={styles.learnButton}>
          <Text style={styles.learnButtonText}>Start Learning</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InvestmentCard({ investment }: { investment: any }) {
  const isPositive = investment.change >= 0;

  return (
    <View style={styles.investmentCard}>
      <View style={styles.investmentHeader}>
        <View>
          <Text style={styles.investmentName}>{investment.name}</Text>
          <Text style={styles.investmentSymbol}>{investment.symbol}</Text>
        </View>
        <View style={styles.investmentValues}>
          <Text style={styles.investmentValue}>
            ${investment.value.toLocaleString()}
          </Text>
          <View style={styles.investmentChange}>
            {isPositive ? (
              <TrendingUp color="#10B981" size={14} />
            ) : (
              <TrendingDown color="#EF4444" size={14} />
            )}
            <Text style={[
              styles.changeValue,
              { color: isPositive ? '#10B981' : '#EF4444' }
            ]}>
              {isPositive ? '+' : ''}${Math.abs(investment.change).toFixed(2)}
            </Text>
            <Text style={[
              styles.changePercent,
              { color: isPositive ? '#10B981' : '#EF4444' }
            ]}>
              ({isPositive ? '+' : ''}{investment.changePercent.toFixed(2)}%)
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.investmentBar}>
        <View
          style={[
            styles.investmentBarFill,
            { backgroundColor: investment.color, width: '60%' }
          ]}
        />
      </View>
    </View>
  );
}

function RecommendationCard({ recommendation }: { recommendation: any }) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'High': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <View style={[styles.recommendationCard, { borderLeftColor: recommendation.color }]}>
      <Text style={styles.recTitle}>{recommendation.title}</Text>
      <Text style={styles.recDescription}>{recommendation.description}</Text>
      <View style={styles.recStats}>
        <View style={styles.recStat}>
          <Text style={styles.recStatLabel}>Risk</Text>
          <Text style={[styles.recStatValue, { color: getRiskColor(recommendation.risk) }]}>
            {recommendation.risk}
          </Text>
        </View>
        <View style={styles.recStat}>
          <Text style={styles.recStatLabel}>Return</Text>
          <Text style={styles.recStatValue}>{recommendation.potentialReturn}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.recButton}>
        <Text style={styles.recButtonText}>Learn More</Text>
      </TouchableOpacity>
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
  analyticsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portfolioCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  portfolioLabel: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  changeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  portfolioValue: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  portfolioChange: {
    color: '#10B981',
    fontSize: 16,
    fontWeight: '600',
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
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  quickActionSubtext: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  holdingsList: {
    gap: 12,
  },
  investmentCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 16,
  },
  investmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  investmentName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  investmentSymbol: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  investmentValues: {
    alignItems: 'flex-end',
  },
  investmentValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  investmentChange: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
    gap: 4,
  },
  changeValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  changePercent: {
    fontSize: 12,
  },
  investmentBar: {
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
  },
  investmentBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  recommendationCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: width * 0.7,
    borderLeftWidth: 4,
  },
  recTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  recDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 16,
  },
  recStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  recStat: {
    flex: 1,
  },
  recStatLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 2,
  },
  recStatValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  recButton: {
    backgroundColor: '#374151',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  recButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  learningSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  learnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  learnDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  learnButton: {
    backgroundColor: '#8B5CF6',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  learnButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
