import React from 'react';
import { Tabs } from 'expo-router';
import { LayoutDashboard, Users, GraduationCap, ClipboardCheck, LogOut } from 'lucide-react-native';
import { TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

export default function EmployeeLayout() {
  const router = useRouter();

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
        tabBarActiveTintColor: '#F97316',
        tabBarInactiveTintColor: '#64748B',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E2E8F0',
          backgroundColor: '#FFFFFF',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
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
          title: 'Overview',
          headerTitle: 'Executive Summary',
          tabBarIcon: ({ color }) => <LayoutDashboard size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="recruitment"
        options={{
          title: 'Candidates',
          headerTitle: 'Candidate Placement Center',
          tabBarIcon: ({ color }) => <Users size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="trainings"
        options={{
          title: 'Trainings',
          headerTitle: 'Cohort Tracks',
          tabBarIcon: ({ color }) => <GraduationCap size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="attendance"
        options={{
          title: 'Attendance',
          headerTitle: 'Verify attendance Roster',
          tabBarIcon: ({ color }) => <ClipboardCheck size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
