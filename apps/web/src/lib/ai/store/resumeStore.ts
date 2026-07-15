"use client";

import { create } from "zustand";

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
  education: string;
  experience: string; // Biography
  projects: string;
  certifications: string;
  technicalSkills: string[];
  softSkills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  libraries: string[];
  databases: string[];
  cloudTechnologies: string[];
  developerTools: string[];
  achievements: string;
  internships: string;
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
  education: "",
  experience: "",
  projects: "",
  certifications: "",
  technicalSkills: [],
  softSkills: [],
  programmingLanguages: [],
  frameworks: [],
  libraries: [],
  databases: [],
  cloudTechnologies: [],
  developerTools: [],
  achievements: "",
  internships: "",
  verifiedSkills: []
};

// Helper to save store state to backend API
async function saveProfileToBackend(profile: ParsedResume | null, confidenceScores: Record<string, number>) {
  try {
    await fetch("/api/student/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, confidenceScores })
    });
  } catch (err) {
    console.error("Failed to sync profile to server:", err);
  }
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

      // Sync updated data to server
      saveProfileToBackend(mergedDetails, confidenceScores);

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

      // Sync updated data to server
      saveProfileToBackend(mergedDetails, get().confidenceScores);

      return { parsedResumeDetails: mergedDetails };
    }),

  setSelectedJobRole: (role) => set({ selectedJobRole: role }),
  setVerified: (verified) => set({ verified }),

  updateAnalysis: (analysis) => set({ ...analysis }),

  deleteResume: () => {
    // Sync clear state to server
    saveProfileToBackend(null, {});
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
    try {
      const res = await fetch("/api/student/profile");
      const data = await res.json();
      if (res.ok && data.success && data.profile) {
        set({
          parsedResumeDetails: data.profile,
          confidenceScores: data.confidenceScores || {},
          fileName: data.profile.fullName ? `${data.profile.fullName.replace(/\s+/g, "_")}_Profile` : null
        });
      }
    } catch (err) {
      console.error("Failed to load server profile:", err);
    }
  }
}));
