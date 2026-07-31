import React from 'react';
import { Tabs } from 'expo-router';
import { BookOpen, User, Sparkles, LogOut } from 'lucide-react-native';
import { TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function StudentLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await api.auth.logout();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#F97316',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          backgroundColor: '#FFFFFF',
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom + 4,
          paddingTop: 8,
        },
        tabBarIconStyle: {
          marginTop: -2,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
        },
        headerStyle: {
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: '800',
          color: '#0B172A',
        },
        headerRight: () => (
          <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16, padding: 4 }}>
            <LogOut size={18} color="#64748B" />
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerTitle: 'Student Dashboard',
          tabBarIcon: ({ color }) => <User size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Courses',
          headerTitle: 'Cohort Learning Paths',
          tabBarIcon: ({ color }) => <BookOpen size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="resume"
        options={{
          title: 'AI Copilot',
          headerTitle: 'AI Resume & Mock Screen',
          tabBarIcon: ({ color }) => <Sparkles size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
