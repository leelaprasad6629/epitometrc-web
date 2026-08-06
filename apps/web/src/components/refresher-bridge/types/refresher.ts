export type MaterialType = 'PDF' | 'Video' | 'Notes';
export type MaterialStatus = 'Not Started' | 'In Progress' | 'Completed';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';
export type SessionMode = 'Online' | 'Offline';
export type StepStatus = 'Locked' | 'In Progress' | 'Completed';

export interface IntroductoryMaterial {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: string;
  difficulty: DifficultyLevel;
  type: MaterialType;
  status: MaterialStatus;
  contentUrl?: string;
  videoUrl?: string;
  notesSnippet?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

export interface Assessment {
  id: string;
  title: string;
  subject: string;
  questionsCount: number;
  estimatedTime: string;
  difficulty: DifficultyLevel;
  passingPercentage: number;
  attemptsRemaining: number;
  maxAttempts: number;
  lastScore?: number;
  status: 'Not Attempted' | 'In Progress' | 'Passed' | 'Failed';
  questions: QuizQuestion[];
}

export interface GuidanceSession {
  id: string;
  mentorName: string;
  mentorTitle: string;
  mentorAvatar: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  mode: SessionMode;
  locationOrLink: string;
  description: string;
  isRegistered: boolean;
  registeredCount: number;
}

export interface LearningPathStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  description: string;
  estimatedDuration: string;
  status: StepStatus;
  isUnlocked: boolean;
  resourceId?: string;
  assessmentId?: string;
}

export interface Recommendation {
  id: string;
  title: string;
  reason: string;
  estimatedTime: string;
  difficulty: DifficultyLevel;
  type: MaterialType | 'Quiz';
  targetId: string;
}

export interface StudentProgress {
  overallProgressPercent: number;
  sessionsCompleted: number;
  sessionsTotal: number;
  assessmentsCompleted: number;
  assessmentsPassed: number;
  assessmentsTotal: number;
  materialsCompleted: number;
  materialsTotal: number;
  currentStage: string;
  streakDays: number;
}

export interface FilterState {
  searchTerm: string;
  selectedSubject: string;
  selectedType: string;
}
