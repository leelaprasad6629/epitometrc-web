import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import * as Updates from 'expo-updates';
import { getStoredToken, api } from '@/services/api';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();

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

  // Validate authentication state and roles on startup
  useEffect(() => {
    async function checkAuth() {
      try {
        const token = await getStoredToken();
        if (!token) {
          setIsAuthenticated(false);
          setRole(null);
          setLoading(false);
          await SplashScreen.hideAsync();
          return;
        }

        // Fetch user metadata from backend to confirm session
        const { status, data } = await api.auth.me();
        if (status === 200 && data.success && data.user) {
          setIsAuthenticated(true);
          setRole(data.user.role);
        } else {
          // Token is expired or invalid
          setIsAuthenticated(false);
          setRole(null);
        }
      } catch {
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setLoading(false);
        await SplashScreen.hideAsync();
      }
    }
    checkAuth();
  }, []);

  // Protect and redirect routes dynamically based on auth status
  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inStudentGroup = segments[0] === 'student';
    const inEmployeeGroup = segments[0] === 'employee';

    if (!isAuthenticated) {
      // Direct unauthenticated users to the onboarding screen
      if (inStudentGroup || inEmployeeGroup) {
        router.replace('/');
      }
    } else {
      // Redirect authenticated users to their portal
      if (role === 'Student' && !inStudentGroup) {
        router.replace('/student/dashboard');
      } else if ((role === 'Employee' || role === 'Admin') && !inEmployeeGroup) {
        router.replace('/employee/dashboard');
      }
    }
  }, [isAuthenticated, role, segments, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F9FF' }}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
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
