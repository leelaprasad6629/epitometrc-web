"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ParsedResume {
  fullName: string;
  email: string;
  phone: string;
  education: string;
  experience: string;
  projects: string;
  certifications: string;
  technicalSkills: string[];
  softSkills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  toolsTechnologies: string[];
}

export interface ResumeStore {
  fileName: string | null;
  fileBase64: string | null;
  fileMimeType: string | null;
  selectedJobRole: string;
  parsedResumeDetails: ParsedResume | null;
  
  // Scoring parameters
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
    parsedResult: ParsedResume
  ) => void;
  updateParsedDetails: (details: Partial<ParsedResume>) => void;
  setSelectedJobRole: (role: string) => void;
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
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      fileName: null,
      fileBase64: null,
      fileMimeType: null,
      selectedJobRole: "Frontend Developer",
      parsedResumeDetails: null,

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

      setResumeData: (fileName, fileBase64, fileMimeType, parsedResult) =>
        set({
          fileName,
          fileBase64,
          fileMimeType,
          parsedResumeDetails: parsedResult,
        }),

      updateParsedDetails: (details) =>
        set((state) => ({
          parsedResumeDetails: state.parsedResumeDetails
            ? { ...state.parsedResumeDetails, ...details }
            : null,
        })),

      setSelectedJobRole: (role) => set({ selectedJobRole: role }),

      updateAnalysis: (analysis) => set({ ...analysis }),

      deleteResume: () =>
        set({
          fileName: null,
          fileBase64: null,
          fileMimeType: null,
          parsedResumeDetails: null,
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
        }),
    }),
    {
      name: "student-resume-store", // Persist key name in localStorage
    }
  )
);
