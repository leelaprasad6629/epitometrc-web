"use client";

import { create } from "zustand";

export interface EducationEntry {
  degree: string;
  branch: string;
  institution: string;
  university: string;
  startYear: string;
  endYear: string;
  cgpa: string;
  relevantCoursework?: string;
}

export interface ExperienceEntry {
  companyName: string;
  role: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  duration: string;
  responsibilities: string;
  technologiesUsed?: string[];
  achievements?: string[];
}

export interface ProjectEntry {
  projectTitle: string;
  description: string;
  technologiesUsed: string[];
  githubLink: string;
  liveUrl: string;
  duration: string;
  teamSize?: string;
  contributions?: string;
  outcomes?: string;
}

export interface CertificationEntry {
  certificationName: string;
  organization: string;
  date: string;
  credentialId: string;
}

export interface InternshipEntry {
  company: string;
  role: string;
  duration: string;
  description: string;
  technologies?: string[];
}

export interface AchievementEntry {
  title: string;
  description: string;
}

export interface PublicationEntry {
  title: string;
  publisher: string;
  date: string;
  url: string;
}

export interface WorkshopEntry {
  name: string;
  organizer: string;
  date: string;
}

export interface HackathonEntry {
  name: string;
  role: string;
  date: string;
  prize: string;
}

export interface LeadershipEntry {
  role: string;
  organization: string;
  duration: string;
}

export interface VolunteerEntry {
  role: string;
  organization: string;
  description: string;
}

export interface ParsedResume {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  profileImage: string | null;
  linkedin: string;
  github: string;
  portfolioWebsite: string;
  personalWebsite: string;
  leetcode: string;
  hackerrank: string;
  codechef: string;
  codeforces: string;
  kaggle: string;
  medium: string;
  stackoverflow: string;
  behance: string;
  dribbble: string;
  bio: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  projects: ProjectEntry[];
  certifications: CertificationEntry[];
  internships: InternshipEntry[];
  achievements: AchievementEntry[];
  
  // Extra structured arrays
  publications: PublicationEntry[];
  workshops: WorkshopEntry[];
  hackathons: HackathonEntry[];
  leadershipRoles: LeadershipEntry[];
  volunteerExperience: VolunteerEntry[];
  languagesKnown: string[];
  professionalInterests: string[];

  technicalSkills: string[];
  softSkills: string[];
  
  // Categorized Technical Skills (17 Groups)
  programmingLanguages: string[];
  frameworks: string[];
  frontend: string[];
  backend: string[];
  databases: string[];
  cloud: string[];
  devops: string[];
  testing: string[];
  aiml: string[];
  mobile: string[];
  tools: string[];
  operatingSystems: string[];
  networking: string[];
  cyberSecurity: string[];
  libraries: string[];
  dataScience: string[];
  versionControl: string[];
  
  verifiedSkills: string[];
  
  // Semantic career insights
  candidateProfile: string;
  careerDomain: string;
  experienceLevel: string;
  suggestedRoles: string[];
  suggestedTech: string[];
  
  // Completeness metrics
  overallCompleteness: number;
  completenessMetrics: Record<string, number>;
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

  // Scoring parameters
  atsScore: number;
  matchScore: number;
  skillMatchPercentage: number;
  keywordMatchPercentage: number;
  experienceMatchPercentage: number;
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
  updateAnalysis: (analysis: Partial<{
    atsScore: number;
    matchScore: number;
    skillMatchPercentage: number;
    keywordMatchPercentage: number;
    experienceMatchPercentage: number;
    completeness: number;
    matchedSkills: string[];
    missingSkills: string[];
    missingKeywords: string[];
    strengths: string[];
    improvements: string[];
    recommendations: string[];
    certRecommendations: string[];
    projectRecommendations: string[];
  }>) => void;
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
  kaggle: "",
  medium: "",
  stackoverflow: "",
  behance: "",
  dribbble: "",
  bio: "",
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  internships: [],
  achievements: [],
  
  publications: [],
  workshops: [],
  hackathons: [],
  leadershipRoles: [],
  volunteerExperience: [],
  languagesKnown: [],
  professionalInterests: [],

  technicalSkills: [],
  softSkills: [],
  
  programmingLanguages: [],
  frameworks: [],
  frontend: [],
  backend: [],
  databases: [],
  cloud: [],
  devops: [],
  testing: [],
  aiml: [],
  mobile: [],
  tools: [],
  operatingSystems: [],
  networking: [],
  cyberSecurity: [],
  libraries: [],
  dataScience: [],
  versionControl: [],
  
  verifiedSkills: [],
  
  candidateProfile: "",
  careerDomain: "",
  experienceLevel: "Fresher",
  suggestedRoles: [],
  suggestedTech: [],
  
  overallCompleteness: 0,
  completenessMetrics: {}
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

async function persistProfileToServer(profile: ParsedResume | null, confidenceScores: Record<string, number>) {
  if (typeof window === "undefined") return;
  try {
    await fetch("/api/student/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, confidenceScores })
    });
  } catch (err) {
    console.error("Failed to persist profile to server:", err);
  }
}

