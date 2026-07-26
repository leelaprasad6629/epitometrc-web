import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// For Android emulator, localhost resolves to 10.0.2.2
const DEFAULT_DEV_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
export const API_BASE_URL = __DEV__ ? 'http://192.168.1.7:3000' : 'https://epitometrc-web.vercel.app';

const TOKEN_KEY = 'auth_token';

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string | null): Promise<void> {
  try {
    if (token) {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch {}
}

interface FetchOptions extends RequestInit {
  bodyData?: any;
}

export async function apiFetch(path: string, options: FetchOptions = {}) {
  const token = await getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Inject cookie and authorization headers for robust cross-platform parsing
  if (token) {
    headers['cookie'] = `token=${token}`;
    headers['Cookie'] = `token=${token}`;
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${path}`;
  const fetchConfig: RequestInit = {
    ...options,
    headers,
  };

  if (options.bodyData) {
    fetchConfig.body = JSON.stringify(options.bodyData);
  }

  const res = await fetch(url, fetchConfig);
  const status = res.status;
  
  let data: any = {};
  try {
    data = await res.json();
  } catch {}

  // Automatically parse and store JWT token from response body or set-cookie headers
  const tokenVal = data?.token;
  if (tokenVal) {
    await setStoredToken(tokenVal);
  } else {
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      const match = setCookie.match(/token=([^;]+)/);
      if (match && match[1]) {
        await setStoredToken(match[1]);
      }
    }
  }

  return { status, data };
}

// ==========================================
// API Operations Registry
// ==========================================
export const api = {
  auth: {
    login: (body: any) => apiFetch('/api/auth/login', { method: 'POST', bodyData: body }),
    register: (body: any) => apiFetch('/api/auth/register', { method: 'POST', bodyData: body }),
    logout: () => {
      setStoredToken(null);
      return apiFetch('/api/auth/logout', { method: 'POST' });
    },
    me: () => apiFetch('/api/auth/me', { method: 'GET' }),
  },
  student: {
    dashboard: () => apiFetch('/api/student/dashboard', { method: 'GET' }),
    courses: () => apiFetch('/api/courses', { method: 'GET' }),
    enroll: (courseId: string) => apiFetch('/api/courses', { method: 'POST', bodyData: { courseId } }),
    updateProgress: (courseId: string, progress: number) => apiFetch('/api/courses', { method: 'PATCH', bodyData: { courseId, progress } }),
    certificates: () => apiFetch('/api/student/certificates', { method: 'GET' }),
    requestReview: () => apiFetch('/api/student/dashboard', { method: 'POST' }),
  },
  employee: {
    dashboard: () => apiFetch('/api/employee/dashboard', { method: 'GET' }),
    recruitment: () => apiFetch('/api/employee/recruitment', { method: 'GET' }),
    students: () => apiFetch('/api/employee/students', { method: 'GET' }),
    candidateDetails: (userId: string) => apiFetch(`/api/employee/candidates/${userId}`, { method: 'GET' }),
    trainings: () => apiFetch('/api/employee/trainings', { method: 'GET' }),
    addSchedule: (courseId: string, body: any) => apiFetch(`/api/employee/trainings/${courseId}/schedule`, { method: 'POST', bodyData: body }),
    addMaterial: (courseId: string, body: any) => apiFetch(`/api/employee/trainings/${courseId}/material`, { method: 'POST', bodyData: body }),
    attendance: (body: any) => apiFetch('/api/employee/attendance', { method: 'POST', bodyData: body }),
    getAttendance: (date: string) => apiFetch(`/api/employee/attendance?date=${date}`, { method: 'GET' }),
    updateAttendance: (body: any) => apiFetch('/api/employee/attendance', { method: 'PATCH', bodyData: body }),
  },
  ai: {
    qualifyLead: (body: any) => apiFetch('/api/ai/lead-qualify', { method: 'POST', bodyData: body }),
    generateProposal: (body: any) => apiFetch('/api/ai/proposal-generator', { method: 'POST', bodyData: body }),
    crmAssistant: (body: any) => apiFetch('/api/ai/crm-assistant', { method: 'POST', bodyData: body }),
  },
  public: {
    submitEnquiry: (body: any) => apiFetch('/api/enquiries', { method: 'POST', bodyData: body }),
  }
};
