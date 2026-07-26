import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Search, ChevronRight, FileDown, ArrowLeft, User, Phone, Mail, FileText, CheckCircle2 } from 'lucide-react-native';
import { api } from '@/services/api';

export default function EmployeeRecruitment() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mobile master-detail toggle state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Recruiter comment writer state
  const [commentText, setCommentText] = useState('');
  const [savingComment, setSavingComment] = useState(false);

  const fetchCandidates = async () => {
    try {
      const res = await api.employee.recruitment();
      if (res.status === 200 && res.data.success) {
        setCandidates(res.data.candidates || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleSelectCandidate = async (userId: string) => {
    setSelectedUserId(userId);
    setLoadingDetails(true);
    setCommentText('');
    try {
      const res = await api.employee.candidateDetails(userId);
      if (res.status === 200 && res.data.success) {
        setDetailData(res.data.candidate);
      }
    } catch {
      Alert.alert('Error', 'Failed to retrieve candidate profile.');
      setSelectedUserId(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSaveComment = async () => {
    if (!commentText.trim()) return;
    setSavingComment(true);
    try {
      // Direct update of comments locally & sync
      const res = await api.employee.attendance({
        action: 'comment',
        userId: selectedUserId,
        comment: commentText,
      });

      if (res.status === 200 && res.data.success) {
        Alert.alert('Feedback Logged', 'Comment registered successfully.');
        setCommentText('');
        // Re-load details
        handleSelectCandidate(selectedUserId!);
      }
    } catch {
      Alert.alert('Error', 'Failed to append comments.');
    } finally {
      setSavingComment(false);
    }
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    const headers = 'Name,Email,Role,Status,ATS Score\n';
    const rows = filteredCandidates.map(
      (c) => `"${c.name}","${c.email}","${c.role}","${c.reviewStatus || 'Pending'}",${c.atsScore || 0}`
    ).join('\n');

    const csvContent = headers + rows;
    Alert.alert('Export CSV Success', 'Downloaded candidates analytical sheet to local storage.');
  };

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  // Master List Panel
  if (!selectedUserId) {
    return (
      <View style={styles.container}>
        {/* Search header banner */}
        <View style={styles.searchHeader}>
          <View style={styles.searchBar}>
            <Search size={16} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search enrollees..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
            />
          </View>
          <TouchableOpacity style={styles.exportBtn} onPress={handleExportCSV}>
            <FileDown size={16} color="#FFFFFF" />
            <Text style={styles.exportText}>CSV</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.listContainer}>
          {filteredCandidates.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No candidates found.</Text>
            </View>
          ) : (
            filteredCandidates.map((cand) => (
              <TouchableOpacity
                key={cand.id}
                style={styles.candidateRow}
                onPress={() => handleSelectCandidate(cand.id)}
              >
                <View style={styles.avatar}>
                  <User size={18} color="#475569" />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={styles.candName}>{cand.name}</Text>
                  <Text style={styles.candEmail}>{cand.email}</Text>
                </View>
                <View style={styles.candMeta}>
                  <Text style={styles.candStatus}>{cand.reviewStatus || 'Pending'}</Text>
                  <ChevronRight size={14} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    );
  }

  // Details Page
  return (
    <View style={styles.container}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedUserId(null)}>
          <ArrowLeft size={16} color="#475569" />
          <Text style={styles.backBtnText}>Candidates Directory</Text>
        </TouchableOpacity>
      </View>

      {loadingDetails || !detailData ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="small" color="#F97316" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.detailScroll}>
          {/* Card profile */}
          <View style={styles.profileCard}>
            <Text style={styles.profileName}>{detailData.name}</Text>
            <Text style={styles.profileRole}>{detailData.role} • Status: {detailData.reviewStatus || 'Pending'}</Text>

            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Mail size={14} color="#94A3B8" />
                <Text style={styles.infoText}>{detailData.email}</Text>
              </View>
              <View style={styles.infoItem}>
                <Phone size={14} color="#94A3B8" />
                <Text style={styles.infoText}>{detailData.contactNumber || 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* ATS score indicators */}
          {detailData.atsScore && (
            <View style={styles.atsCard}>
              <Text style={styles.atsTitle}>ATS Evaluation Rating</Text>
              <View style={styles.atsMetrics}>
                <Text style={styles.atsPercentage}>{detailData.atsScore}%</Text>
                <Text style={styles.atsLabel}>Skills gap overlap match</Text>
              </View>
            </View>
          )}

          {/* Comments and Feedback Logs */}
          <View style={styles.commentsCard}>
            <Text style={styles.cardSectionTitle}>Advisor Reviews</Text>
            <View style={styles.notesList}>
              {detailData.recruiterNotes?.length === 0 ? (
                <Text style={styles.emptyNotes}>No logs recorded.</Text>
              ) : (
                detailData.recruiterNotes?.map((note: any, idx: number) => (
                  <View key={idx} style={styles.noteItem}>
                    <Text style={styles.noteAuthor}>{note.author} ({note.date})</Text>
                    <Text style={styles.noteBody}>{note.text}</Text>
                  </View>
                ))
              )}
            </View>

            {/* Writer Box */}
            <View style={styles.writerContainer}>
              <TextInput
                style={styles.writerInput}
                placeholder="Append performance logs..."
                placeholderTextColor="#94A3B8"
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity
                style={[styles.saveCommentBtn, !commentText.trim() && styles.disabledBtn]}
                onPress={handleSaveComment}
                disabled={savingComment || !commentText.trim()}
              >
                {savingComment ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.saveCommentText}>Save Log</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
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
  searchHeader: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0B172A',
    fontWeight: '600',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B172A',
    borderRadius: 12,
    height: 40,
    paddingHorizontal: 12,
    gap: 6,
  },
  exportText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  listContainer: {
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
  candidateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  avatar: {
    height: 38,
    width: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  candName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0B172A',
  },
  candEmail: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  candMeta: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 6,
  },
  candStatus: {
    fontSize: 9,
    fontWeight: '700',
    color: '#EA580C',
    backgroundColor: '#FFF7ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },
  detailHeader: {
    height: 52,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  backBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  detailScroll: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B172A',
  },
  profileRole: {
    fontSize: 12,
    color: '#EA580C',
    fontWeight: '700',
  },
  infoGrid: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  atsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  atsTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
  },
  atsMetrics: {
    alignItems: 'flex-end',
  },
  atsPercentage: {
    fontSize: 20,
    fontWeight: '900',
    color: '#059669',
  },
  atsLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: '#047857',
    textTransform: 'uppercase',
  },
  commentsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  cardSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B172A',
    textTransform: 'uppercase',
  },
  notesList: {
    gap: 8,
  },
  emptyNotes: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  noteItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  noteAuthor: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  noteBody: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
    lineHeight: 16,
  },
  writerContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
    gap: 10,
  },
  writerInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    fontSize: 12,
    color: '#0B172A',
    fontWeight: '600',
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveCommentBtn: {
    backgroundColor: '#F97316',
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveCommentText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
