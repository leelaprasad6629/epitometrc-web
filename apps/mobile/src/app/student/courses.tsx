import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { BookOpen, Check, Play, Award } from 'lucide-react-native';
import { api } from '@/services/api';

export default function StudentCourses() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.student.courses();
      if (res.status === 200 && res.data.success) {
        setCourses(res.data.courses || []);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    try {
      const res = await api.student.enroll(courseId);
      if (res.status === 200 && res.data.success) {
        Alert.alert('Enrolled Successfully', 'You are now joined in this cohort track.');
        fetchCourses();
      } else {
        Alert.alert('Enrollment Failed', res.data.error || 'Please try again.');
      }
    } catch {
      Alert.alert('Network Error', 'Failed to reach training coordinator.');
    }
  };

  const handleUpdateProgress = async (courseId: string, currentProgress: number) => {
    const nextProgress = Math.min(100, currentProgress + 10);
    try {
      const res = await api.student.updateProgress(courseId, nextProgress);
      if (res.status === 200 && res.data.success) {
        fetchCourses();
      }
    } catch {
      Alert.alert('Network Error', 'Failed to save progress.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  const enrolled = courses.filter((c) => c.enrolled);
  const catalog = courses.filter((c) => !c.enrolled);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentScroll}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchCourses} colors={['#F97316']} />}
    >
      {/* Enrolled Courses */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My active cohorts ({enrolled.length})</Text>
        {enrolled.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>You are not enrolled in any training tracks yet.</Text>
          </View>
        ) : (
          enrolled.map((course) => (
            <View key={course.id} style={styles.courseCard}>
              <View style={styles.courseHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.courseCategory}>{course.category}</Text>
                  <Text style={styles.courseTitle}>{course.title}</Text>
                </View>
                {course.progress === 100 ? (
                  <View style={styles.completedBadge}>
                    <Check size={10} color="#059669" />
                    <Text style={styles.completedText}>Completed</Text>
                  </View>
                ) : (
                  <Text style={styles.progressText}>{course.progress}%</Text>
                )}
              </View>

              {/* Progress Slider */}
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, { width: `${course.progress}%` }]} />
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.durationText}>{course.duration} • {course.attendanceLogsCount} logs</Text>
                {course.progress < 100 && (
                  <TouchableOpacity
                    style={styles.progressBtn}
                    onPress={() => handleUpdateProgress(course.id, course.progress)}
                  >
                    <Play size={10} color="#EA580C" style={{ marginRight: 4 }} />
                    <Text style={styles.progressBtnText}>Study Step (+10%)</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Available Catalog */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Available Programs ({catalog.length})</Text>
        {catalog.map((course) => (
          <View key={course.id} style={[styles.courseCard, styles.catalogCard]}>
            <Text style={styles.courseCategory}>{course.category}</Text>
            <Text style={styles.courseTitle}>{course.title}</Text>
            <Text style={styles.courseDesc} numberOfLines={2}>{course.description}</Text>
            <View style={styles.catalogFooter}>
              <Text style={styles.durationText}>{course.duration} • {course.modules} Modules</Text>
              <TouchableOpacity style={styles.enrollBtn} onPress={() => handleEnroll(course.id)}>
                <Text style={styles.enrollBtnText}>Enroll</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
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
    gap: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
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
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    padding: 18,
    gap: 12,
  },
  catalogCard: {
    gap: 8,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  courseCategory: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#EA580C',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  courseTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0B172A',
  },
  courseDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    fontWeight: '500',
  },
  progressText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#EA580C',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  completedText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#059669',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#EA580C',
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  catalogFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  durationText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  progressBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  progressBtnText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#EA580C',
  },
  enrollBtn: {
    backgroundColor: '#0B172A',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 10,
  },
  enrollBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
