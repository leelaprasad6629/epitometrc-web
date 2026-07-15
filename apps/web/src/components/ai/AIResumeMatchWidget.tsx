"use client";

import { useState, useEffect } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, FileText, Upload, User, Mail, Phone, BookOpen, Briefcase, Trash2, RefreshCw, Globe, Award, ShieldAlert, Check, Plus, Trash, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore, ParsedResume, EducationEntry, ExperienceEntry, ProjectEntry, CertificationEntry, InternshipEntry, AchievementEntry } from "@/lib/ai/store/resumeStore";
import { Input } from "@/components/ui/input";

// Role Skills Mapping Configuration
const ROLE_SKILLS_MAP: Record<string, { mustHave: string[]; preferred: string[] }> = {
  "Full Stack Developer": {
    mustHave: ["javascript", "react", "node.js", "express", "sql", "git"],
    preferred: ["docker", "aws", "typescript", "mongodb"]
  },
  "Frontend Developer": {
    mustHave: ["javascript", "react", "html", "css", "tailwind", "git"],
    preferred: ["next.js", "typescript", "zustand", "framer motion"]
  },
  "Backend Developer": {
    mustHave: ["node.js", "express", "postgresql", "rest apis", "git", "sql"],
    preferred: ["docker", "aws", "redis", "graphql", "prisma"]
  },
  "Python Developer": {
    mustHave: ["python", "django", "fastapi", "flask", "sql", "git"],
    preferred: ["docker", "aws", "redis", "postgresql"]
  },
  "Java Developer": {
    mustHave: ["java", "spring boot", "hibernate", "sql", "git", "maven"],
    preferred: ["docker", "aws", "microservices", "kubernetes"]
  },
  "Data Analyst": {
    mustHave: ["python", "sql", "excel", "tableau", "statistics", "pandas"],
    preferred: ["power bi", "r", "machine learning", "matplotlib"]
  },
  "AI/ML Engineer": {
    mustHave: ["python", "tensorflow", "pytorch", "scikit-learn", "statistics", "git"],
    preferred: ["docker", "aws", "nlp", "computer vision", "transformers"]
  }
};

