import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';
import * as Linking from 'expo-linking';
import { getStoredToken, setStoredToken, getStoredRole, setStoredRole, api } from '@/services/api';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isNavigating, setIsNavigating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [resolvedTarget, setResolvedTarget] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const incomingUrl = Linking.useURL();

  // Check for EAS OTA Updates on app launch
  useEffect(() => {
    async function checkUpdates() {
      if (__DEV__) return;
      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          Alert.alert(
            'App Update Available',
            'A new version is ready. Restart the app to apply UI optimizations and bug fixes.',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Restart Now', onPress: () => Updates.reloadAsync() }
            ]
          );
        }
      } catch {
        // Silent catch if update server is unreachable
      }
    }
    checkUpdates();
  }, []);

  // Initialize, restore session, and resolve route on cold launch
  useEffect(() => {
    if (!rootNavigationState?.key) return;

    async function initApp() {
      try {
        // 1. Check if the app was opened via an authentication deep link
        const initialUrl = await Linking.getInitialURL();
        let token: string | null = null;

        if (initialUrl && initialUrl.includes('auth-callback')) {
          const match = initialUrl.match(/[?&]token=([^&#]+)/);
          token = match ? match[1] : null;
          if (token) {
            await setStoredToken(token);
          }
        }

        // 2. If no deep link token, try to read from storage
        if (!token) {
          token = await getStoredToken();
        }

        if (token) {
          // Verify token against API and resolve role
          const { status, data } = await api.auth.me();
          if (status === 200 && data.success && data.user) {
            const userRole = data.user.role;
            setRole(userRole);
            setIsAuthenticated(true);
            await setStoredRole(userRole);

            const target = userRole === 'Student'
              ? '/student/dashboard'
              : '/employee/dashboard';
            setResolvedTarget(target);
            return;
          } else {
            // Stale or invalid credentials: clean storage
            await setStoredToken(null);
            await setStoredRole(null);
          }
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      } finally {
        setResolvedTarget('/');
      }
    }

    initApp();
  }, [rootNavigationState?.key]);

  // Handle incoming deep links (warm starts)
  useEffect(() => {
    if (!incomingUrl || !rootNavigationState?.key) return;

    if (incomingUrl.includes('auth-callback')) {
      const match = incomingUrl.match(/[?&]token=([^&#]+)/);
      const token = match ? match[1] : null;
      if (token) {
        setIsNavigating(true);

        async function handleDeepLink() {
          try {
            await setStoredToken(token);
            const { status, data } = await api.auth.me();
            if (status === 200 && data.success && data.user) {
              const userRole = data.user.role;
              setRole(userRole);
              setIsAuthenticated(true);
              await setStoredRole(userRole);

              const target = userRole === 'Student'
                ? '/student/dashboard'
                : '/employee/dashboard';
              setResolvedTarget(target);
            } else {
              await setStoredToken(null);
              await setStoredRole(null);
              setResolvedTarget('/');
            }
          } catch (err) {
            setResolvedTarget('/');
          }
        }
        handleDeepLink();
      }
    }
  }, [incomingUrl, rootNavigationState?.key]);

  // Synchronize route and hide splash overlay when target is reached
  useEffect(() => {
    if (!resolvedTarget || !rootNavigationState?.key) return;

    const segs = segments as string[];
    const isAtTarget =
      (resolvedTarget === '/' && segs.length === 0) ||
      (resolvedTarget === '/student/dashboard' && segs[0] === 'student' && segs[1] === 'dashboard') ||
      (resolvedTarget === '/employee/dashboard' && segs[0] === 'employee' && segs[1] === 'dashboard');

    if (isAtTarget) {
      setIsNavigating(false);
      SplashScreen.hideAsync();
    } else {
      if (resolvedTarget === '/') {
        router.replace('/');
      } else if (resolvedTarget === '/student/dashboard') {
        router.replace('/student/dashboard');
      } else if (resolvedTarget === '/employee/dashboard') {
        router.replace('/employee/dashboard');
      }
    }
  }, [resolvedTarget, segments, rootNavigationState?.key]);

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth/login" />
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="auth-callback" />
        <Stack.Screen name="student" />
        <Stack.Screen name="employee" />
      </Stack>
      {isNavigating && (
        <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: '#0b172a', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <ActivityIndicator size="large" color="#F97316" />
        </View>
      )}
    </View>
  );
}
