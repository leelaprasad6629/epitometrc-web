import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import * as Updates from 'expo-updates';
import { getStoredToken, setStoredToken, getStoredRole, setStoredRole, api } from '@/services/api';

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

  // Initialize and hide splash screen instantly by using cached credentials
  useEffect(() => {
    async function initApp() {
      try {
        const token = await getStoredToken();
        const cachedRole = await getStoredRole();
        
        if (token && cachedRole) {
          setIsAuthenticated(true);
          setRole(cachedRole);
          
          // Verify token authenticity in the background, without blocking boot
          api.auth.me().then(({ status, data }) => {
            if (status === 200 && data.success && data.user) {
              setRole(data.user.role);
              setStoredRole(data.user.role);
            } else {
              // Stale or invalid token: clean storage and redirect to login
              setStoredToken(null);
              setStoredRole(null);
              setIsAuthenticated(false);
              setRole(null);
              router.replace('/');
            }
          }).catch(() => {});
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
          // Check cached role first before firing API requests
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
                setIsAuthenticated(true);
              } else {
                await setStoredToken(null);
                await setStoredRole(null);
                setIsAuthenticated(false);
                router.replace('/');
                return;
              }
            } catch {
              return;
            }
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
