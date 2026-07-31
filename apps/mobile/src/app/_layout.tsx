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

  const updatesInfo = typeof Updates.useUpdates === 'function' ? Updates.useUpdates() : null;
  const isUpdatePending = updatesInfo?.isUpdatePending;

  // Prompt the user to restart as soon as the background OTA update finishes downloading
  useEffect(() => {
    if (__DEV__) return;
    if (isUpdatePending) {
      Alert.alert(
        'App Update Available',
        'A new version has been downloaded. Restart the app to apply optimizations and fixes.',
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Restart Now', onPress: () => Updates.reloadAsync() }
        ]
      );
    }
  }, [isUpdatePending]);

  // Initialize, restore session, and resolve route on cold launch
  useEffect(() => {
    if (!rootNavigationState?.key) return;

    async function initApp() {
      let target = '/';
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

            target = userRole === 'Student'
              ? '/student/dashboard'
              : '/employee/dashboard';
          } else {
            // Stale or invalid credentials: clean storage
            await setStoredToken(null);
            await setStoredRole(null);
          }
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
      } finally {
        setResolvedTarget(target);
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

  // Synchronize route and hide splash overlay when target is reached during boot
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
      if (isNavigating) {
        if (resolvedTarget === '/') {
          router.replace('/');
        } else if (resolvedTarget === '/student/dashboard') {
          router.replace('/student/dashboard');
        } else if (resolvedTarget === '/employee/dashboard') {
          router.replace('/employee/dashboard');
        }
      }
    }
  }, [resolvedTarget, segments, isNavigating, rootNavigationState?.key]);

  // Active navigation guard: protects routes during active usage after boot
  useEffect(() => {
    if (isNavigating) return;
    if (!rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === 'auth';
    const inStudentGroup = segments[0] === 'student';
    const inEmployeeGroup = segments[0] === 'employee';

    async function checkNavigation() {
      const token = await getStoredToken();
      const isAuth = !!token;

      if (!isAuth) {
        if (inStudentGroup || inEmployeeGroup) {
          router.replace('/');
        }
      } else {
        let currentRole = role;
        if (!currentRole) {
          const cachedRole = await getStoredRole();
          if (cachedRole) {
            currentRole = cachedRole;
            setRole(currentRole);
          } else {
            try {
              const { status, data } = await api.auth.me();
              if (status === 200 && data.success && data.user) {
                currentRole = data.user.role;
                setRole(currentRole);
                await setStoredRole(currentRole);
              } else {
                await setStoredToken(null);
                await setStoredRole(null);
                router.replace('/');
                return;
              }
            } catch {
              return;
            }
          }
        }

        if (currentRole === 'Student') {
          if (!inStudentGroup) {
            router.replace('/student/dashboard');
          }
        } else if (currentRole === 'Employee' || currentRole === 'Admin' || currentRole === 'Employer' || currentRole === 'Organization') {
          if (!inEmployeeGroup) {
            router.replace('/employee/dashboard');
          }
        }
      }
    }

    checkNavigation();
  }, [segments, isNavigating, role, rootNavigationState?.key]);

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