export default function AIResumeMatchWidget() {
  const {
    fileName,
    selectedJobRole,
    parsedResumeDetails,
    verified,
    confidenceScores,
    atsScore,
    matchScore,
    skillMatchPercentage,
    completeness,
    matchedSkills,
    missingSkills,
    recommendations,
    strengths,
    improvements,
    setResumeData,
    updateParsedDetails,
    setSelectedJobRole,
    setVerified,
    updateAnalysis,
    deleteResume,
    loadProfileFromServer
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<"details" | "analytics">("details");
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [verifiedSaved, setVerifiedSaved] = useState(false);
  const [reviewingSkills, setReviewingSkills] = useState(false);

  useEffect(() => {
    loadProfileFromServer();
  }, [loadProfileFromServer]);

  // Trigger Programmatic Matching Analysis
  const runProgrammaticAnalysis = async (currentDetails: ParsedResume, role: string) => {
    setAnalyzing(true);
    try {
      const fields = [
        currentDetails.fullName,
        currentDetails.email,
        currentDetails.phone,
        currentDetails.location,
        currentDetails.linkedin,
        currentDetails.github,
        currentDetails.portfolioWebsite,
        currentDetails.education?.length > 0 ? "edu" : "",
        currentDetails.experience?.length > 0 ? "exp" : "",
        currentDetails.projects?.length > 0 ? "proj" : "",
        currentDetails.certifications?.length > 0 ? "cert" : "",
        currentDetails.technicalSkills?.length > 0 ? "tech" : "",
        currentDetails.softSkills?.length > 0 ? "soft" : "",
        currentDetails.bio ? "bio" : "",
        currentDetails.programmingLanguages?.length > 0 ? "langs" : "",
        currentDetails.frontend?.length > 0 ? "front" : "",
        currentDetails.backend?.length > 0 ? "back" : "",
        currentDetails.frameworks?.length > 0 ? "frames" : "",
        currentDetails.databases?.length > 0 ? "dbs" : "",
        currentDetails.cloud?.length > 0 ? "clouds" : "",
        currentDetails.devops?.length > 0 ? "devops" : "",
        currentDetails.testing?.length > 0 ? "test" : "",
        currentDetails.mobile?.length > 0 ? "mobile" : "",
        currentDetails.aiml?.length > 0 ? "aiml" : "",
        currentDetails.achievements?.length > 0 ? "achieve" : "",
        currentDetails.internships?.length > 0 ? "intern" : ""
      ].filter(Boolean);
      
      const completenessVal = Math.round((fields.length / 26) * 100);

      // Programmatic Skill Match
      const requirements = ROLE_SKILLS_MAP[role] || { mustHave: [], preferred: [] };
      const allUserSkills = [
        ...(currentDetails.technicalSkills || []),
        ...(currentDetails.programmingLanguages || []),
        ...(currentDetails.frontend || []),
        ...(currentDetails.backend || []),
        ...(currentDetails.frameworks || []),
        ...(currentDetails.databases || []),
        ...(currentDetails.cloud || []),
        ...(currentDetails.devops || []),
        ...(currentDetails.testing || []),
        ...(currentDetails.mobile || []),
        ...(currentDetails.aiml || [])
      ].map(s => s.trim().toLowerCase());

      const matchedMustHave = requirements.mustHave.filter(s => allUserSkills.includes(s));
      const matchedPreferred = requirements.preferred.filter(s => allUserSkills.includes(s));

      const totalRequired = requirements.mustHave.length + requirements.preferred.length;
      const totalMatched = matchedMustHave.length + matchedPreferred.length;

      const skillMatchPercentageVal = totalRequired > 0
        ? Math.round((totalMatched / totalRequired) * 100)
        : 0;

      const mustHaveScore = requirements.mustHave.length > 0 ? (matchedMustHave.length / requirements.mustHave.length) * 70 : 0;
      const preferredScore = requirements.preferred.length > 0 ? (matchedPreferred.length / requirements.preferred.length) * 30 : 0;
      
      const matchScoreVal = Math.min(100, Math.round(mustHaveScore + preferredScore));
      const atsScoreVal = Math.min(100, Math.round((matchScoreVal * 0.7) + (completenessVal * 0.3)));

      const matchedList = [...matchedMustHave, ...matchedPreferred].map(s => s.toUpperCase());
      const missingList = [...requirements.mustHave, ...requirements.preferred]
        .filter(s => !allUserSkills.includes(s))
        .map(s => s.toUpperCase());

      // Fetch dynamic insights
      const res = await fetch("/api/ai/resume-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedJobRole: role,
          atsScore: atsScoreVal,
          matchScore: matchScoreVal,
          skillMatchPercentage: skillMatchPercentageVal,
          matchedSkills: matchedList,
          missingSkills: missingList,
          fullName: currentDetails.fullName
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        const result = data.result;
        updateAnalysis({
          atsScore: atsScoreVal,
          matchScore: matchScoreVal,
          skillMatchPercentage: skillMatchPercentageVal,
          completeness: completenessVal,
          matchedSkills: matchedList,
          missingSkills: missingList,
          missingKeywords: missingList.slice(0, 3),
          strengths: result.strengths,
          improvements: result.weaknesses,
          recommendations: result.suggestions,
          certRecommendations: result.certRecommendations,
          projectRecommendations: result.techRecommendations
        });
      }
    } catch (err) {
      console.error("Analysis generation failed:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Re-run matching analysis on selected job role changes (if verified)
  useEffect(() => {
    if (parsedResumeDetails && verified) {
      runProgrammaticAnalysis(parsedResumeDetails, selectedJobRole);
    }
  }, [selectedJobRole]);

  // Handle file upload and parse request
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");
    setVerifiedSaved(false);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Data = event.target?.result?.toString().split(",")[1] || "";
        const res = await fetch("/api/ai/parse-resume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: file.name,
            fileMimeType: file.type || "application/pdf",
            fileBase64: base64Data
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setResumeData(file.name, base64Data, file.type || "application/pdf", data.result, data.confidenceScores);
          setActiveTab("details");
        } else {
          setError(data.error || "Failed to parse resume.");
        }
      } catch {
        setError("Connection timeout parsing file.");
      } finally {
        setLoading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleVerifyAndSave = () => {
    if (!parsedResumeDetails) return;
    setVerified(true);
    setVerifiedSaved(true);
    runProgrammaticAnalysis(parsedResumeDetails, selectedJobRole);
    
    setTimeout(() => {
      setActiveTab("analytics");
      setVerifiedSaved(false);
    }, 1200);
  };

  const CircularProgress = ({ value, label, colorClass }: { value: number; label: string; colorClass: string }) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-50/50 rounded-xl border border-slate-100 flex-1 min-w-[75px]">
        <div className="relative h-12 w-12 flex items-center justify-center">
          <svg className="h-full w-full -rotate-90">
            <circle cx="24" cy="24" r={radius} className="stroke-slate-100 fill-transparent stroke-2.5" />
            <circle
              cx="24"
              cy="24"
              r={radius}
              className={`fill-transparent stroke-2.5 transition-all duration-700 ${colorClass}`}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
          <span className="absolute text-[10px] font-black text-slate-800 font-mono">{value}%</span>
        </div>
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest text-center">{label}</span>
      </div>
    );
  };

  // Status Badge System Renderer based on type and score
  const renderStatusBadge = (field: string, type: "deterministic" | "structured" | "ai") => {
    if (type === "ai") {
      return (
        <span className="text-[9px] font-black text-blue-600 bg-blue-50 border border-blue-100 rounded px-1.5 py-0.5 ml-2 inline-flex items-center gap-0.5">
          <Info className="h-3 w-3" /> AI Generated – Review Recommended
        </span>
      );
    }

    const score = confidenceScores?.[field] ?? 0;
    
    // Check if empty
    const value = (parsedResumeDetails as any)?.[field];
    const isEmpty = !value || (Array.isArray(value) && value.length === 0);
    
    if (score === 0 || isEmpty) {
      return (
        <span className="text-[9px] font-black text-red-500 bg-red-50 border border-red-100 rounded px-1.5 py-0.5 ml-2 inline-flex items-center gap-0.5">
          <ShieldAlert className="h-3 w-3" /> Missing Information
        </span>
      );
    }
    
    if (score < 90) {
      return (
        <span className="text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 rounded px-1.5 py-0.5 ml-2 inline-flex items-center gap-0.5">
          <AlertTriangle className="h-3 w-3" /> Needs Review ({score}%)
        </span>
      );
    }

    return (
      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-0.5 ml-2 inline-flex items-center gap-0.5">
        <CheckCircle2 className="h-3 w-3" /> Verified
      </span>
    );
  };

  const verifiedSkillsList = parsedResumeDetails?.verifiedSkills || [];
  const parsedSkillsList = parsedResumeDetails?.technicalSkills || [];
  const missingSkillsInProfile = parsedSkillsList.filter(
    s => !verifiedSkillsList.map(v => v.toLowerCase()).includes(s.toLowerCase())
  );

  const handleAddAllDetected = () => {
    const updated = Array.from(new Set([...verifiedSkillsList, ...missingSkillsInProfile]));
    updateParsedDetails({ verifiedSkills: updated });
    setReviewingSkills(false);
  };

  // List Modification Handlers
  const addEducation = () => {
    const list = parsedResumeDetails?.education || [];
    updateParsedDetails({ education: [...list, { institution: "", degree: "", year: "", location: "" }] });
  };
  const removeEducation = (idx: number) => {
    const list = parsedResumeDetails?.education || [];
    updateParsedDetails({ education: list.filter((_, i) => i !== idx) });
  };
  const editEducation = (idx: number, key: keyof EducationEntry, val: string) => {
    const list = parsedResumeDetails?.education || [];
    updateParsedDetails({ education: list.map((item, i) => i === idx ? { ...item, [key]: val } : item) });
  };

  const addExperience = () => {
    const list = parsedResumeDetails?.experience || [];
    updateParsedDetails({ experience: [...list, { company: "", role: "", duration: "", description: "", location: "" }] });
  };
  const removeExperience = (idx: number) => {
    const list = parsedResumeDetails?.experience || [];
    updateParsedDetails({ experience: list.filter((_, i) => i !== idx) });
  };
  const editExperience = (idx: number, key: keyof ExperienceEntry, val: string) => {
    const list = parsedResumeDetails?.experience || [];
    updateParsedDetails({ experience: list.map((item, i) => i === idx ? { ...item, [key]: val } : item) });
  };

  const addProject = () => {
    const list = parsedResumeDetails?.projects || [];
    updateParsedDetails({ projects: [...list, { name: "", description: "", technologies: [] }] });
  };
  const removeProject = (idx: number) => {
    const list = parsedResumeDetails?.projects || [];
    updateParsedDetails({ projects: list.filter((_, i) => i !== idx) });
  };
  const editProject = (idx: number, key: keyof ProjectEntry, val: any) => {
    const list = parsedResumeDetails?.projects || [];
    updateParsedDetails({ projects: list.map((item, i) => i === idx ? { ...item, [key]: val } : item) });
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-5 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
          <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
            AI Resume Match Analyzer
          </h2>
        </div>
      </div>

      <p className="text-slate-400 text-xs leading-relaxed text-left font-medium">
        Upload your resume source of truth. Parse details, verify your profile metrics, and match skills against target job configurations.
      </p>

      {/* Upload Controls */}
      {fileName ? (
        <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
          <div className="flex items-start gap-3">
            <span className="p-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 shrink-0">
              <FileText className="h-5 w-5" />
            </span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{fileName}</h4>
              <p className="text-[10px] text-slate-400 font-medium font-sans">Dynamic Stored Source of Truth</p>
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer font-bold text-[10px] text-slate-600 transition-colors">
              <RefreshCw className="h-3 w-3" />
              Replace Resume
              <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
            </label>
            <button
              onClick={deleteResume}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-100 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-[10px] transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              Delete Stored
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/20 hover:bg-slate-50 hover:border-orange-400 cursor-pointer transition-all">
          <Upload className="h-6.5 w-6.5 text-slate-400 mb-1.5 animate-bounce" />
          <div className="text-center">
            <p className="text-xs font-bold text-slate-700">Click to upload your resume</p>
            <p className="text-[9px] text-slate-400 font-medium font-sans">Supports PDF, DOCX, or TXT</p>
          </div>
          <input type="file" accept=".pdf,.docx,.txt" onChange={handleFileUpload} className="hidden" />
        </label>
      )}

      {loading && (
        <p className="text-orange-500 font-semibold text-center animate-pulse">Running PDF Text Extraction and Gemini Parser Pipeline...</p>
      )}

      {error && (
        <p className="text-red-500 text-[10px] font-semibold text-center">{error}</p>
      )}

      {parsedResumeDetails && missingSkillsInProfile.length > 0 && (
        <div className="rounded-xl border border-blue-100 p-4 bg-blue-50/20 text-left space-y-3.5">
          <div className="flex items-center gap-2 text-[#0b172a] font-bold text-xs">
            <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
            AI Detected New Skills
          </div>
          <p className="text-slate-500 leading-normal">
            We found {missingSkillsInProfile.length} additional skills in your resume.
          </p>
          
          {reviewingSkills ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {missingSkillsInProfile.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-[10px] font-bold text-slate-700">
                    {skill}
                    <button
                      onClick={() => {
                        const updated = [...verifiedSkillsList, skill];
                        updateParsedDetails({ verifiedSkills: updated });
                      }}
                      className="text-emerald-600 hover:text-emerald-700 font-bold ml-1"
                      title="Add skill"
                    >
                      ✓
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={() => setReviewingSkills(false)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-655"
              >
                Close Review
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleAddAllDetected}
                className="px-3.5 py-1.5 rounded-lg bg-[#0b172a] hover:bg-slate-800 text-white font-bold text-[10px]"
              >
                Add All
              </button>
              <button
                onClick={() => setReviewingSkills(true)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-[10px]"
              >
                Review
              </button>
            </div>
          )}
        </div>
      )}

      {parsedResumeDetails && (
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex rounded-xl bg-slate-50 p-1 border border-slate-100">
            <button
              onClick={() => setActiveTab("details")}
              className={`flex-1 py-2 rounded-lg font-bold text-[10.5px] uppercase tracking-wider transition-colors ${
                activeTab === "details"
                  ? "bg-white text-[#0b172a] shadow-sm border border-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              📋 Verification Inputs
            </button>
            <button
              disabled={!verified}
              onClick={() => setActiveTab("analytics")}
              className={`flex-1 py-2 rounded-lg font-bold text-[10.5px] uppercase tracking-wider transition-colors disabled:opacity-50 ${
                activeTab === "analytics"
                  ? "bg-white text-[#0b172a] shadow-sm border border-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              📊 Programmatic Match
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "details" ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4 text-left pt-1"
              >
                <div className="border border-slate-100 p-4.5 rounded-2xl bg-slate-50/20 space-y-4">
                  <h3 className="font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2">
                    <User className="h-4.5 w-4.5 text-orange-500" /> Personal & Contact Details
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        Full Name {renderStatusBadge("fullName", "deterministic")}
                      </label>
                      <input
                        type="text"
                        value={parsedResumeDetails.fullName}
                        onChange={(e) => updateParsedDetails({ fullName: e.target.value })}
                        className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 outline-none text-xs bg-white focus:border-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        Email Address {renderStatusBadge("email", "deterministic")}
                      </label>
                      <input
                        type="email"
                        value={parsedResumeDetails.email}
                        onChange={(e) => updateParsedDetails({ email: e.target.value })}
                        className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 outline-none text-xs bg-white focus:border-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        Phone Number {renderStatusBadge("phone", "deterministic")}
                      </label>
                      <input
                        type="text"
                        value={parsedResumeDetails.phone}
                        onChange={(e) => updateParsedDetails({ phone: e.target.value })}
                        className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 outline-none text-xs bg-white focus:border-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        Location {renderStatusBadge("location", "deterministic")}
                      </label>
                      <input
                        type="text"
                        value={parsedResumeDetails.location}
                        onChange={(e) => updateParsedDetails({ location: e.target.value })}
                        className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 outline-none text-xs bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <h3 className="font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2 pt-2">
                    <Globe className="h-4.5 w-4.5 text-orange-500" /> Web Links
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        LinkedIn {renderStatusBadge("linkedin", "deterministic")}
                      </label>
                      <input
                        type="text"
                        value={parsedResumeDetails.linkedin}
                        onChange={(e) => updateParsedDetails({ linkedin: e.target.value })}
                        className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 outline-none text-xs bg-white focus:border-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        GitHub {renderStatusBadge("github", "deterministic")}
                      </label>
                      <input
                        type="text"
                        value={parsedResumeDetails.github}
                        onChange={(e) => updateParsedDetails({ github: e.target.value })}
                        className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 outline-none text-xs bg-white focus:border-orange-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        Portfolio URL {renderStatusBadge("portfolioWebsite", "deterministic")}
                      </label>
                      <input
                        type="text"
                        value={parsedResumeDetails.portfolioWebsite}
                        onChange={(e) => updateParsedDetails({ portfolioWebsite: e.target.value })}
                        className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 outline-none text-xs bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Summary Profile Bio */}
                  <h3 className="font-bold text-slate-700 flex items-center gap-1.5 border-b border-slate-50 pb-2 pt-2">
                    <BookOpen className="h-4.5 w-4.5 text-orange-500" /> Summary Biography
                  </h3>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                      Summary Biography {renderStatusBadge("bio", "ai")}
                    </label>
                    <textarea
                      value={parsedResumeDetails.bio}
                      onChange={(e) => updateParsedDetails({ bio: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-600 h-16 resize-none outline-none font-sans bg-white focus:border-orange-500"
                    />
                  </div>

                  <h3 className="font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2 pt-2">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4.5 w-4.5 text-orange-500" /> Education History {renderStatusBadge("education", "structured")}
                    </span>
                    <button onClick={addEducation} className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5 text-[10px]">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </h3>

                  <div className="space-y-3.5">
                    {parsedResumeDetails.education?.map((item, idx) => (
                      <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-2 relative bg-white">
                        <button onClick={() => removeEducation(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                          <Input
                            placeholder="Institution"
                            value={item.institution}
                            onChange={(e) => editEducation(idx, "institution", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Degree"
                            value={item.degree}
                            onChange={(e) => editEducation(idx, "degree", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Year"
                            value={item.year}
                            onChange={(e) => editEducation(idx, "year", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Location"
                            value={item.location}
                            onChange={(e) => editEducation(idx, "location", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Briefcase className="h-4.5 w-4.5 text-orange-500" /> Work Experience {renderStatusBadge("experience", "structured")}
                    </span>
                    <button onClick={addExperience} className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5 text-[10px]">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </h3>

                  <div className="space-y-3.5">
                    {parsedResumeDetails.experience?.map((item, idx) => (
                      <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-2 relative bg-white">
                        <button onClick={() => removeExperience(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                          <Input
                            placeholder="Company"
                            value={item.company}
                            onChange={(e) => editExperience(idx, "company", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Role"
                            value={item.role}
                            onChange={(e) => editExperience(idx, "role", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Duration"
                            value={item.duration}
                            onChange={(e) => editExperience(idx, "duration", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Location"
                            value={item.location}
                            onChange={(e) => editExperience(idx, "location", e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>
                        <textarea
                          placeholder="Accomplishments Description"
                          value={item.description}
                          onChange={(e) => editExperience(idx, "description", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-600 h-14 resize-none outline-none font-sans"
                        />
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Globe className="h-4.5 w-4.5 text-orange-500" /> Projects Portfolio {renderStatusBadge("projects", "structured")}
                    </span>
                    <button onClick={addProject} className="text-orange-500 hover:text-orange-600 font-bold flex items-center gap-0.5 text-[10px]">
                      <Plus className="h-3.5 w-3.5" /> Add
                    </button>
                  </h3>

                  <div className="space-y-3.5">
                    {parsedResumeDetails.projects?.map((item, idx) => (
                      <div key={idx} className="p-3 border border-slate-200 rounded-xl space-y-2 relative bg-white">
                        <button onClick={() => removeProject(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                          <Trash className="h-3.5 w-3.5" />
                        </button>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                          <Input
                            placeholder="Project Name"
                            value={item.name}
                            onChange={(e) => editProject(idx, "name", e.target.value)}
                            className="h-8 text-xs"
                          />
                          <Input
                            placeholder="Technologies (comma-separated)"
                            value={item.technologies?.join(", ") || ""}
                            onChange={(e) => editProject(idx, "technologies", e.target.value.split(",").map(t => t.trim()).filter(Boolean))}
                            className="h-8 text-xs"
                          />
                        </div>
                        <textarea
                          placeholder="Project Description"
                          value={item.description}
                          onChange={(e) => editProject(idx, "description", e.target.value)}
                          className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-600 h-14 resize-none outline-none font-sans"
                        />
                      </div>
                    ))}
                  </div>

                  <h3 className="font-bold text-slate-700 flex items-center justify-between border-b border-slate-50 pb-2 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Award className="h-4.5 w-4.5 text-orange-500" /> Technical Skills {renderStatusBadge("technicalSkills", "deterministic")}
                    </span>
                  </h3>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                        Technical Skills (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={parsedResumeDetails.technicalSkills?.join(", ") || ""}
                        onChange={(e) => updateParsedDetails({ technicalSkills: e.target.value.split(",").map(x => x.trim()).filter(Boolean) })}
                        className="w-full h-8.5 rounded-lg border border-slate-200 px-3 text-slate-600 outline-none text-xs bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleVerifyAndSave}
                    disabled={verifiedSaved}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors disabled:opacity-60 shadow-sm shadow-orange-100 text-xs"
                  >
                    {verifiedSaved ? (
                      <>
                        <Check className="h-4.5 w-4.5 animate-ping" /> Details Saved!
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4.5 w-4.5" /> Verify & Save Details
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-5 text-left"
              >
                <div className="space-y-1.5">
                  <label className="text-[9px] font-bold text-slate-700 uppercase tracking-wider block">
                    Select Target Job Role
                  </label>
                  <select
                    value={selectedJobRole}
                    onChange={(e) => setSelectedJobRole(e.target.value)}
                    className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
                  >
                    {Object.keys(ROLE_SKILLS_MAP).map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-3 justify-between items-center">
                  <CircularProgress value={atsScore} label="ATS Score" colorClass="stroke-red-500" />
                  <CircularProgress value={matchScore} label="Match Score" colorClass="stroke-orange-500" />
                  <CircularProgress value={skillMatchPercentage} label="Skills Match" colorClass="stroke-blue-500" />
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[9px] font-bold text-slate-600">
                    <span>Profile Completeness (21 categories)</span>
                    <span>{completeness}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>
                </div>

                {analyzing ? (
                  <p className="text-orange-500 text-center animate-pulse py-2">Recalculating programmatic metrics and AI analysis...</p>
                ) : (
                  <>
                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div className="space-y-1.5">
                        <span className="text-[9.5px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Programmatic Matched Skills ({matchedSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {matchedSkills.length > 0 ? (
                            matchedSkills.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-600 border border-emerald-100">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic text-[10px]">No matches found.</span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[9.5px] font-bold text-red-500 uppercase tracking-wider flex items-center gap-1">
                          <ShieldAlert className="h-3.5 w-3.5" /> Programmatic Missing Skills ({missingSkills.length})
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {missingSkills.length > 0 ? (
                            missingSkills.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-red-50 text-[9px] font-bold text-red-600 border border-red-100">
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-emerald-600 font-bold text-[10px]">100% skill alignment met!</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-4 space-y-3">
                      <div className="space-y-1">
                        <span className="font-bold text-slate-700 block">AI Strategic Strengths</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[10px] leading-relaxed">
                          {strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ul>
                      </div>

                      <div className="space-y-1 pt-1">
                        <span className="font-bold text-slate-700 block">AI Strategic Recommendations & Suggestions</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[10px] leading-relaxed">
                          {recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
                        </ul>
                      </div>

                      {improvements.length > 0 && (
                        <div className="space-y-1 pt-1">
                          <span className="font-bold text-slate-700 block">AI ATS Improvements & Warnings</span>
                          <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[10px] leading-relaxed">
                            {improvements.map((imp, idx) => <li key={idx}>{imp}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
