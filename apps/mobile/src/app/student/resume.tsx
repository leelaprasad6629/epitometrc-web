import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Sparkles, FileText, Camera, Video, Mic, RefreshCw, Star } from 'lucide-react-native';
import * as DocumentPicker from 'expo-document-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function StudentResumeAI() {
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [parsing, setParsing] = useState(false);
  const [activeTab, setActiveTab] = useState<'ats' | 'interview'>('ats');

  // Interview state
  const [permission, requestPermission] = useCameraPermissions();
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const questions = [
    "Tell me about a time you resolved a major production deployment block.",
    "How do you approach database schema normalization in PostgreSQL?",
    "Why are you interested in joining EpitomeTRC training cohorts?"
  ];

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setResumeName(file.name);
        setParsing(true);

        // Simulate LLM parsing & ATS score calculations (Llama-3.3 simulation)
        setTimeout(() => {
          setAtsScore(Math.floor(Math.random() * 25) + 65); // Generates 65-90% score
          setParsing(false);
          Alert.alert('Analysis Complete', 'Your resume has been parsed. ATS score generated.');
        }, 2000);
      }
    } catch {
      Alert.alert('Selection Error', 'Failed to pick resume file.');
    }
  };

  const handleStartInterview = async () => {
    if (!permission || !permission.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert('Permission Denied', 'Camera access is required for AI mock interviews.');
        return;
      }
    }
    setInterviewStarted(true);
    setCurrentQuestion(0);
    setFeedback(null);
  };

  const handleRecordAnswer = () => {
    if (recording) {
      // Stop recording and simulate AI feedback evaluation (Gemini parser)
      setRecording(false);
      setLoadingFeedback(true);
      setTimeout(() => {
        setLoadingFeedback(false);
        setFeedback("AI EVALUATION:\n- Confidence: Excellent (88%)\n- Communication: Clear articulation of technical issues.\n- Tip: Discuss specific AWS services you used to scale database caches.");
      }, 2000);
    } else {
      setRecording(true);
    }
  };

  const [loadingFeedback, setLoadingFeedback] = useState(false);

  return (
    <View style={styles.container}>
      {/* Switcher Tab */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ats' && styles.activeTab]}
          onPress={() => setActiveTab('ats')}
        >
          <FileText size={16} color={activeTab === 'ats' ? '#EA580C' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'ats' && styles.activeTabText]}>ATS Scanner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'interview' && styles.activeTab]}
          onPress={() => setActiveTab('interview')}
        >
          <Camera size={16} color={activeTab === 'interview' ? '#EA580C' : '#64748B'} />
          <Text style={[styles.tabText, activeTab === 'interview' && styles.activeTabText]}>AI Mock Screen</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {activeTab === 'ats' ? (
          <View style={styles.panel}>
            <View style={styles.card}>
              <View style={styles.badge}>
                <Sparkles size={11} color="#EA580C" />
                <Text style={styles.badgeText}>Llama-3.3 Optimizer</Text>
              </View>
              <Text style={styles.cardTitle}>ATS Resume Analyzer</Text>
              <Text style={styles.cardDesc}>
                Upload your resume PDF to calculate matching scores, find missing skills gaps, and optimize bullet points.
              </Text>

              {resumeName && (
                <View style={styles.fileRow}>
                  <FileText size={18} color="#EA580C" />
                  <Text style={styles.fileName} numberOfLines={1}>{resumeName}</Text>
                </View>
              )}

              {parsing ? (
                <View style={styles.parsingRow}>
                  <ActivityIndicator size="small" color="#F97316" />
                  <Text style={styles.parsingText}>Evaluating skills against job vacancies...</Text>
                </View>
              ) : atsScore !== null ? (
                <View style={styles.scoreRow}>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreNum}>{atsScore}%</Text>
                    <Text style={styles.scoreLabel}>ATS Fit Rate</Text>
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={styles.scoreAlertTitle}>Analysis Summary</Text>
                    <Text style={styles.scoreAlertDesc}>
                      Good alignment! Add "Docker" and "AWS RDS" credentials to hit 90%+ match rates.
                    </Text>
                  </View>
                </View>
              ) : null}

              <TouchableOpacity style={styles.actionBtn} onPress={handlePickDocument} disabled={parsing}>
                <Text style={styles.actionBtnText}>{resumeName ? 'Upload New Resume' : 'Select PDF Resume'}</Text>
              </TouchableOpacity>
            </View>

            {atsScore !== null && (
              <View style={styles.card}>
                <Text style={styles.sectionHeading}>Missing Skills gaps</Text>
                <View style={styles.skillsList}>
                  <Text style={styles.skillTag}>Docker</Text>
                  <Text style={styles.skillTag}>AWS RDS</Text>
                  <Text style={styles.skillTag}>Redis Caching</Text>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.panel}>
            {!interviewStarted ? (
              <View style={styles.card}>
                <View style={styles.badge}>
                  <Sparkles size={11} color="#EA580C" />
                  <Text style={styles.badgeText}>Gemini Voice Suite</Text>
                </View>
                <Text style={styles.cardTitle}>Camera-Enabled Mock prep</Text>
                <Text style={styles.cardDesc}>
                  Practice mock interviews using your device camera and microphone. AI will transcribe your answers and render specific suggestions.
                </Text>
                <TouchableOpacity style={styles.actionBtn} onPress={handleStartInterview}>
                  <Text style={styles.actionBtnText}>Launch Virtual Screen</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.videoPanel}>
                {/* Camera View Overlay */}
                <View style={styles.cameraFrame}>
                  {permission?.granted ? (
                    <CameraView style={StyleSheet.absoluteFill} facing="front" />
                  ) : (
                    <View style={styles.cameraPlaceholder}>
                      <Video size={36} color="#94A3B8" />
                    </View>
                  )}
                  <View style={styles.cameraBadge}>
                    <Text style={styles.cameraBadgeText}>CAMERA REC ACTIVE</Text>
                  </View>
                </View>

                {/* Question Dialog */}
                <View style={styles.questionCard}>
                  <Text style={styles.questionIndex}>Question {currentQuestion + 1} of 3</Text>
                  <Text style={styles.questionText}>{questions[currentQuestion]}</Text>
                </View>

                {/* Action buttons */}
                <View style={styles.controlRow}>
                  <TouchableOpacity
                    style={[styles.recordBtn, recording && styles.recordingBtn]}
                    onPress={handleRecordAnswer}
                    disabled={loadingFeedback}
                  >
                    {loadingFeedback ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <>
                        <Mic size={16} color="#FFFFFF" />
                        <Text style={styles.recordBtnText}>
                          {recording ? 'Stop Recording' : 'Speak Answer'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {feedback && (
                  <View style={styles.feedbackCard}>
                    <Text style={styles.feedbackText}>{feedback}</Text>
                    {currentQuestion < questions.length - 1 ? (
                      <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={() => {
                          setCurrentQuestion(currentQuestion + 1);
                          setFeedback(null);
                        }}
                      >
                        <Text style={styles.nextBtnText}>Next Question</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={styles.nextBtn}
                        onPress={() => setInterviewStarted(false)}
                      >
                        <Text style={styles.nextBtnText}>Finish Interview</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            )}
          </View>
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    padding: 6,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderRadius: 10,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#FFF7ED',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  activeTabText: {
    color: '#EA580C',
  },
  scrollContainer: {
    padding: 20,
  },
  panel: {
    gap: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EA580C',
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B172A',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    fontWeight: '500',
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  fileName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
  },
  parsingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  parsingText: {
    fontSize: 11,
    color: '#F97316',
    fontWeight: '600',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    padding: 14,
    gap: 12,
  },
  scoreContainer: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 7.5,
    fontWeight: '700',
    color: '#E2FDF2',
    textTransform: 'uppercase',
  },
  scoreAlertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#047857',
  },
  scoreAlertDesc: {
    fontSize: 10,
    color: '#065F46',
    lineHeight: 14,
    fontWeight: '500',
  },
  actionBtn: {
    backgroundColor: '#F97316',
    borderRadius: 14,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0B172A',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillTag: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FFEDD5',
    color: '#EA580C',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  videoPanel: {
    gap: 16,
  },
  cameraFrame: {
    height: 180,
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  cameraBadgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  questionIndex: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#EA580C',
    textTransform: 'uppercase',
  },
  questionText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0B172A',
    lineHeight: 18,
  },
  controlRow: {
    alignItems: 'center',
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EA580C',
    borderRadius: 14,
    height: 48,
    width: '100%',
    gap: 8,
  },
  recordingBtn: {
    backgroundColor: '#EF4444',
  },
  recordBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  feedbackCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  feedbackText: {
    fontSize: 11.5,
    color: '#475569',
    lineHeight: 18,
    fontWeight: '500',
  },
  nextBtn: {
    backgroundColor: '#0B172A',
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
