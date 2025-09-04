import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>💰 FinZen</Text>
        <ActivityIndicator size="large" color="#8B5CF6" style={styles.spinner} />
      </View>
      <View style={styles.footer}>
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
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  spinner: {
    marginTop: 32,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  authorText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E7EB',
    marginTop: 4,
  },
});
