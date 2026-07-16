export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface PageContext {
  pathname: string;
  role?: string;
  data?: any;
}

export interface ProviderOptions {
  temperature?: number;
  maxTokens?: number;
  responseFormat?: "text" | "json";
  fileBase64?: string;
  fileMimeType?: string;
}

export interface AIResponse {
  success: boolean;
  text?: string;
  error?: string;
  provider?: "gemini" | "groq" | "local-fallback";
}

export interface BusinessConsultantResult {
  industry: string;
  recommendedServices: string[];
  roadmap: { week: string; title: string; focus: string }[];
  explanation: string;
}

export interface TalentMatchResult {
  candidates: {
    name: string;
    score: number;
    rank: number;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  }[];
}

export interface SuitabilityResult {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  suitability: string;
  interviewFocus: string[];
}

export interface ResumeMatchResult {
  matchPercentage: number;
  atsScore: number;
  missingSkills: string[];
  strengths: string[];
  suggestions: string[];
  roadmap: string[];
}

export interface TrainingPlannerResult {
  groups: { name: string; members: string[] }[];
  roadmap: string[];
  gapAnalysis: string[];
  duration: string;
}
