import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { Award, Clock, BookOpen, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react-native';
import { api } from '@/services/api';

export default function StudentDashboard() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [reviewStatus, setReviewStatus] = useState('Pending');
  const [recruiterNotes, setRecruiterNotes] = useState<any[]>([]);

  const loadData = async () => {
    try {
      const meRes = await api.auth.me();
      if (meRes.status === 200 && meRes.data.success) {
        setUser(meRes.data.user);
      }

      const dashRes = await api.student.dashboard();
      if (dashRes.status === 200 && dashRes.data.success) {
        setData(dashRes.data);
        setReviewStatus(dashRes.data.reviewStatus || 'Pending');
        setRecruiterNotes(dashRes.data.recruiterNotes || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRequestReview = async () => {
    try {
      const res = await api.student.requestReview();
      if (res.status === 200 && res.data.success) {
        setReviewStatus('Review Requested');
        setRecruiterNotes(res.data.recruiterNotes || []);
      }
    } catch (err) {
      console.error('Error requesting review:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  const activeCourses = data?.stats?.activeCourses || 0;
  const attendanceRate = data?.stats?.attendanceRate || 100;
  const pendingAssignments = data?.stats?.pendingAssignments || 0;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentScroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadData} colors={['#F97316']} />}
    >
      {/* Welcome Banner */}
      <View style={styles.banner}>
        <Text style={styles.badgeText}>AI Space Active</Text>
        <Text style={styles.welcomeTitle}>Welcome back, {user?.name || 'Student'}</Text>
        <View style={styles.reviewBadgeRow}>
          <Text style={[styles.reviewBadge, reviewStatus === 'Review Requested' ? styles.reviewAlert : reviewStatus === 'Approved' ? styles.reviewSuccess : styles.reviewPending]}>
            Portfolio Review: {reviewStatus}
          </Text>
          {reviewStatus === 'Pending' && (
            <TouchableOpacity style={styles.reviewButton} onPress={handleRequestReview}>
              <Text style={styles.reviewButtonText}>Request Review</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Grid Stats */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <BookOpen size={20} color="#3B82F6" />
          <Text style={styles.statValue}>{activeCourses}</Text>
          <Text style={styles.statLabel}>Active Courses</Text>
        </View>
        <View style={styles.statCard}>
          <Clock size={20} color="#EA580C" />
          <Text style={styles.statValue}>{pendingAssignments}</Text>
          <Text style={styles.statLabel}>Assignments Due</Text>
        </View>
        <View style={[styles.statCard, { width: '100%' }]}>
          <Award size={20} color="#10B981" />
          <Text style={styles.statValue}>{attendanceRate}%</Text>
          <Text style={styles.statLabel}>Verified Attendance Roster Presence</Text>
        </View>
      </View>

      {/* Recommendations Feed */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Advisor Recommendations</Text>
        {recruiterNotes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No recommendations registered yet.</Text>
          </View>
        ) : (
          <View style={styles.notesList}>
            {recruiterNotes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <View style={styles.noteHeader}>
                  <Text style={styles.noteAuthor}>{note.author}</Text>
                  <Text style={styles.noteDate}>{note.date}</Text>
                </View>
                <Text style={styles.noteText}>{note.text}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Agenda Deadlines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        <View style={styles.deadlineItem}>
          <View style={[styles.statusDot, { backgroundColor: '#EF4444' }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.deadlineTitle}>Market Research Case Draft</Text>
            <Text style={styles.deadlineDue}>Due Today, 11:59 PM</Text>
          </View>
          <ChevronRight size={14} color="#94A3B8" />
        </View>
        <View style={styles.deadlineItem}>
          <View style={[styles.statusDot, { backgroundColor: '#3B82F6' }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.deadlineTitle}>Final Strategy Slides</Text>
            <Text style={styles.deadlineDue}>Due in 3 days (10 Dec)</Text>
          </View>
          <ChevronRight size={14} color="#94A3B8" />
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
  banner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#F97316',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0B172A',
    marginBottom: 10,
  },
  reviewBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  reviewBadge: {
    fontSize: 9,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
  reviewPending: {
    backgroundColor: '#F8FAFC',
    color: '#64748B',
    borderColor: '#E2E8F0',
  },
  reviewAlert: {
    backgroundColor: '#FFFBEB',
    color: '#D97706',
    borderColor: '#FDE68A',
  },
  reviewSuccess: {
    backgroundColor: '#ECFDF5',
    color: '#059669',
    borderColor: '#A7F3D0',
  },
  reviewButton: {
    borderWidth: 1,
    borderColor: '#FFEDD5',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  reviewButtonText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EA580C',
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
    gap: 6,
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
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B172A',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  notesList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 16,
    gap: 12,
  },
  noteItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
    gap: 4,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  noteAuthor: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  noteDate: {
    fontSize: 9,
    color: '#94A3B8',
    fontWeight: '600',
  },
  noteText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontWeight: '500',
  },
  deadlineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  statusDot: {
    height: 6,
    width: 6,
    borderRadius: 3,
  },
  deadlineTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  deadlineDue: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
