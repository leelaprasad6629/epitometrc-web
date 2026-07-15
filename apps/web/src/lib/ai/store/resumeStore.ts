"use client";

import { create } from "zustand";

export interface ParsedResume {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolioWebsite: string;
  education: string;
  experience: string;
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
}

export interface ResumeStore {
  fileName: string | null;
  fileBase64: string | null;
  fileMimeType: string | null;
  selectedJobRole: string;
  parsedResumeDetails: ParsedResume | null;
  verified: boolean;
  uploadTimestamp: string | null;
  
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
    parsedResult: ParsedResume
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
}

const initialParsedResume: ParsedResume = {
  fullName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  github: "",
  portfolioWebsite: "",
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
  internships: ""
};

export const useResumeStore = create<ResumeStore>((set) => ({
  fileName: null,
  fileBase64: null,
  fileMimeType: null,
  selectedJobRole: "Frontend Developer",
  parsedResumeDetails: null,
  verified: false,
  uploadTimestamp: null,

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
      parsedResumeDetails: { ...initialParsedResume, ...parsedResult },
      verified: false, // Must be verified by student manually
      uploadTimestamp: new Date().toISOString()
    }),

  updateParsedDetails: (details) =>
    set((state) => ({
      parsedResumeDetails: state.parsedResumeDetails
        ? { ...state.parsedResumeDetails, ...details }
        : null
    })),

  setSelectedJobRole: (role) => set({ selectedJobRole: role }),
  setVerified: (verified) => set({ verified }),

  updateAnalysis: (analysis) => set({ ...analysis }),

  deleteResume: () =>
    set({
      fileName: null,
      fileBase64: null,
      fileMimeType: null,
      parsedResumeDetails: null,
      verified: false,
      uploadTimestamp: null,
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
    })
}));
