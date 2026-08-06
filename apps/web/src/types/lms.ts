export type LessonType = 'video' | 'notes' | 'quiz' | 'assignment';
export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';

export interface LMSLesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  duration: string;
  orderIndex: number;
  type: LessonType;
  videoUrl?: string;
  notesContent?: string;
  isFreePreview: boolean;
  isCompleted?: boolean;
  watchTimeSeconds?: number;
  lastPositionSeconds?: number;
}

export interface LMSModule {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  orderIndex: number;
  lessons: LMSLesson[];
}

export interface LMSAssignment {
  id: string;
  lessonId: string;
  title: string;
  instructions: string;
  deadline?: string;
  maxMarks: number;
  submission?: {
    id: string;
    fileUrl?: string;
    textResponse?: string;
    marks?: number;
    status: 'Submitted' | 'Graded' | 'Resubmit';
    feedback?: string;
    submittedAt: string;
  };
}

export interface LMSQuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  questionType: 'mcq' | 'tf' | 'short';
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
}

export interface LMSQuiz {
  id: string;
  lessonId: string;
  title: string;
  passingScore: number;
  timeLimitMinutes: number;
  questions: LMSQuizQuestion[];
  lastAttempt?: {
    score: number;
    passed: boolean;
    attemptedAt: string;
  };
}

export interface LMSResource {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  fileType: 'PDF' | 'ZIP' | 'PPT' | 'Code' | string;
  fileUrl: string;
  fileSize?: string;
}

export interface LMSDiscussionReply {
  id: string;
  threadId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  isInstructorReply: boolean;
  createdAt: string;
}

export interface LMSDiscussionThread {
  id: string;
  courseId: string;
  lessonId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  isSolved: boolean;
  createdAt: string;
  replies: LMSDiscussionReply[];
}

export interface LMSCertificate {
  id: string;
  certificateId: string;
  courseId: string;
  courseTitle: string;
  userId: string;
  userName: string;
  instructorName: string;
  issuedAt: string;
  qrVerificationUrl?: string;
}

export interface LMSCourse {
  id: string;
  title: string;
  subtitle?: string;
  slug?: string;
  category: string;
  description: string;
  duration: string;
  modules: number;
  image: string;
  level: DifficultyLevel;
  language: string;
  price: string;
  rating: number;
  reviewsCount: number;
  enrolledCount: number;
  learningObjectives?: string[];
  skillsCovered?: string[];
  learningOutcomes?: string[];
  prerequisites?: string[];
  faqs?: { question: string; answer: string }[];
  instructorName?: string;
  instructorRole?: string;
  instructorAvatar?: string;
  instructorBio?: string;
  instructorLinkedIn?: string;
  enrolled?: boolean;
  progress?: number;
  completedAt?: string;
  courseModules?: LMSModule[];
  courseResources?: LMSResource[];
  reviews?: {
    id: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    date: string;
    comment: string;
  }[];
}

export interface LMSFilterState {
  searchQuery: string;
  category: string;
  level: string;
  duration: string;
  sortBy: 'newest' | 'rating' | 'popular' | 'alphabetical';
}
