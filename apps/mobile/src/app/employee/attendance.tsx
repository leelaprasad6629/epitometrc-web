import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { Calendar, CheckCircle2, AlertTriangle, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { api } from '@/services/api';

export default function EmployeeAttendance() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  
  // Calendar tracking
  const [currentDate, setCurrentDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fetchAttendance = async (dateStr: string) => {
    try {
      const res = await api.employee.getAttendance(dateStr);
      if (res.status === 200 && res.data.success) {
        setRecords(res.data.records || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAttendance(currentDate);
  }, [currentDate]);

  const handleToggleStatus = async (enrollmentId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    setLoading(true);
    try {
      const res = await api.employee.updateAttendance({
        enrollmentId,
        status: nextStatus,
        date: currentDate,
      });

      if (res.status === 200 && res.data.success) {
        fetchAttendance(currentDate);
      } else {
        Alert.alert('Tamper Guard Block', res.data.error || 'Failed to update record.');
        setLoading(false);
      }
    } catch {
      Alert.alert('Network Error', 'Failed to reach validation service.');
      setLoading(false);
    }
  };

  const handleDateOffset = (offset: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + offset);
    setCurrentDate(d.toISOString().split('T')[0]);
    setLoading(true);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAttendance(currentDate);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Date Switcher Ribbon */}
      <View style={styles.dateSelector}>
        <TouchableOpacity style={styles.dateBtn} onPress={() => handleDateOffset(-1)}>
          <ChevronLeft size={16} color="#475569" />
        </TouchableOpacity>
        <View style={styles.dateLabelContainer}>
          <Calendar size={14} color="#EA580C" />
          <Text style={styles.dateLabel}>{currentDate}</Text>
        </View>
        <TouchableOpacity style={styles.dateBtn} onPress={() => handleDateOffset(1)}>
          <ChevronRight size={16} color="#475569" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F97316']} />}
      >
        {records.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>No enrollments registered to roster on this date.</Text>
          </View>
        ) : (
          records.map((rec) => (
            <View key={rec.id} style={styles.recordCard}>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={styles.studentName}>{rec.name}</Text>
                <Text style={styles.studentCourse}>{rec.course}</Text>
                
                {/* Security verification warnings */}
                <View style={styles.securityRow}>
                  {rec.tampered ? (
                    <View style={styles.tamperedBadge}>
                      <AlertTriangle size={10} color="#DC2626" />
                      <Text style={styles.tamperedText}>TAMPER ALERT: Key Mismatch</Text>
                    </View>
                  ) : rec.verified ? (
                    <View style={styles.verifiedBadge}>
                      <ShieldCheck size={10} color="#059669" />
                      <Text style={styles.verifiedText}>HMAC Signed & Secure</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* Toggle controls */}
              <TouchableOpacity
                style={[styles.statusToggle, rec.status === 'Present' ? styles.presentBtn : styles.absentBtn]}
                onPress={() => handleToggleStatus(rec.enrollmentId, rec.status)}
              >
                <Text style={[styles.statusToggleText, rec.status === 'Present' ? styles.presentText : styles.absentText]}>
                  {rec.status}
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
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
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  dateBtn: {
    padding: 8,
  },
  dateLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateLabel: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#0B172A',
  },
  scrollContainer: {
    padding: 16,
    gap: 12,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  recordCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  studentName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B172A',
  },
  studentCourse: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
  },
  securityRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  verifiedBadge: {
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
  verifiedText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#059669',
  },
  tamperedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  tamperedText: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#DC2626',
  },
  statusToggle: {
    height: 38,
    width: 80,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  presentBtn: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  absentBtn: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FEE2E2',
  },
  statusToggleText: {
    fontSize: 11,
    fontWeight: '800',
  },
  presentText: {
    color: '#059669',
  },
  absentText: {
    color: '#DC2626',
  },
});
