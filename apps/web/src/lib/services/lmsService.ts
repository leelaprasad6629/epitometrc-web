import { LMSCourse, LMSModule, LMSFilterState } from '@/types/lms';

class LMSService {
  public async fetchCourses(filters?: Partial<LMSFilterState>): Promise<LMSCourse[]> {
    try {
      const params = new URLSearchParams();
      if (filters?.searchQuery) params.set('query', filters.searchQuery);
      if (filters?.category) params.set('category', filters.category);
      if (filters?.level) params.set('level', filters.level);
      if (filters?.sortBy) params.set('sortBy', filters.sortBy);

      const res = await fetch(`/api/courses?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.courses) {
          return data.courses;
        }
      }
    } catch (e) {
      console.error('LMSService fetchCourses error:', e);
    }
    return [];
  }

  public async fetchCourseDetails(courseId: string): Promise<LMSCourse | null> {
    try {
      const res = await fetch(`/api/courses/${courseId}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.course) {
          return data.course;
        }
      }
    } catch (e) {
      console.error('LMSService fetchCourseDetails error:', e);
    }
    return null;
  }

  public async enrollCourse(courseId: string): Promise<{ success: boolean; message?: string }> {
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return { success: true };
      }
      return { success: false, message: data.error || 'Enrollment failed' };
    } catch (e: any) {
      return { success: false, message: e?.message || 'Network error' };
    }
  }

  public async fetchCurriculum(courseId: string): Promise<{ modules: LMSModule[]; course: LMSCourse } | null> {
    try {
      const res = await fetch(`/api/courses/${courseId}/learn`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          return { modules: data.modules, course: data.course };
        }
      }
    } catch (e) {
      console.error('LMSService fetchCurriculum error:', e);
    }
    return null;
  }

  public async updateLessonProgress(lessonId: string, isCompleted: boolean, watchTimeSeconds: number = 0): Promise<boolean> {
    try {
      const res = await fetch(`/api/courses/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isCompleted, watchTimeSeconds }),
      });
      return res.ok;
    } catch (e) {
      console.error('LMSService updateLessonProgress error:', e);
      return false;
    }
  }

  public async submitQuiz(quizId: string, answers: Record<string, string>): Promise<{ score: number; passed: boolean } | null> {
    try {
      const res = await fetch(`/api/courses/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          return { score: data.score, passed: data.passed };
        }
      }
    } catch (e) {
      console.error('LMSService submitQuiz error:', e);
    }
    return null;
  }

  public async submitAssignment(assignmentId: string, textResponse: string, fileUrl?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/courses/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textResponse, fileUrl }),
      });
      return res.ok;
    } catch (e) {
      console.error('LMSService submitAssignment error:', e);
      return false;
    }
  }

  public async fetchDiscussions(courseId: string): Promise<any[]> {
    try {
      const res = await fetch(`/api/courses/${courseId}/discussion`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.threads;
      }
    } catch (e) {
      console.error('LMSService fetchDiscussions error:', e);
    }
    return [];
  }

  public async postDiscussion(courseId: string, title: string, content: string, lessonId?: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/courses/${courseId}/discussion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, lessonId }),
      });
      return res.ok;
    } catch (e) {
      console.error('LMSService postDiscussion error:', e);
      return false;
    }
  }

  public async getCertificate(courseId: string): Promise<any | null> {
    try {
      const res = await fetch(`/api/courses/${courseId}/certificate`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success) return data.certificate;
      }
    } catch (e) {
      console.error('LMSService getCertificate error:', e);
    }
    return null;
  }
}

export const lmsService = new LMSService();
