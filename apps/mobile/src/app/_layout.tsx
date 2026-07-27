import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import * as Updates from 'expo-updates';
import { getStoredToken, setStoredToken, api } from '@/services/api';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

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

  // Initialize and hide splash screen
  useEffect(() => {
    async function initApp() {
      try {
        const token = await getStoredToken();
        if (token) {
          const { status, data } = await api.auth.me();
          if (status === 200 && data.success && data.user) {
            setIsAuthenticated(true);
            setRole(data.user.role);
          } else if (status === 401 || status === 403) {
            await setStoredToken(null);
          }
        }
      } catch {
        // Silent catch
      } finally {
        setLoading(false);
        await SplashScreen.hideAsync();
      }
    }
    initApp();
  }, []);

  // Handle active navigation protection and redirects
  useEffect(() => {
    if (loading) return;
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
          try {
            const { status, data } = await api.auth.me();
            if (status === 200 && data.success && data.user) {
              currentRole = data.user.role;
              setRole(currentRole);
              setIsAuthenticated(true);
            } else if (status === 401 || status === 403) {
              await setStoredToken(null);
              setIsAuthenticated(false);
              router.replace('/');
              return;
            } else {
              // Do not log out on 500 or timeout
              return;
            }
          } catch {
            return;
          }
        }

        if (currentRole === 'Student' && !inStudentGroup) {
          router.replace('/student/dashboard');
        } else if ((currentRole === 'Employee' || currentRole === 'Admin' || currentRole === 'Employer' || currentRole === 'Organization') && !inEmployeeGroup) {
          router.replace('/employee/dashboard');
        }
      }
    }

    checkNavigation();
  }, [segments, loading, role]);

  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/register" />
      <Stack.Screen name="student" />
      <Stack.Screen name="employee" />
    </Stack>
  );
}
