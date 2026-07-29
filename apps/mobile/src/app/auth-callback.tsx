import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { setStoredToken, api } from '@/services/api';

export default function AuthCallbackScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();

  useEffect(() => {
    async function verifyAndRedirect() {
      if (token) {
        try {
          // Store token securely
          await setStoredToken(token);

          // Verify token role against API
          const profileRes = await api.auth.me();
          if (profileRes.status === 200 && profileRes.data.success && profileRes.data.user) {
            const userRole = profileRes.data.user.role;
            if (userRole === 'Student') {
              router.replace('/student/dashboard');
              return;
            }
          }
        } catch (error) {
          console.error('Google Sign-In callback verification failure:', error);
        }
      }
      // Redirect back to login if credentials are missing or verification fails
      router.replace('/auth/login');
    }
    verifyAndRedirect();
  }, [token]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#F97316" />
      <Text style={styles.loadingText}>Finalizing secure Google Sign-In...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b172a',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
});
