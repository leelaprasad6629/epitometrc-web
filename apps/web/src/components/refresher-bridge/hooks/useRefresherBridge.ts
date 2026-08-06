import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  IntroductoryMaterial,
  Assessment,
  GuidanceSession,
  Recommendation,
  FilterState,
} from '../types/refresher';
import { refresherService, RefresherModuleData } from '../services/refresherService';

export function useRefresherBridge() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<RefresherModuleData | null>(null);

  // Active section tab
  const [activeTab, setActiveTab] = useState<'all' | 'materials' | 'assessments' | 'guidance' | 'path' | 'recommendations'>('all');

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedSubject: 'All',
    selectedType: 'All',
  });

  // Modal active targets
  const [selectedMaterial, setSelectedMaterial] = useState<IntroductoryMaterial | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null);
  const [selectedGuidance, setSelectedGuidance] = useState<GuidanceSession | null>(null);

  // User notification message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  useEffect(() => {
    let isMounted = true;
    refresherService.fetchModuleData().then((moduleData) => {
      if (isMounted) {
        setData(moduleData);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Filtered Materials list
  const filteredMaterials = useMemo(() => {
    if (!data) return [];
    return data.materials.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesSubject = filters.selectedSubject === 'All' || item.subject === filters.selectedSubject;
      const matchesType = filters.selectedType === 'All' || item.type === filters.selectedType;

      return matchesSearch && matchesSubject && matchesType;
    });
  }, [data, filters]);

  // Filtered Assessments
  const filteredAssessments = useMemo(() => {
    if (!data) return [];
    return data.assessments.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesSubject = filters.selectedSubject === 'All' || item.subject === filters.selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [data, filters]);

  // Filtered Guidance Sessions
  const filteredGuidanceSessions = useMemo(() => {
    if (!data) return [];
    return data.guidanceSessions.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.mentorName.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        item.subject.toLowerCase().includes(filters.searchTerm.toLowerCase());

      const matchesSubject = filters.selectedSubject === 'All' || item.subject === filters.selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [data, filters]);

  // Unique Subjects for Dropdown
  const subjectsList = useMemo(() => {
    if (!data) return ['All'];
    const subjects = new Set<string>();
    data.materials.forEach((m) => subjects.add(m.subject));
    data.assessments.forEach((a) => subjects.add(a.subject));
    return ['All', ...Array.from(subjects)];
  }, [data]);

  // Action handlers
  const handleUpdateMaterialStatus = async (materialId: string, status: 'Not Started' | 'In Progress' | 'Completed') => {
    const updated = await refresherService.updateMaterialStatus(materialId, status);
    setData(updated);
    if (selectedMaterial && selectedMaterial.id === materialId) {
      setSelectedMaterial((prev) => (prev ? { ...prev, status } : null));
    }
    showToast(`Material status updated to "${status}"`);
  };

  const handleSubmitQuizScore = async (assessmentId: string, scorePercent: number) => {
    const updated = await refresherService.submitAssessmentScore(assessmentId, scorePercent);
    setData(updated);
    if (selectedAssessment && selectedAssessment.id === assessmentId) {
      const updatedAssessment = updated.assessments.find((a) => a.id === assessmentId) || null;
      setSelectedAssessment(updatedAssessment);
    }
    showToast(`Quiz completed with score ${scorePercent}%`);
  };

  const handleToggleSessionRegistration = async (session: GuidanceSession) => {
    const updated = await refresherService.toggleSessionRegistration(session.id);
    setData(updated);
    const isReg = !session.isRegistered;
    if (selectedGuidance && selectedGuidance.id === session.id) {
      setSelectedGuidance((prev) => (prev ? { ...prev, isRegistered: isReg } : null));
    }
    showToast(isReg ? `Registered for session with ${session.mentorName}` : `Unregistered from session`);
  };

  const handleCompleteLearningStep = async (stepNumber: number) => {
    const updated = await refresherService.completeLearningStep(stepNumber);
    setData(updated);
    showToast(`Completed Step ${stepNumber}! Next step unlocked.`);
  };

  const handleStartRecommendation = (rec: Recommendation) => {
    if (!data) return;

    if (rec.type === 'Quiz') {
      const targetQuiz = data.assessments.find((a) => a.id === rec.targetId || a.title.includes(rec.title));
      if (targetQuiz) {
        setSelectedAssessment(targetQuiz);
        return;
      }
    }

    const targetMat = data.materials.find((m) => m.id === rec.targetId || m.title.includes(rec.title));
    if (targetMat) {
      setSelectedMaterial(targetMat);
      return;
    }

    const targetGuidance = data.guidanceSessions.find((g) => g.id === rec.targetId || g.title.includes(rec.title));
    if (targetGuidance) {
      setSelectedGuidance(targetGuidance);
      return;
    }

    showToast(`Navigating to ${rec.title}...`);
  };

  return {
    loading,
    data,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    subjectsList,
    filteredMaterials,
    filteredAssessments,
    filteredGuidanceSessions,
    selectedMaterial,
    setSelectedMaterial,
    selectedAssessment,
    setSelectedAssessment,
    selectedGuidance,
    setSelectedGuidance,
    toastMessage,
    handleUpdateMaterialStatus,
    handleSubmitQuizScore,
    handleToggleSessionRegistration,
    handleCompleteLearningStep,
    handleStartRecommendation,
  };
}
