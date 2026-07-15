"use client";

import { create } from "zustand";

export interface EducationEntry {
  institution: string;
  degree: string;
  year: string;
  location: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
  location: string;
}

export interface ProjectEntry {
  name: string;
  description: string;
  technologies: string[];
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  year: string;
}

export interface InternshipEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface AchievementEntry {
  title: string;
  description: string;
}

export interface ParsedResume {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string | null; // base64 payload
  linkedin: string;
  github: string;
  portfolioWebsite: string;
  personalWebsite: string;
  leetcode: string;
  hackerrank: string;
  codechef: string;
  codeforces: string;
  bio: string; // Summary biography
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  internships: InternshipEntry[];
  achievements: AchievementEntry[];
  technicalSkills: string[];
  softSkills: string[];
  programmingLanguages: string[];
  frontend: string[];
  backend: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];
  devops: string[];
  testing: string[];
  mobile: string[];
  aiml: string[];
  verifiedSkills: string[]; // Autocomplete verified list
}

export interface ResumeStore {
  fileName: string | null;
  fileBase64: string | null;
  fileMimeType: string | null;
  selectedJobRole: string;
  parsedResumeDetails: ParsedResume | null;
  verified: boolean;
  uploadTimestamp: string | null;
  confidenceScores: Record<string, number>;
  
  // Scoring parameters (Calculated programmatically)
  atsScore: number;
  matchScore: number;
  skillMatchPercentage: number;
  completeness: number;

  // Analysis insights
  matchedSkills: string[];
  missingSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  certRecommendations: string[];
  projectRecommendations: string[];

  // Actions
  setResumeData: (
    fileName: string,
    fileBase64: string,
    fileMimeType: string,
    parsedResult: Partial<ParsedResume>,
    confidenceScores: Record<string, number>
  ) => void;
  updateParsedDetails: (details: Partial<ParsedResume>) => void;
  setSelectedJobRole: (role: string) => void;
  setVerified: (verified: boolean) => void;
  updateAnalysis: (analysis: {
    atsScore: number;
    matchScore: number;
    skillMatchPercentage: number;
    completeness: number;
    matchedSkills: string[];
    missingSkills: string[];
    missingKeywords: string[];
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    certRecommendations: string[];
    projectRecommendations: string[];
  }) => void;
  deleteResume: () => void;
  loadProfileFromServer: () => Promise<void>;
}

const initialParsedResume: ParsedResume = {
  fullName: "",
  headline: "",
  email: "",
  phone: "",
  location: "",
  profileImage: null,
  linkedin: "",
  github: "",
  portfolioWebsite: "",
  personalWebsite: "",
  leetcode: "",
  hackerrank: "",
  codechef: "",
  codeforces: "",
  bio: "",
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  internships: [],
  achievements: [],
  technicalSkills: [],
  softSkills: [],
  programmingLanguages: [],
  frontend: [],
  backend: [],
  frameworks: [],
  databases: [],
  cloud: [],
  devops: [],
  testing: [],
  mobile: [],
  aiml: [],
  verifiedSkills: []
};

// Helper cookie read/write utilities
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()?.split(";").shift() || "");
  return null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)}${expires}; path=/; SameSite=Lax`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/; SameSite=Lax`;
}

// Syncs details to secure client-side cookie database
function syncProfileToClientStorage(profile: ParsedResume | null, confidenceScores: Record<string, number>) {
  if (typeof window === "undefined") return;
  if (!profile) {
    deleteCookie("student_profile_text");
    deleteCookie("student_profile_confidence");
    sessionStorage.removeItem("student_profile_image");
    return;
  }

  // Extract base64 image and save to sessionStorage
  if (profile.profileImage) {
    sessionStorage.setItem("student_profile_image", profile.profileImage);
  } else {
    sessionStorage.removeItem("student_profile_image");
  }

  // Save the text fields to persistent 1-year cookies
  const textProfile = { ...profile, profileImage: null };
  setCookie("student_profile_text", JSON.stringify(textProfile));
  setCookie("student_profile_confidence", JSON.stringify(confidenceScores));
}

export const useResumeStore = create<ResumeStore>((set, get) => ({
  fileName: null,
  fileBase64: null,
  fileMimeType: null,
  selectedJobRole: "Frontend Developer",
  parsedResumeDetails: null,
  verified: false,
  uploadTimestamp: null,
  confidenceScores: {},

  atsScore: 0,
  matchScore: 0,
  skillMatchPercentage: 0,
  completeness: 0,

  matchedSkills: [],
  missingSkills: [],
  missingKeywords: [],
  strengths: [],
  improvements: [],
  recommendations: [],
  certRecommendations: [],
  projectRecommendations: [],

  setResumeData: (fileName, fileBase64, fileMimeType, parsedResult, confidenceScores) =>
    set((state) => {
      const mergedDetails = {
        ...initialParsedResume,
        ...state.parsedResumeDetails,
        ...parsedResult
      };
      
      const parsedTech = parsedResult.technicalSkills || [];
      const currentVerified = mergedDetails.verifiedSkills || [];
      const updatedVerified = Array.from(new Set([...currentVerified, ...parsedTech]));
      mergedDetails.verifiedSkills = updatedVerified;

      // Persist to browser storage
      syncProfileToClientStorage(mergedDetails, confidenceScores);

      return {
        fileName,
        fileBase64,
        fileMimeType,
        parsedResumeDetails: mergedDetails,
        verified: false,
        uploadTimestamp: new Date().toISOString(),
        confidenceScores
      };
    }),

  updateParsedDetails: (details) =>
    set((state) => {
      const mergedDetails = state.parsedResumeDetails
        ? { ...state.parsedResumeDetails, ...details }
        : { ...initialParsedResume, ...details };

      // Persist to browser storage
      syncProfileToClientStorage(mergedDetails, get().confidenceScores);

      return { parsedResumeDetails: mergedDetails };
    }),

  setSelectedJobRole: (role) => set({ selectedJobRole: role }),
  setVerified: (verified) => set({ verified }),

  updateAnalysis: (analysis) => set({ ...analysis }),

  deleteResume: () => {
    syncProfileToClientStorage(null, {});
    set({
      fileName: null,
      fileBase64: null,
      fileMimeType: null,
      parsedResumeDetails: null,
      verified: false,
      uploadTimestamp: null,
      confidenceScores: {},
      atsScore: 0,
      matchScore: 0,
      skillMatchPercentage: 0,
      completeness: 0,
      matchedSkills: [],
      missingSkills: [],
      missingKeywords: [],
      strengths: [],
      improvements: [],
      recommendations: [],
      certRecommendations: [],
      projectRecommendations: []
    });
  },

  loadProfileFromServer: async () => {
    if (typeof window === "undefined") return;

    try {
      const textCookie = getCookie("student_profile_text");
      const confidenceCookie = getCookie("student_profile_confidence");
      const imageSession = sessionStorage.getItem("student_profile_image");

      if (textCookie) {
        const textProfile = JSON.parse(textCookie);
        const confidence = confidenceCookie ? JSON.parse(confidenceCookie) : {};
        
        // Restore base64 image
        textProfile.profileImage = imageSession || null;

        set({
          parsedResumeDetails: textProfile,
          confidenceScores: confidence,
          fileName: textProfile.fullName ? `${textProfile.fullName.replace(/\s+/g, "_")}_Profile` : null,
          verified: true
        });
      }
    } catch (err) {
      console.error("Failed to load local persistent cookies profile:", err);
    }
  }
}));
