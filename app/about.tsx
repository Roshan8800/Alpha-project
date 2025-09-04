import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Constants from 'expo-constants';

export default function AboutScreen() {
  const appVersion = Constants.expoConfig?.version || '1.0.0';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 FinZen</Text>
      <Text style={styles.version}>Version {appVersion}</Text>
      <View style={styles.card}>
        <Text style={styles.cardText}>
          FinZen is a modern savings application designed to help you achieve your financial goals with ease and a bit of fun.
        </Text>
      </View>
      <View style={styles.authorContainer}>
        <Text style={styles.authorText}>Created by</Text>
        <Text style={styles.authorName}>Roshan Sahu</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  version: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 32,
  },
  cardText: {
    color: '#E5E7EB',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  authorContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  authorText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  authorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginTop: 4,
  },
});
