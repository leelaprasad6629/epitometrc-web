import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import PortalWebView, { DashboardSkeleton } from '@/components/portal-web-view';
import { api } from '@/services/api';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function EmployeeDashboard() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    async function fetchRole() {
      try {
        const { status, data } = await api.auth.me();
        if (status === 200 && data.success && data.user) {
          setRole(data.user.role);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchRole();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F9FF', paddingTop: insets.top }}>
        <DashboardSkeleton />
      </View>
    );
  }

  // Route to the correct Next.js web portal dashboard based on user role
  const path = role === 'Admin' ? '/admin/dashboard' : '/employee/dashboard';
  return <PortalWebView path={path} />;
}