function syncProfileToClientStorage(profile: ParsedResume | null, confidenceScores: Record<string, number>) {
  if (typeof window === "undefined") return;
  
  // Persist to client storage
  if (!profile) {
    deleteCookie("student_profile_text");
    deleteCookie("student_profile_confidence");
    sessionStorage.removeItem("student_profile_image");
  } else {
    if (profile.profileImage) {
      sessionStorage.setItem("student_profile_image", profile.profileImage);
    } else {
      sessionStorage.removeItem("student_profile_image");
    }
    const textProfile = { ...profile, profileImage: null };
    setCookie("student_profile_text", JSON.stringify(textProfile));
    setCookie("student_profile_confidence", JSON.stringify(confidenceScores));
  }

  // Persist to server database async
  persistProfileToServer(profile, confidenceScores);
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
  keywordMatchPercentage: 0,
  experienceMatchPercentage: 0,
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

      const metrics: Record<string, number> = {};
      
      // Personal Info (fullName, email, phone, location)
      const personalFields = [mergedDetails.fullName, mergedDetails.email, mergedDetails.phone, mergedDetails.location];
      metrics["Personal Info"] = Math.round((personalFields.filter(Boolean).length / 4) * 100);

      // Bio / Summary
      metrics["Professional Summary"] = mergedDetails.bio?.trim() ? 100 : 0;

      // Education List
      if (mergedDetails.education?.length > 0) {
        let total = mergedDetails.education.length * 4;
        let filled = 0;
        mergedDetails.education.forEach(e => {
          if (e.degree) filled++;
          if (e.institution) filled++;
          if (e.branch) filled++;
          if (e.endYear) filled++;
        });
        metrics["Education"] = Math.round((filled / total) * 100);
      } else {
        metrics["Education"] = 0;
      }

      // Experience List
      if (mergedDetails.experience?.length > 0) {
        let total = mergedDetails.experience.length * 3;
        let filled = 0;
        mergedDetails.experience.forEach(exp => {
          if (exp.companyName) filled++;
          if (exp.role) filled++;
          if (exp.responsibilities) filled++;
        });
        metrics["Experience"] = Math.round((filled / total) * 100);
      } else {
        metrics["Experience"] = 0;
      }

      // Projects List
      if (mergedDetails.projects?.length > 0) {
        let total = mergedDetails.projects.length * 3;
        let filled = 0;
        mergedDetails.projects.forEach(p => {
          if (p.projectTitle) filled++;
          if (p.description) filled++;
          if (p.technologiesUsed?.length > 0) filled++;
        });
        metrics["Projects"] = Math.round((filled / total) * 100);
      } else {
        metrics["Projects"] = 0;
      }

      // Skills List
      const skillsCount = mergedDetails.technicalSkills?.length || 0;
      metrics["Skills"] = Math.min(100, Math.round((skillsCount / 5) * 100));

      // Certifications
      metrics["Certifications"] = mergedDetails.certifications?.length > 0 ? 100 : 0;

      // Achievements
      metrics["Achievements"] = mergedDetails.achievements?.length > 0 ? 100 : 0;

      // Extra activity metrics
      metrics["Publications"] = mergedDetails.publications?.length > 0 ? 100 : 0;
      metrics["Workshops & Hackathons"] = (mergedDetails.workshops?.length > 0 || mergedDetails.hackathons?.length > 0) ? 100 : 0;
      metrics["Leadership & Volunteer"] = (mergedDetails.leadershipRoles?.length > 0 || mergedDetails.volunteerExperience?.length > 0) ? 100 : 0;

      const values = Object.values(metrics);
      const overall = Math.round(values.reduce((a, b) => a + b, 0) / values.length);

      mergedDetails.completenessMetrics = metrics;
      mergedDetails.overallCompleteness = overall;

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
      keywordMatchPercentage: 0,
      experienceMatchPercentage: 0,
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
      // 1. Try to fetch from server database first
      const response = await fetch("/api/student/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          const profile = data.profile;
          const confidence = data.confidenceScores || {};
          
          set({
            parsedResumeDetails: profile,
            confidenceScores: confidence,
            fileName: profile.fullName ? `${profile.fullName.replace(/\s+/g, "_")}_Profile` : null,
            verified: true
          });
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to load profile from server endpoint, falling back to cookies:", err);
    }

    try {
      // 2. Fall back to local client cookies
      const textCookie = getCookie("student_profile_text");
      const confidenceCookie = getCookie("student_profile_confidence");
      const imageSession = sessionStorage.getItem("student_profile_image");

      if (textCookie) {
        const textProfile = JSON.parse(textCookie);
        const confidence = confidenceCookie ? JSON.parse(confidenceCookie) : {};
        
        textProfile.profileImage = imageSession || null;

        set({
          parsedResumeDetails: textProfile,
          confidenceScores: confidence,
          fileName: textProfile.fullName ? `${textProfile.fullName.replace(/\s+/g, "_")}_Profile` : null,
          verified: true
        });
      }
    } catch (err) {
      console.error("Failed to load persistent student profile:", err);
    }
  }
}));
