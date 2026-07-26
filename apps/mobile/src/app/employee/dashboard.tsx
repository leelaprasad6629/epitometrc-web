import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Users, BookOpen, GraduationCap, Award, TrendingUp } from 'lucide-react-native';
import { api } from '@/services/api';

export default function EmployeeDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchDashboard = async () => {
    try {
      const res = await api.employee.dashboard();
      if (res.status === 200 && res.data.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching employee dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  const totalCandidates = data?.stats?.totalCandidates || 0;
  const activeStudents = data?.stats?.activeStudents || 0;
  const placementRate = data?.stats?.placementRate || 0;
  const attendanceAvg = data?.stats?.attendanceAvg || 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentScroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchDashboard} colors={['#F97316']} />}
    >
      {/* Welcome Message */}
      <View style={styles.header}>
        <Text style={styles.badgeText}>Advisors Console</Text>
        <Text style={styles.title}>Welcome back, Instructor</Text>
        <Text style={styles.subtitle}>Here is your learning operations dashboard summary.</Text>
      </View>

      {/* Grid Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Users size={20} color="#3B82F6" />
          <Text style={styles.statValue}>{totalCandidates}</Text>
          <Text style={styles.statLabel}>Total Applicants</Text>
        </View>
        <View style={styles.statCard}>
          <GraduationCap size={20} color="#EA580C" />
          <Text style={styles.statValue}>{activeStudents}</Text>
          <Text style={styles.statLabel}>Enrolled Students</Text>
        </View>
        <View style={styles.statCard}>
          <TrendingUp size={20} color="#10B981" />
          <Text style={styles.statValue}>{placementRate}%</Text>
          <Text style={styles.statLabel}>Placement Rate</Text>
        </View>
        <View style={styles.statCard}>
          <Award size={20} color="#8B5CF6" />
          <Text style={styles.statValue}>{attendanceAvg}%</Text>
          <Text style={styles.statLabel}>Avg Attendance</Text>
        </View>
      </View>

      {/* Program Distribution Charts */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cohort Enrollee Distributions</Text>
        
        <View style={styles.chartItem}>
          <View style={styles.chartLabels}>
            <Text style={styles.chartName}>Software Engineering</Text>
            <Text style={styles.chartValue}>48%</Text>
          </View>
          <View style={styles.chartTrack}>
            <View style={[styles.chartBar, { width: '48%', backgroundColor: '#3B82F6' }]} />
          </View>
        </View>

        <View style={styles.chartItem}>
          <View style={styles.chartLabels}>
            <Text style={styles.chartName}>Corporate Sales Cohort</Text>
            <Text style={styles.chartValue}>32%</Text>
          </View>
          <View style={styles.chartTrack}>
            <View style={[styles.chartBar, { width: '32%', backgroundColor: '#EA580C' }]} />
          </View>
        </View>

        <View style={styles.chartItem}>
          <View style={styles.chartLabels}>
            <Text style={styles.chartName}>IT Services Management</Text>
            <Text style={styles.chartValue}>20%</Text>
          </View>
          <View style={styles.chartTrack}>
            <View style={[styles.chartBar, { width: '20%', backgroundColor: '#10B981' }]} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  contentScroll: {
    padding: 20,
    gap: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
  },
  header: {
    gap: 4,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#F97316',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: '48%',
    gap: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B172A',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B172A',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chartItem: {
    gap: 6,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  chartValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0B172A',
  },
  chartTrack: {
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    borderRadius: 4,
  },
});
