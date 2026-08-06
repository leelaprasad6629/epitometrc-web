import {
  IntroductoryMaterial,
  Assessment,
  GuidanceSession,
  LearningPathStep,
  Recommendation,
  StudentProgress,
} from '../types/refresher';
import {
  INITIAL_MATERIALS,
  INITIAL_ASSESSMENTS,
  INITIAL_GUIDANCE_SESSIONS,
  INITIAL_LEARNING_PATH_STEPS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_PROGRESS,
} from '../constants/sampleData';

const LOCAL_STORAGE_KEY = 'epitome_refresher_bridge_data_v1';

export interface RefresherModuleData {
  progress: StudentProgress;
  materials: IntroductoryMaterial[];
  assessments: Assessment[];
  guidanceSessions: GuidanceSession[];
  learningPath: LearningPathStep[];
  recommendations: Recommendation[];
}

class RefresherService {
  private getStoredData(): RefresherModuleData {
    if (typeof window === 'undefined') {
      return {
        progress: INITIAL_PROGRESS,
        materials: INITIAL_MATERIALS,
        assessments: INITIAL_ASSESSMENTS,
        guidanceSessions: INITIAL_GUIDANCE_SESSIONS,
        learningPath: INITIAL_LEARNING_PATH_STEPS,
        recommendations: INITIAL_RECOMMENDATIONS,
      };
    }

    const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!cached) {
      const initialData: RefresherModuleData = {
        progress: INITIAL_PROGRESS,
        materials: INITIAL_MATERIALS,
        assessments: INITIAL_ASSESSMENTS,
        guidanceSessions: INITIAL_GUIDANCE_SESSIONS,
        learningPath: INITIAL_LEARNING_PATH_STEPS,
        recommendations: INITIAL_RECOMMENDATIONS,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }

    try {
      return JSON.parse(cached);
    } catch {
      return {
        progress: INITIAL_PROGRESS,
        materials: INITIAL_MATERIALS,
        assessments: INITIAL_ASSESSMENTS,
        guidanceSessions: INITIAL_GUIDANCE_SESSIONS,
        learningPath: INITIAL_LEARNING_PATH_STEPS,
        recommendations: INITIAL_RECOMMENDATIONS,
      };
    }
  }

