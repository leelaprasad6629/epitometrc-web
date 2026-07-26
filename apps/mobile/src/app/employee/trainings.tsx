import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Calendar, FileText, Plus, X, GraduationCap, Link2 } from 'lucide-react-native';
import { api } from '@/services/api';

export default function EmployeeTrainings() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal actions
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'schedule' | 'material' | null>(null);
  
  // Form inputs
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [materialType, setMaterialType] = useState('PDF');
  
  const [submitting, setSubmitting] = useState(false);

  const fetchCourses = async () => {
    try {
      const res = await api.employee.trainings();
      if (res.status === 200 && res.data.success) {
        setCourses(res.data.courses || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleOpenModal = (courseId: string, type: 'schedule' | 'material') => {
    setSelectedCourseId(courseId);
    setActionType(type);
    setTitle('');
    setDate('');
    setLocation('');
    setLinkUrl('');
    setMaterialType('PDF');
  };

  const handleCloseModal = () => {
    setSelectedCourseId(null);
    setActionType(null);
  };

  const handleSubmit = async () => {
    if (!selectedCourseId) return;

    if (actionType === 'schedule') {
      if (!title || !date || !location) {
        Alert.alert('Validation Error', 'Please enter date, title, and location.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await api.employee.addSchedule(selectedCourseId, { title, date, location });
        if (res.status === 200 && res.data.success) {
          Alert.alert('Success', 'Scheduled session added.');
          fetchCourses();
          handleCloseModal();
        } else {
          Alert.alert('Error', res.data.error || 'Failed to add schedule.');
        }
      } catch {
        Alert.alert('Network Error', 'Failed to reach training coordinator.');
      } finally {
        setSubmitting(false);
      }
    } else {
      if (!title || !linkUrl) {
        Alert.alert('Validation Error', 'Please enter title and document link.');
        return;
      }
      setSubmitting(true);
      try {
        const res = await api.employee.addMaterial(selectedCourseId, { title, url: linkUrl, type: materialType });
        if (res.status === 200 && res.data.success) {
          Alert.alert('Success', 'Study material uploaded.');
          fetchCourses();
          handleCloseModal();
        } else {
          Alert.alert('Error', res.data.error || 'Failed to add material.');
        }
      } catch {
        Alert.alert('Network Error', 'Failed to reach coordinator.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {courses.map((course) => (
          <View key={course.id} style={styles.courseCard}>
            <View style={styles.courseHeader}>
              <GraduationCap size={20} color="#EA580C" />
              <View style={{ flex: 1 }}>
                <Text style={styles.courseCategory}>{course.category}</Text>
                <Text style={styles.courseTitle}>{course.title}</Text>
              </View>
            </View>

            {/* Schedules list */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Schedules ({course.cohortSchedules?.length || 0})</Text>
              {course.cohortSchedules?.map((sched: any, idx: number) => (
                <View key={idx} style={styles.logRow}>
                  <Calendar size={14} color="#64748B" />
                  <Text style={styles.logText} numberOfLines={1}>
                    {sched.date} - {sched.title} ({sched.location})
                  </Text>
                </View>
              ))}
            </View>

            {/* Materials list */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Materials ({course.cohortMaterials?.length || 0})</Text>
              {course.cohortMaterials?.map((mat: any, idx: number) => (
                <View key={idx} style={styles.logRow}>
                  <FileText size={14} color="#64748B" />
                  <Text style={styles.logText} numberOfLines={1}>
                    [{mat.type}] {mat.title}
                  </Text>
                </View>
              ))}
            </View>

            {/* Action Row */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleOpenModal(course.id, 'schedule')}
              >
                <Plus size={12} color="#EA580C" />
                <Text style={styles.actionBtnText}>Add Session</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => handleOpenModal(course.id, 'material')}
              >
                <Plus size={12} color="#EA580C" />
                <Text style={styles.actionBtnText}>Add Doc</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Editor Modal */}
      <Modal visible={actionType !== null} animationType="slide" transparent>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {actionType === 'schedule' ? 'Schedule New Session' : 'Upload Material'}
              </Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <X size={18} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalForm}>
              {actionType === 'schedule' ? (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Session Title</Text>
                    <TextInput style={styles.textInput} value={title} onChangeText={setTitle} placeholder="e.g. Next.js Architecture" />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Date & Time</Text>
                    <TextInput style={styles.textInput} value={date} onChangeText={setDate} placeholder="e.g. July 29, 2:00 PM" />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Location / Room</Text>
                    <TextInput style={styles.textInput} value={location} onChangeText={setLocation} placeholder="e.g. Lab 4B or Zoom Link" />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Document Title</Text>
                    <TextInput style={styles.textInput} value={title} onChangeText={setTitle} placeholder="e.g. Prisma Schema Quickstart" />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Source Document URL</Text>
                    <TextInput style={styles.textInput} value={linkUrl} onChangeText={setLinkUrl} placeholder="e.g. https://docs.google.com/..." />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Doc Type</Text>
                    <View style={styles.typeSelector}>
                      {['PDF', 'Slides', 'Repository'].map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[styles.typeTab, materialType === type && styles.activeTypeTab]}
                          onPress={() => setMaterialType(type)}
                        >
                          <Text style={[styles.typeTabText, materialType === type && styles.activeTypeTabText]}>{type}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}

              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.disabledBtn]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Save Entry</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F9FF',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F9FF',
  },
  scrollContainer: {
    padding: 16,
    gap: 16,
  },
  courseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 14,
  },
  courseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
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
  section: {
    gap: 6,
  },
  sectionHeader: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    height: 34,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#EA580C',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(11, 23, 42, 0.4)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0B172A',
  },
  modalForm: {
    paddingVertical: 16,
    gap: 16,
  },
  inputContainer: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 12,
    fontSize: 12,
    color: '#0B172A',
    fontWeight: '600',
  },
  typeSelector: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    padding: 3,
    borderRadius: 10,
  },
  typeTab: {
    flex: 1,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  activeTypeTab: {
    backgroundColor: '#FFFFFF',
  },
  typeTabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTypeTabLabel: {
    color: '#0B172A',
  },
  activeTypeTabText: {
    color: '#0B172A',
  },
  submitBtn: {
    backgroundColor: '#F97316',
    borderRadius: 12,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
