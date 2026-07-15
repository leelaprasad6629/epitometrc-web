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
    parsedResult: Partial<ParsedResume>
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
    set((state) => {
      const mergedDetails = {
        ...initialParsedResume,
        ...state.parsedResumeDetails,
        ...parsedResult
      };
      
      // Auto add newly parsed technical skills if they are not already in verifiedSkills
      const parsedTech = parsedResult.technicalSkills || [];
      const currentVerified = mergedDetails.verifiedSkills || [];
      const updatedVerified = Array.from(new Set([...currentVerified, ...parsedTech]));
      mergedDetails.verifiedSkills = updatedVerified;

      return {
        fileName,
        fileBase64,
        fileMimeType,
        parsedResumeDetails: mergedDetails,
        verified: false, // Force re-verification
        uploadTimestamp: new Date().toISOString()
      };
    }),

  updateParsedDetails: (details) =>
    set((state) => ({
      parsedResumeDetails: state.parsedResumeDetails
        ? { ...state.parsedResumeDetails, ...details }
        : { ...initialParsedResume, ...details }
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