  private saveStoredData(data: RefresherModuleData): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    }
  }

  public async fetchModuleData(): Promise<RefresherModuleData> {
    try {
      const response = await fetch('/api/student/refresher-bridge', { cache: 'no-store' });
      if (response.ok) {
        const payload = await response.json();
        if (payload.success && payload.data) {
          this.saveStoredData(payload.data);
          return payload.data;
        }
      }
    } catch {
      // Fallback to local storage / mock data
    }
    return this.getStoredData();
  }

  public async updateMaterialStatus(materialId: string, status: 'Not Started' | 'In Progress' | 'Completed'): Promise<RefresherModuleData> {
    const currentData = this.getStoredData();
    const updatedMaterials = currentData.materials.map((m) =>
      m.id === materialId ? { ...m, status } : m
    );

    const completedCount = updatedMaterials.filter((m) => m.status === 'Completed').length;
    const materialsTotal = updatedMaterials.length;

    const updatedData: RefresherModuleData = {
      ...currentData,
      materials: updatedMaterials,
      progress: {
        ...currentData.progress,
        materialsCompleted: completedCount,
        materialsTotal,
        overallProgressPercent: Math.min(
          100,
          Math.round(
            ((completedCount + currentData.progress.assessmentsPassed + currentData.progress.sessionsCompleted) /
              (materialsTotal + currentData.progress.assessmentsTotal + currentData.progress.sessionsTotal)) *
              100
          )
        ),
      },
    };

    this.saveStoredData(updatedData);

    try {
      await fetch('/api/student/refresher-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update_material', materialId, status }),
      });
    } catch {
      // Ignore API failure in offline/mock mode
    }

    return updatedData;
  }

  public async submitAssessmentScore(assessmentId: string, scorePercent: number): Promise<RefresherModuleData> {
    const currentData = this.getStoredData();
    const updatedAssessments = currentData.assessments.map((a) => {
      if (a.id !== assessmentId) return a;
      const isPassed = scorePercent >= a.passingPercentage;
      const attemptsRemaining = Math.max(0, a.attemptsRemaining - 1);
      return {
        ...a,
        lastScore: scorePercent,
        attemptsRemaining,
        status: isPassed ? ('Passed' as const) : ('Failed' as const),
      };
    });

    const passedCount = updatedAssessments.filter((a) => a.status === 'Passed').length;
    const completedCount = updatedAssessments.filter((a) => a.status === 'Passed' || a.status === 'Failed').length;

    const updatedData: RefresherModuleData = {
      ...currentData,
      assessments: updatedAssessments,
      progress: {
        ...currentData.progress,
        assessmentsPassed: passedCount,
        assessmentsCompleted: completedCount,
        overallProgressPercent: Math.min(
          100,
          Math.round(
            ((currentData.progress.materialsCompleted + passedCount + currentData.progress.sessionsCompleted) /
              (currentData.progress.materialsTotal + updatedAssessments.length + currentData.progress.sessionsTotal)) *
              100
          )
        ),
      },
    };

    this.saveStoredData(updatedData);

    try {
      await fetch('/api/student/refresher-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'submit_quiz', assessmentId, scorePercent }),
      });
    } catch {
      // Ignore API failure
    }

    return updatedData;
  }

  public async toggleSessionRegistration(sessionId: string): Promise<RefresherModuleData> {
    const currentData = this.getStoredData();
    const updatedSessions = currentData.guidanceSessions.map((s) => {
      if (s.id !== sessionId) return s;
      const isReg = !s.isRegistered;
      return {
        ...s,
        isRegistered: isReg,
        registeredCount: isReg ? s.registeredCount + 1 : Math.max(0, s.registeredCount - 1),
      };
    });

    const registeredCount = updatedSessions.filter((s) => s.isRegistered).length;

    const updatedData: RefresherModuleData = {
      ...currentData,
      guidanceSessions: updatedSessions,
      progress: {
        ...currentData.progress,
        sessionsCompleted: registeredCount,
      },
    };

    this.saveStoredData(updatedData);

    try {
      await fetch('/api/student/refresher-bridge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_session', sessionId }),
      });
    } catch {
      // Ignore API failure
    }

    return updatedData;
  }

  public async completeLearningStep(stepNumber: number): Promise<RefresherModuleData> {
    const currentData = this.getStoredData();
    const updatedPath = currentData.learningPath.map((step) => {
      if (step.stepNumber === stepNumber) {
        return { ...step, status: 'Completed' as const };
      }
      if (step.stepNumber === stepNumber + 1) {
        return { ...step, isUnlocked: true, status: step.status === 'Locked' ? ('In Progress' as const) : step.status };
      }
      return step;
    });

    const currentStepObj = updatedPath.find((s) => s.status === 'In Progress') || updatedPath[updatedPath.length - 1];

    const updatedData: RefresherModuleData = {
      ...currentData,
      learningPath: updatedPath,
      progress: {
        ...currentData.progress,
        currentStage: currentStepObj ? `${currentStepObj.title}` : 'All Steps Completed',
      },
    };

    this.saveStoredData(updatedData);
    return updatedData;
  }

  public async resetModuleProgress(): Promise<RefresherModuleData> {
    const resetData: RefresherModuleData = {
      progress: INITIAL_PROGRESS,
      materials: INITIAL_MATERIALS,
      assessments: INITIAL_ASSESSMENTS,
      guidanceSessions: INITIAL_GUIDANCE_SESSIONS,
      learningPath: INITIAL_LEARNING_PATH_STEPS,
      recommendations: INITIAL_RECOMMENDATIONS,
    };
    this.saveStoredData(resetData);
    return resetData;
  }
}

export const refresherService = new RefresherService();
