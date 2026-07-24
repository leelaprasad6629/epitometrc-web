"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, CheckCircle2, AlertTriangle, Lightbulb, FileText, Upload, 
  User, Mail, Phone, BookOpen, Briefcase, Trash2, Globe, Award, 
  Check, Plus, Trash, Info, RefreshCw 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useResumeStore, ParsedResume, EducationEntry, ExperienceEntry, 
  ProjectEntry, CertificationEntry, AchievementEntry 
} from "@/lib/ai/store/resumeStore";
import { Input } from "@/components/ui/input";
import DashboardCard from "@/components/dashboard/DashboardCard";

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

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState<"personal" | "education" | "experience" | "projects" | "skills" | "certs">("personal");
  const [activeWidgetMode, setActiveWidgetMode] = useState<"review" | "analysis">("review");

  // Load profile from server on mount
  useEffect(() => {
    loadProfileFromServer().then(() => {
      if (verified) {
        setActiveWidgetMode("analysis");
      }
    });
  }, [loadProfileFromServer, verified]);

  // Run matching analytics
  const runMatchingAnalytics = async (currentDetails: ParsedResume, role: string) => {
    setAnalyzing(true);
    try {
      const completenessVal = currentDetails.overallCompleteness || 0;
      const requirements = ROLE_SKILLS_MAP[role] || { mustHave: [], preferred: [] };
      const userSkills = [
        ...(currentDetails.technicalSkills || []),
        ...(currentDetails.programmingLanguages || []),
        ...(currentDetails.frontend || []),
        ...(currentDetails.backend || []),
        ...(currentDetails.frameworks || []),
        ...(currentDetails.databases || []),
        ...(currentDetails.cloud || []),
        ...(currentDetails.devops || []),
        ...(currentDetails.tools || [])
      ].map(s => s.trim().toLowerCase());

      const matchedMust = requirements.mustHave.filter(s => userSkills.includes(s));
      const matchedPref = requirements.preferred.filter(s => userSkills.includes(s));

      const totalRequired = requirements.mustHave.length + requirements.preferred.length;
      const totalMatched = matchedMust.length + matchedPref.length;

      const skillMatchVal = totalRequired > 0 ? Math.round((totalMatched / totalRequired) * 100) : 0;
      const matchScoreVal = Math.min(100, Math.round((matchedMust.length / (requirements.mustHave.length || 1)) * 70 + (matchedPref.length / (requirements.preferred.length || 1)) * 30));
      const atsScoreVal = Math.min(100, Math.round((matchScoreVal * 0.7) + (completenessVal * 0.3)));

      const matchedList = [...matchedMust, ...matchedPref].map(s => s.toUpperCase());
      const missingList = [...requirements.mustHave, ...requirements.preferred]
        .filter(s => !userSkills.includes(s))
        .map(s => s.toUpperCase());

      // Fetch dynamic insights
      const res = await fetch("/api/ai/resume-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedJobRole: role,
          atsScore: atsScoreVal,
          matchScore: matchScoreVal,
          skillMatchPercentage: skillMatchVal,
          matchedSkills: matchedList,
          missingSkills: missingList,
          fullName: currentDetails.fullName
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updateAnalysis({
          atsScore: atsScoreVal,
          matchScore: matchScoreVal,
          skillMatchPercentage: skillMatchVal,
          completeness: completenessVal,
          matchedSkills: matchedList,
          missingSkills: missingList,
          missingKeywords: missingList.slice(0, 3),
          strengths: data.result.strengths || [],
          improvements: data.result.weaknesses || [],
          recommendations: data.result.suggestions || [],
          certRecommendations: data.result.certRecommendations || [],
          projectRecommendations: data.result.techRecommendations || []
        });
      }
    } catch (err) {
      console.error("Match analytics failed:", err);
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (parsedResumeDetails && verified) {
      runMatchingAnalytics(parsedResumeDetails, selectedJobRole);
    }
  }, [selectedJobRole]);

  // Handle resume uploading
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

        if (!res.ok) {
          setError(`Parsing service unavailable (${res.status}).`);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setResumeData(file.name, base64Data, file.type || "application/pdf", data.result, data.confidenceScores);
          setActiveWidgetMode("review");
          setActiveEditorTab("personal");
        } else {
          setError(data.error || "Parsing failed.");
        }
      } catch (err: any) {
        setError(err.message || "Failed to parse file.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Populate Profile & Save
  const handleSaveAndVerify = async () => {
    if (!parsedResumeDetails) return;
    setVerified(true);
    setActiveWidgetMode("analysis");
    await runMatchingAnalytics(parsedResumeDetails, selectedJobRole);
  };

  // Re-upload action
  const handleReset = () => {
    deleteResume();
    setActiveWidgetMode("review");
    setError("");
  };

  // Helper: render confidence badge
  const renderConfidenceBadge = (score: number | undefined) => {
    if (score === undefined || score < 0) return null;
    if (score >= 80) return <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black bg-emerald-50 border border-emerald-100 text-emerald-600 font-sans uppercase">High</span>;
    if (score >= 50) return <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black bg-amber-50 border border-amber-100 text-amber-600 font-sans uppercase">Medium</span>;
    return <span className="px-2 py-0.5 rounded-full text-[8.5px] font-black bg-rose-50 border border-rose-100 text-rose-600 font-sans uppercase">Low</span>;
  };

  if (loading) {
    return (
      <DashboardCard glowColor="purple" className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="relative">
          <RefreshCw className="h-10 w-10 text-purple-600 animate-spin" />
          <Sparkles className="h-4 w-4 text-orange-500 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <div>
          <h3 className="font-display font-black text-slate-800 text-sm">Resume Intelligence Engine Active</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Groq llama-3.3 parsing layout, extracting sections, & calculating confidence matrices...</p>
        </div>
      </DashboardCard>
    );
  }

  // Upload state
  if (!parsedResumeDetails) {
    return (
      <DashboardCard glowColor="blue" className="p-8 text-center space-y-6">
        <div className="max-w-md mx-auto space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-slate-900 text-sm">Upload Candidate Resume</h3>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium leading-relaxed">
              Upload PDF or Word layout formats. Groq Intelligence will parse and populate details automatically.
            </p>
          </div>

          <label className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-3xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-50/50 hover:bg-white group">
            <FileText className="h-8 w-8 text-slate-400 group-hover:text-blue-500 transition-colors" />
            <span className="text-[10.5px] font-bold text-slate-700 mt-2 block">Choose PDF or DOCX file</span>
            <input type="file" onChange={handleFileUpload} accept=".pdf,.docx" className="hidden" />
          </label>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-[10px] text-left">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </DashboardCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection Tabs */}
      <div className="flex justify-between items-center bg-white p-2 rounded-2xl border border-slate-100 shadow-xs">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveWidgetMode("review")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeWidgetMode === "review" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            1. Review & Edit Fields
          </button>
          <button
            onClick={() => {
              if (verified) {
                setActiveWidgetMode("analysis");
              }
            }}
            disabled={!verified}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              !verified ? "opacity-50 cursor-not-allowed text-slate-300" :
              activeWidgetMode === "analysis" ? "bg-slate-900 text-white shadow-xs" : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            2. Match Analysis
          </button>
        </div>
        <button
          onClick={handleReset}
          className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
        >
          <RefreshCw className="h-3 w-3" /> Re-upload
        </button>
      </div>

      {activeWidgetMode === "review" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Editor Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Editor Sections Navigation */}
            <div className="flex flex-wrap gap-1.5 pb-1">
              {[
                { id: "personal", label: "Personal Info", icon: User },
                { id: "education", label: "Education", icon: BookOpen },
                { id: "experience", label: "Experience", icon: Briefcase },
                { id: "projects", label: "Projects", icon: FileText },
                { id: "skills", label: "Skills", icon: Globe },
                { id: "certs", label: "Certs & Awards", icon: Award }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveEditorTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-[10.5px] font-black flex items-center gap-1.5 border transition-all ${
                      activeEditorTab === tab.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Editor details body */}
            <DashboardCard glowColor="blue" className="text-left space-y-4">
              {/* Personal Details */}
              {activeEditorTab === "personal" && (
                <div className="space-y-4 font-sans">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Candidate Personal Details</h4>
                    {renderConfidenceBadge(confidenceScores.fullName)}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Full Name</span>
                      <Input
                        type="text"
                        value={parsedResumeDetails.fullName || ""}
                        onChange={(e) => updateParsedDetails({ fullName: e.target.value })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Headline</span>
                      <Input
                        type="text"
                        value={parsedResumeDetails.headline || ""}
                        onChange={(e) => updateParsedDetails({ headline: e.target.value })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Email</span>
                      <Input
                        type="email"
                        value={parsedResumeDetails.email || ""}
                        onChange={(e) => updateParsedDetails({ email: e.target.value })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Phone</span>
                      <Input
                        type="text"
                        value={parsedResumeDetails.phone || ""}
                        onChange={(e) => updateParsedDetails({ phone: e.target.value })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Location</span>
                      <Input
                        type="text"
                        value={parsedResumeDetails.location || ""}
                        onChange={(e) => updateParsedDetails({ location: e.target.value })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">LinkedIn URL</span>
                      <Input
                        type="text"
                        value={parsedResumeDetails.linkedin || ""}
                        onChange={(e) => updateParsedDetails({ linkedin: e.target.value })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">GitHub URL</span>
                      <Input
                        type="text"
                        value={parsedResumeDetails.github || ""}
                        onChange={(e) => updateParsedDetails({ github: e.target.value })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400">Portfolio</span>
                      <Input
                        type="text"
                        value={parsedResumeDetails.portfolioWebsite || ""}
                        onChange={(e) => updateParsedDetails({ portfolioWebsite: e.target.value })}
                        className="h-8 text-xs font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400">Career Summary / Bio</span>
                    <textarea
                      value={parsedResumeDetails.bio || ""}
                      onChange={(e) => updateParsedDetails({ bio: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs leading-relaxed outline-none h-24 font-medium resize-none bg-white transition-all focus:border-slate-800"
                    />
                  </div>
                </div>
              )}

              {/* Education section */}
              {activeEditorTab === "education" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Education Details</h4>
                    <button
                      onClick={() => {
                        const current = parsedResumeDetails.education || [];
                        updateParsedDetails({
                          education: [...current, { degree: "", branch: "", institution: "", university: "", startYear: "", endYear: "", cgpa: "" }]
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold text-[10px] flex items-center gap-0.5 bg-blue-50/50 px-2 py-1 rounded-lg"
                    >
                      <Plus className="h-3 w-3" /> Add Edu
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(parsedResumeDetails.education || []).map((item, idx) => (
                      <div key={idx} className="p-3 border border-slate-100 rounded-2xl relative space-y-3 bg-slate-50/20">
                        <button
                          onClick={() => {
                            const current = parsedResumeDetails.education || [];
                            updateParsedDetails({ education: current.filter((_, i) => i !== idx) });
                          }}
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Degree</span>
                            <Input
                              type="text"
                              value={item.degree}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.education || [])];
                                current[idx].degree = e.target.value;
                                updateParsedDetails({ education: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Branch</span>
                            <Input
                              type="text"
                              value={item.branch}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.education || [])];
                                current[idx].branch = e.target.value;
                                updateParsedDetails({ education: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Institution</span>
                            <Input
                              type="text"
                              value={item.institution}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.education || [])];
                                current[idx].institution = e.target.value;
                                updateParsedDetails({ education: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">CGPA/Marks</span>
                            <Input
                              type="text"
                              value={item.cgpa}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.education || [])];
                                current[idx].cgpa = e.target.value;
                                updateParsedDetails({ education: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Start Year</span>
                            <Input
                              type="text"
                              value={item.startYear}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.education || [])];
                                current[idx].startYear = e.target.value;
                                updateParsedDetails({ education: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">End Year</span>
                            <Input
                              type="text"
                              value={item.endYear}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.education || [])];
                                current[idx].endYear = e.target.value;
                                updateParsedDetails({ education: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(parsedResumeDetails.education || []).length === 0 && (
                      <p className="text-slate-400 italic text-[10px]">No education records. Click Add Edu to create one.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Experience section */}
              {activeEditorTab === "experience" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Professional Experience</h4>
                    <button
                      onClick={() => {
                        const current = parsedResumeDetails.experience || [];
                        updateParsedDetails({
                          experience: [...current, { companyName: "", role: "", employmentType: "Full-Time", startDate: "", endDate: "", duration: "", responsibilities: "", technologiesUsed: [] }]
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold text-[10px] flex items-center gap-0.5 bg-blue-50/50 px-2 py-1 rounded-lg"
                    >
                      <Plus className="h-3 w-3" /> Add Exp
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(parsedResumeDetails.experience || []).map((item, idx) => (
                      <div key={idx} className="p-3 border border-slate-100 rounded-2xl relative space-y-3 bg-slate-50/20 text-[10.5px]">
                        <button
                          onClick={() => {
                            const current = parsedResumeDetails.experience || [];
                            updateParsedDetails({ experience: current.filter((_, i) => i !== idx) });
                          }}
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Company Name</span>
                            <Input
                              type="text"
                              value={item.companyName}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.experience || [])];
                                current[idx].companyName = e.target.value;
                                updateParsedDetails({ experience: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Role</span>
                            <Input
                              type="text"
                              value={item.role}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.experience || [])];
                                current[idx].role = e.target.value;
                                updateParsedDetails({ experience: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Start Date</span>
                            <Input
                              type="text"
                              value={item.startDate}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.experience || [])];
                                current[idx].startDate = e.target.value;
                                updateParsedDetails({ experience: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">End Date</span>
                            <Input
                              type="text"
                              value={item.endDate}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.experience || [])];
                                current[idx].endDate = e.target.value;
                                updateParsedDetails({ experience: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400 font-sans">Responsibilities & Key Tasks</span>
                          <textarea
                            value={item.responsibilities}
                            onChange={(e) => {
                              const current = [...(parsedResumeDetails.experience || [])];
                              current[idx].responsibilities = e.target.value;
                              updateParsedDetails({ experience: current });
                            }}
                            className="w-full rounded-2xl border border-slate-200 p-2.5 text-[10.5px] outline-none h-16 resize-none font-medium bg-white"
                          />
                        </div>
                      </div>
                    ))}
                    {(parsedResumeDetails.experience || []).length === 0 && (
                      <p className="text-slate-400 italic text-[10px]">No work history recorded. Click Add Exp to create one.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Projects section */}
              {activeEditorTab === "projects" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Projects Portfolio</h4>
                    <button
                      onClick={() => {
                        const current = parsedResumeDetails.projects || [];
                        updateParsedDetails({
                          projects: [...current, { projectTitle: "", description: "", technologiesUsed: [], githubLink: "", liveUrl: "", duration: "" }]
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold text-[10px] flex items-center gap-0.5 bg-blue-50/50 px-2 py-1 rounded-lg"
                    >
                      <Plus className="h-3 w-3" /> Add Project
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(parsedResumeDetails.projects || []).map((item, idx) => (
                      <div key={idx} className="p-3 border border-slate-100 rounded-2xl relative space-y-3 bg-slate-50/20 text-[10.5px]">
                        <button
                          onClick={() => {
                            const current = parsedResumeDetails.projects || [];
                            updateParsedDetails({ projects: current.filter((_, i) => i !== idx) });
                          }}
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Project Title</span>
                            <Input
                              type="text"
                              value={item.projectTitle}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.projects || [])];
                                current[idx].projectTitle = e.target.value;
                                updateParsedDetails({ projects: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Github Link</span>
                            <Input
                              type="text"
                              value={item.githubLink}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.projects || [])];
                                current[idx].githubLink = e.target.value;
                                updateParsedDetails({ projects: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400">Description</span>
                          <textarea
                            value={item.description}
                            onChange={(e) => {
                              const current = [...(parsedResumeDetails.projects || [])];
                              current[idx].description = e.target.value;
                              updateParsedDetails({ projects: current });
                            }}
                            className="w-full rounded-2xl border border-slate-200 p-2.5 text-[10.5px] outline-none h-16 resize-none font-medium bg-white"
                          />
                        </div>
                      </div>
                    ))}
                    {(parsedResumeDetails.projects || []).length === 0 && (
                      <p className="text-slate-400 italic text-[10px]">No projects listed. Click Add Project to create one.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Skills Editor */}
              {activeEditorTab === "skills" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Skills Inventory</h4>
                  </div>
                  <div className="space-y-3 font-sans">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400">Technical Skills</span>
                      <textarea
                        value={(parsedResumeDetails.technicalSkills || []).join(", ")}
                        onChange={(e) => {
                          const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          updateParsedDetails({ technicalSkills: list });
                        }}
                        placeholder="React, TypeScript, Node.js"
                        className="w-full rounded-2xl border border-slate-200 p-3 text-xs leading-relaxed outline-none h-20 font-medium resize-none bg-white focus:border-slate-800"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400">Soft Skills</span>
                      <textarea
                        value={(parsedResumeDetails.softSkills || []).join(", ")}
                        onChange={(e) => {
                          const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          updateParsedDetails({ softSkills: list });
                        }}
                        placeholder="Communication, Teamwork, Problem Solving"
                        className="w-full rounded-2xl border border-slate-200 p-3 text-xs leading-relaxed outline-none h-20 font-medium resize-none bg-white focus:border-slate-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Certifications and Achievements */}
              {activeEditorTab === "certs" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                    <h4 className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Certifications & Achievements</h4>
                    <button
                      onClick={() => {
                        const current = parsedResumeDetails.certifications || [];
                        updateParsedDetails({
                          certifications: [...current, { certificationName: "", organization: "", date: "", credentialId: "" }]
                        });
                      }}
                      className="text-blue-600 hover:text-blue-700 font-bold text-[10px] flex items-center gap-0.5 bg-blue-50/50 px-2 py-1 rounded-lg"
                    >
                      <Plus className="h-3 w-3" /> Add Cert
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(parsedResumeDetails.certifications || []).map((item, idx) => (
                      <div key={idx} className="p-3 border border-slate-100 rounded-2xl relative space-y-3 bg-slate-50/20 text-[10.5px]">
                        <button
                          onClick={() => {
                            const current = parsedResumeDetails.certifications || [];
                            updateParsedDetails({ certifications: current.filter((_, i) => i !== idx) });
                          }}
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Certification Name</span>
                            <Input
                              type="text"
                              value={item.certificationName}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.certifications || [])];
                                current[idx].certificationName = e.target.value;
                                updateParsedDetails({ certifications: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Organization</span>
                            <Input
                              type="text"
                              value={item.organization}
                              onChange={(e) => {
                                const current = [...(parsedResumeDetails.certifications || [])];
                                current[idx].organization = e.target.value;
                                updateParsedDetails({ certifications: current });
                              }}
                              className="h-7 text-[10.5px]"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    {(parsedResumeDetails.certifications || []).length === 0 && (
                      <p className="text-slate-400 italic text-[10px]">No certifications listed. Click Add Cert to create one.</p>
                    )}
                  </div>
                </div>
              )}
            </DashboardCard>
          </div>

          {/* Right Persistence Details & Metrics Bar */}
          <div className="space-y-6">
            <DashboardCard glowColor="indigo" className="text-left space-y-5">
              <div>
                <h4 className="font-display font-black text-slate-800 text-[11px] uppercase tracking-wider">Engine Telemetry</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Resume Parser structured validation metrics</p>
              </div>

              {/* Confidence Gauges */}
              <div className="space-y-3 border-t border-b border-slate-50 py-4">
                <h5 className="font-black text-slate-500 text-[9px] uppercase tracking-wider">Section Confidence levels</h5>
                <div className="space-y-2.5">
                  {[
                    { key: "fullName", label: "Candidate Name" },
                    { key: "email", label: "Email Address" },
                    { key: "phone", label: "Phone Details" },
                    { key: "location", label: "Location info" },
                    { key: "education", label: "Education" },
                    { key: "experience", label: "Work History" },
                    { key: "projects", label: "Projects" },
                    { key: "skills", label: "Skills Inventory" }
                  ].map((field) => {
                    const score = confidenceScores[field.key];
                    return (
                      <div key={field.key} className="flex justify-between items-center text-[10px]">
                        <span className="font-semibold text-slate-600">{field.label}</span>
                        {renderConfidenceBadge(score)}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Save CTAs */}
              <div className="space-y-3.5 pt-1">
                <button
                  onClick={handleSaveAndVerify}
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 text-xs shadow-md shadow-blue-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <CheckCircle2 className="h-4 w-4" /> Save & Populate Profile
                </button>
                <button
                  onClick={handleReset}
                  className="w-full rounded-2xl border border-slate-200 text-slate-600 font-bold py-3 text-xs hover:bg-slate-50 transition-all text-center"
                >
                  Discard Parsed Data
                </button>
              </div>
            </DashboardCard>
          </div>
        </div>
      ) : (
        /* Match Analysis view mode */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          <div className="lg:col-span-2 space-y-6">
            {/* ATS Score card */}
            <DashboardCard glowColor="purple" className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative h-24 w-24 flex items-center justify-center shrink-0">
                <svg className="h-full w-full -rotate-90">
                  <circle cx="48" cy="48" r="40" className="stroke-slate-50 fill-transparent stroke-[6px]" />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    className="fill-transparent stroke-[6px] stroke-purple-600 transition-all duration-700"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 - (atsScore / 100) * (2 * Math.PI * 40)}
                  />
                </svg>
                <span className="absolute text-xl font-black text-slate-900 font-mono">{atsScore}%</span>
              </div>
              <div className="space-y-1.5 text-center md:text-left">
                <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 font-black text-[9px] uppercase tracking-wider font-sans">
                  ATS Score Analysis
                </span>
                <h4 className="font-display font-black text-slate-900 text-sm">Overall Profile ATS Score</h4>
                <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                  Calculated based on skill match rates for {selectedJobRole}, education completeness, and professional work formatting.
                </p>
              </div>
            </DashboardCard>

            {/* Strengths and Improvements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard glowColor="blue" className="space-y-4">
                <h4 className="font-display font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Resume Strengths
                </h4>
                <ul className="space-y-2 text-[10.5px] text-slate-655 font-medium leading-relaxed">
                  {strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                  {strengths.length === 0 && <li className="text-slate-400 italic">Calculating matching highlights...</li>}
                </ul>
              </DashboardCard>

              <DashboardCard glowColor="orange" className="space-y-4">
                <h4 className="font-display font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-orange-500" /> Improvement Areas
                </h4>
                <ul className="space-y-2 text-[10.5px] text-slate-655 font-medium leading-relaxed">
                  {improvements.map((imp, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-orange-500 font-bold">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                  {improvements.length === 0 && <li className="text-slate-400 italic">Calculating improvement areas...</li>}
                </ul>
              </DashboardCard>
            </div>
          </div>

          {/* Job Target selector */}
          <div className="space-y-6">
            <DashboardCard glowColor="indigo" className="space-y-4">
              <div>
                <h4 className="font-display font-black text-slate-800 text-[11px] uppercase tracking-wider">Target Job Role</h4>
                <p className="text-[9.5px] text-slate-400 mt-0.5">Select a role to analyze ATS compatibility</p>
              </div>
              <select
                value={selectedJobRole}
                onChange={(e) => setSelectedJobRole(e.target.value)}
                className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-slate-800 focus:bg-white"
              >
                {Object.keys(ROLE_SKILLS_MAP).map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <div className="pt-2 border-t border-slate-50 space-y-3">
                <h5 className="font-black text-slate-400 text-[9px] uppercase tracking-wider">Matched Skills</h5>
                <div className="flex flex-wrap gap-1">
                  {matchedSkills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[9px] uppercase tracking-wider">{skill}</span>
                  ))}
                  {matchedSkills.length === 0 && <span className="text-slate-400 italic text-[9.5px]">No match.</span>}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-50 space-y-3">
                <h5 className="font-black text-slate-400 text-[9px] uppercase tracking-wider">Missing Skills</h5>
                <div className="flex flex-wrap gap-1">
                  {missingSkills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-600 font-black text-[9px] uppercase tracking-wider">{skill}</span>
                  ))}
                  {missingSkills.length === 0 && <span className="text-slate-400 italic text-[9.5px]">No missing skills.</span>}
                </div>
              </div>
            </DashboardCard>
          </div>
        </div>
      )}
    </div>
  );
}
