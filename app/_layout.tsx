import { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import SplashScreen from '../components/SplashScreen';

// Prevent the splash screen from auto-hiding before asset loading is complete.
ExpoSplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { loading } = useAuth();

  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      await ExpoSplashScreen.hideAsync();
    }
  }, [loading]);

  useEffect(() => {
    onLayoutRootView();
  }, [onLayoutRootView]);

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
      <Stack.Screen
        name="about"
        options={{
          presentation: 'modal',
          title: 'About FinZen',
          headerShown: true,
          headerStyle: { backgroundColor: '#1E293B' },
          headerTitleStyle: { color: '#ffffff', fontWeight: 'bold' },
          headerTintColor: '#ffffff',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <RootLayoutNav />
      <StatusBar style="light" />
    </AuthProvider>
  );
}
