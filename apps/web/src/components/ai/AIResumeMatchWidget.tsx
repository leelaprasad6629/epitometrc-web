"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, CheckCircle2, AlertTriangle, Lightbulb, FileText, Upload, 
  User, Mail, Phone, BookOpen, Briefcase, Trash2, Globe, Award, 
  Check, Plus, Trash, Info, RefreshCw, X, FileUp, ClipboardList
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  useResumeStore, ParsedResume, EducationEntry, ExperienceEntry, 
  ProjectEntry, CertificationEntry, AchievementEntry 
} from "@/lib/ai/store/resumeStore";
import { Input } from "@/components/ui/input";
import DashboardCard from "@/components/dashboard/DashboardCard";

export default function AIResumeMatchWidget() {
  const {
    fileName,
    parsedResumeDetails,
    verified,
    confidenceScores,
    atsScore,
    matchScore,
    skillMatchPercentage,
    matchedSkills,
    missingSkills,
    missingKeywords,
    recommendations,
    strengths,
    improvements,
    certRecommendations,
    projectRecommendations,
    setResumeData,
    updateParsedDetails,
    setVerified,
    updateAnalysis,
    deleteResume,
    loadProfileFromServer
  } = useResumeStore();

  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState<"personal" | "education" | "experience" | "projects" | "skills" | "certs">("personal");
  
  // Platform Jobs List
  const [platformJobs, setPlatformJobs] = useState<any[]>([]);
  
  // Job Description Input States
  const [jdText, setJdText] = useState("");
  const [targetTitle, setTargetTitle] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jdMode, setJdMode] = useState<"paste" | "select" | "file">("paste");

  // Load profile and platform jobs on mount
  useEffect(() => {
    loadProfileFromServer();
    fetch("/api/jobs")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.jobs) {
          setPlatformJobs(data.jobs);
        }
      })
      .catch(err => console.error("Failed to load platform jobs:", err));
  }, [loadProfileFromServer]);

  // Handle platform job select
  const handleJobSelect = (jobId: string) => {
    setSelectedJobId(jobId);
    const job = platformJobs.find(j => j.id === jobId);
    if (job) {
      setTargetTitle(job.title);
      setJdText(`Job Title: ${job.title}\nDepartment: ${job.category}\nLocation: ${job.location}\n\nJob Description:\n${job.description}`);
    }
  };

  // Handle JD File Upload
  const handleJdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJdText(text);
      setTargetTitle(file.name.replace(/\.[^/.]+$/, ""));
    };
    reader.readAsText(file);
  };

  // Run Real-world ATS Match Analysis via LLM
  const runRealAtsAnalysis = async () => {
    if (!jdText.trim()) {
      setError("Please paste, select, or upload a target Job Description.");
      return;
    }
    if (!parsedResumeDetails) {
      setError("No verified profile data found. Please upload and verify your resume first.");
      return;
    }

    setAnalyzing(true);
    setError("");
    try {
      const res = await fetch("/api/ai/resume-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: JSON.stringify(parsedResumeDetails),
          jobDescription: jdText
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.result) {
        const r = data.result;
        updateAnalysis({
          atsScore: r.overallAtsScore || 0,
          matchScore: r.jobMatchPercentage || 0,
          skillMatchPercentage: r.skillMatchPercentage || 0,
          keywordMatchPercentage: r.keywordMatchPercentage || 0,
          experienceMatchPercentage: r.experienceMatchPercentage || 0,
          matchedSkills: r.matchedSkills || [],
          missingSkills: r.missingSkills || [],
          missingKeywords: r.missingKeywords || [],
          strengths: r.strengths || [],
          improvements: r.weaknesses || [],
          recommendations: r.suggestions || [],
          certRecommendations: r.certRecommendations || [],
          projectRecommendations: r.techRecommendations || []
        });
      } else {
        setError(data.error || "Failed to analyze target alignment.");
      }
    } catch (err: any) {
      setError("Failed to communicate with matching engine: " + err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  // Reset/Re-evaluate with new JD
  const handleResetAnalysis = () => {
    updateAnalysis({
      atsScore: 0,
      matchScore: 0,
      skillMatchPercentage: 0,
      keywordMatchPercentage: 0,
      experienceMatchPercentage: 0,
      matchedSkills: [],
      missingSkills: [],
      missingKeywords: [],
      strengths: [],
      improvements: [],
      recommendations: [],
      certRecommendations: [],
      projectRecommendations: []
    });
    setJdText("");
    setTargetTitle("");
    setSelectedJobId("");
  };

  // Handle original resume uploading
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

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

        if (!res.ok) {
          setError(`Parsing service unavailable (${res.status}).`);
          return;
        }

        const data = await res.json();
        if (data.success) {
          setResumeData(file.name, base64Data, file.type || "application/pdf", data.result, data.confidenceScores);
          setVerified(false);
          setActiveEditorTab("personal");
        } else {
          setError(data.error || "Parsing failed.");
        }
      } catch (err: any) {
        setError("Network error parsing resume: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAndVerify = () => {
    setVerified(true);
  };

  const handleReset = () => {
    deleteResume();
    setError("");
  };

  // Section Helpers
  const renderConfidenceBadge = (score: number) => {
    const s = score || 0;
    if (s >= 80) return <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[8.5px] font-bold border border-emerald-100">HIGH ({s}%)</span>;
    if (s >= 50) return <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-600 text-[8.5px] font-bold border border-amber-100">MED ({s}%)</span>;
    return <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-600 text-[8.5px] font-bold border border-rose-100">LOW ({s}%)</span>;
  };

  // 1. Initial State: No parsed resume uploaded yet
  if (!parsedResumeDetails) {
    return (
      <DashboardCard glowColor="blue" className="text-center p-8 space-y-6">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500 shadow-inner">
          <Upload className="h-6 w-6" />
        </div>
        <div className="space-y-1.5">
          <h4 className="font-display font-black text-slate-800 text-sm uppercase tracking-wider">AI Resume Intelligence Engine</h4>
          <p className="text-slate-400 text-[10.5px] font-sans leading-relaxed max-w-sm mx-auto">
            Upload your resume (PDF, Word, or ATS template) to build your dynamic profile instantly and run matching diagnostics.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-[10.5px] font-semibold">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center gap-2">
          <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-sm">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {loading ? "Analyzing resume contents..." : "Select Resume File"}
            <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleResumeUpload} className="hidden" disabled={loading} />
          </label>
          <span className="text-[9px] text-slate-400 font-medium">Supports PDF, DOCX up to 10MB</span>
        </div>
      </DashboardCard>
    );
  }

  // 2. Review State: Resume parsed but not verified/confirmed by student yet
  if (!verified) {
    return (
      <div className="space-y-6 text-left">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-display font-black text-slate-800 text-sm uppercase tracking-wider">Review & Edit Wizard</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Please review the extracted data before saving to profile.</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-[9px] font-bold">
            Parsed: {fileName}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-wrap gap-1.5 border-b border-slate-50 pb-2">
              {[
                { id: "personal", label: "Personal Info", icon: User },
                { id: "education", label: "Education", icon: BookOpen },
                { id: "experience", label: "Work History", icon: Briefcase },
                { id: "projects", label: "Projects", icon: ClipboardList },
                { id: "skills", label: "Skills Inventory", icon: Sparkles },
                { id: "certs", label: "Certificates", icon: Award }
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setActiveEditorTab(t.id as any)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10.5px] font-bold transition-all ${
                      activeEditorTab === t.id 
                        ? "bg-slate-900 text-white shadow-xs" 
                        : "bg-white border border-slate-150 text-slate-655 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                  </button>
                );
              })}
            </div>

            <DashboardCard glowColor="blue" className="p-5">
              {activeEditorTab === "personal" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-450 uppercase tracking-wider block">Full Name</span>
                      <Input type="text" value={parsedResumeDetails.fullName || ""} onChange={e => updateParsedDetails({ fullName: e.target.value })} className="h-8.5 text-xs font-semibold" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-450 uppercase tracking-wider block">Headline</span>
                      <Input type="text" value={parsedResumeDetails.headline || ""} onChange={e => updateParsedDetails({ headline: e.target.value })} className="h-8.5 text-xs" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-450 uppercase tracking-wider block">Email</span>
                      <Input type="email" value={parsedResumeDetails.email || ""} onChange={e => updateParsedDetails({ email: e.target.value })} className="h-8.5 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-450 uppercase tracking-wider block">Phone</span>
                      <Input type="text" value={parsedResumeDetails.phone || ""} onChange={e => updateParsedDetails({ phone: e.target.value })} className="h-8.5 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-450 uppercase tracking-wider block">Location</span>
                      <Input type="text" value={parsedResumeDetails.location || ""} onChange={e => updateParsedDetails({ location: e.target.value })} className="h-8.5 text-xs" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-slate-450 uppercase tracking-wider block">Career Profile Bio</span>
                    <textarea value={parsedResumeDetails.bio || ""} onChange={e => updateParsedDetails({ bio: e.target.value })} className="w-full rounded-2xl border border-slate-200 p-3 text-xs h-20 focus:outline-none focus:border-slate-800 bg-white" />
                  </div>
                </div>
              )}

              {activeEditorTab === "education" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <h5 className="font-bold text-slate-700 text-xs">Education History</h5>
                    <button
                      onClick={() => {
                        const current = [...(parsedResumeDetails.education || [])];
                        current.push({ degree: "", branch: "", institution: "", university: "", startYear: "", endYear: "", cgpa: "" });
                        updateParsedDetails({ education: current });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[10px]"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Degree
                    </button>
                  </div>
                  <div className="space-y-3.5">
                    {(parsedResumeDetails.education || []).map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/30 border border-slate-100 rounded-2xl relative space-y-3">
                        <button
                          onClick={() => {
                            const current = [...(parsedResumeDetails.education || [])];
                            updateParsedDetails({ education: current.filter((_, i) => i !== idx) });
                          }}
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Degree</span>
                            <Input type="text" value={item.degree} onChange={e => {
                              const current = [...(parsedResumeDetails.education || [])];
                              current[idx].degree = e.target.value;
                              updateParsedDetails({ education: current });
                            }} className="h-7 text-[10.5px]" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Branch/Stream</span>
                            <Input type="text" value={item.branch} onChange={e => {
                              const current = [...(parsedResumeDetails.education || [])];
                              current[idx].branch = e.target.value;
                              updateParsedDetails({ education: current });
                            }} className="h-7 text-[10.5px]" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Institution</span>
                            <Input type="text" value={item.institution} onChange={e => {
                              const current = [...(parsedResumeDetails.education || [])];
                              current[idx].institution = e.target.value;
                              updateParsedDetails({ education: current });
                            }} className="h-7 text-[10.5px]" />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <span className="text-[9.5px] font-bold text-slate-400">Start</span>
                              <Input type="text" value={item.startYear} onChange={e => {
                                const current = [...(parsedResumeDetails.education || [])];
                                current[idx].startYear = e.target.value;
                                updateParsedDetails({ education: current });
                              }} className="h-7 text-[10.5px]" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9.5px] font-bold text-slate-400">End</span>
                              <Input type="text" value={item.endYear} onChange={e => {
                                const current = [...(parsedResumeDetails.education || [])];
                                current[idx].endYear = e.target.value;
                                updateParsedDetails({ education: current });
                              }} className="h-7 text-[10.5px]" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9.5px] font-bold text-slate-400">CGPA</span>
                              <Input type="text" value={item.cgpa} onChange={e => {
                                const current = [...(parsedResumeDetails.education || [])];
                                current[idx].cgpa = e.target.value;
                                updateParsedDetails({ education: current });
                              }} className="h-7 text-[10.5px]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeEditorTab === "experience" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <h5 className="font-bold text-slate-700 text-xs">Work History</h5>
                    <button
                      onClick={() => {
                        const current = [...(parsedResumeDetails.experience || [])];
                        current.push({ companyName: "", role: "", employmentType: "Full-Time", startDate: "", endDate: "", duration: "", responsibilities: "" });
                        updateParsedDetails({ experience: current });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[10px]"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Experience
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(parsedResumeDetails.experience || []).map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/30 border border-slate-100 rounded-2xl relative space-y-3">
                        <button
                          onClick={() => {
                            const current = [...(parsedResumeDetails.experience || [])];
                            updateParsedDetails({ experience: current.filter((_, i) => i !== idx) });
                          }}
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Company</span>
                            <Input type="text" value={item.companyName} onChange={e => {
                              const current = [...(parsedResumeDetails.experience || [])];
                              current[idx].companyName = e.target.value;
                              updateParsedDetails({ experience: current });
                            }} className="h-7 text-[10.5px]" />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[9.5px] font-bold text-slate-400">Role</span>
                            <Input type="text" value={item.role} onChange={e => {
                              const current = [...(parsedResumeDetails.experience || [])];
                              current[idx].role = e.target.value;
                              updateParsedDetails({ experience: current });
                            }} className="h-7 text-[10.5px]" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <span className="text-[9.5px] font-bold text-slate-400">Start Date</span>
                              <Input type="text" value={item.startDate} onChange={e => {
                                const current = [...(parsedResumeDetails.experience || [])];
                                current[idx].startDate = e.target.value;
                                updateParsedDetails({ experience: current });
                              }} className="h-7 text-[10.5px]" />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[9.5px] font-bold text-slate-400">End Date</span>
                              <Input type="text" value={item.endDate} onChange={e => {
                                const current = [...(parsedResumeDetails.experience || [])];
                                current[idx].endDate = e.target.value;
                                updateParsedDetails({ experience: current });
                              }} className="h-7 text-[10.5px]" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400">Responsibilities</span>
                          <textarea value={item.responsibilities} onChange={e => {
                            const current = [...(parsedResumeDetails.experience || [])];
                            current[idx].responsibilities = e.target.value;
                            updateParsedDetails({ experience: current });
                          }} className="w-full rounded-xl border border-slate-200 p-2.5 text-[10.5px] h-16 bg-white focus:outline-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeEditorTab === "projects" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <h5 className="font-bold text-slate-700 text-xs">Technical Projects</h5>
                    <button
                      onClick={() => {
                        const current = [...(parsedResumeDetails.projects || [])];
                        current.push({ projectTitle: "", description: "", technologiesUsed: [], githubLink: "", liveUrl: "", duration: "" });
                        updateParsedDetails({ projects: current });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[10px]"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Project
                    </button>
                  </div>
                  <div className="space-y-4">
                    {(parsedResumeDetails.projects || []).map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50/30 border border-slate-100 rounded-2xl relative space-y-3">
                        <button
                          onClick={() => {
                            const current = [...(parsedResumeDetails.projects || [])];
                            updateParsedDetails({ projects: current.filter((_, i) => i !== idx) });
                          }}
                          className="absolute top-2.5 right-2.5 text-slate-400 hover:text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400">Project Title</span>
                          <Input type="text" value={item.projectTitle} onChange={e => {
                            const current = [...(parsedResumeDetails.projects || [])];
                            current[idx].projectTitle = e.target.value;
                            updateParsedDetails({ projects: current });
                          }} className="h-7.5 text-xs font-semibold" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400">Description</span>
                          <textarea value={item.description} onChange={e => {
                            const current = [...(parsedResumeDetails.projects || [])];
                            current[idx].description = e.target.value;
                            updateParsedDetails({ projects: current });
                          }} className="w-full rounded-xl border border-slate-200 p-2.5 text-[10.5px] h-16 bg-white focus:outline-none" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeEditorTab === "skills" && (
                <div className="space-y-4">
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Skills & Languages</span>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Technical Skills (Comma separated)</span>
                      <textarea
                        value={(parsedResumeDetails.verifiedSkills || []).join(", ")}
                        onChange={e => {
                          const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          updateParsedDetails({ verifiedSkills: list });
                        }}
                        className="w-full rounded-xl border border-slate-200 p-2.5 text-xs h-24 bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-500">Languages (Comma separated)</span>
                      <Input
                        type="text"
                        value={(parsedResumeDetails.languagesKnown || []).join(", ")}
                        onChange={e => {
                          const list = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                          updateParsedDetails({ languagesKnown: list });
                        }}
                        className="h-8.5 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeEditorTab === "certs" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-50">
                    <h5 className="font-bold text-slate-700 text-xs">Certifications</h5>
                    <button
                      onClick={() => {
                        const current = [...(parsedResumeDetails.certifications || [])];
                        current.push({ certificationName: "", organization: "", date: "", credentialId: "" });
                        updateParsedDetails({ certifications: current });
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-[10px]"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Cert
                    </button>
                  </div>
                  <div className="space-y-3.5">
                    {(parsedResumeDetails.certifications || []).map((item, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-50/30 border border-slate-100 rounded-2xl relative space-y-2">
                        <button
                          onClick={() => {
                            const current = [...(parsedResumeDetails.certifications || [])];
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
                              onChange={e => {
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
                              onChange={e => {
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
                  </div>
                </div>
              )}
            </DashboardCard>
          </div>

          <div className="space-y-6">
            <DashboardCard glowColor="indigo" className="text-left space-y-5">
              <div>
                <h4 className="font-display font-black text-slate-800 text-[11px] uppercase tracking-wider">Engine Telemetry</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Resume Parser structured validation metrics</p>
              </div>

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
      </div>
    );
  }

  // 3. Verified State: Resume is verified.
  // Display Target JD Selection interface OR dynamic scorecard matching.
  const hasResult = atsScore > 0;

  return (
    <div className="w-full text-left">
      <AnimatePresence mode="wait">
        {!hasResult ? (
          /* JD Input panel */
          <motion.div
            key="jd-input"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <DashboardCard glowColor="purple" className="p-6 space-y-5">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div className="space-y-1">
                  <h3 className="font-display font-black text-slate-800 text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-4.5 w-4.5 text-purple-500 animate-pulse" /> Real-World ATS Evaluation setup
                  </h3>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                    Configure a target Job Description to dynamically evaluate your resume's keyword, skill, and formatting compatibility metrics.
                  </p>
                </div>
                <button onClick={handleReset} className="text-[10px] font-bold text-red-500 hover:underline">Change Resume</button>
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10.5px] font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              {/* JD Entry Modes */}
              <div className="flex gap-1.5 border-b border-slate-50 pb-2">
                {[
                  { id: "paste", label: "Paste JD Text", icon: FileText },
                  { id: "select", label: "Select Job from Platform", icon: ClipboardList },
                  { id: "file", label: "Upload JD File", icon: FileUp }
                ].map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => {
                      setJdMode(mode.id as any);
                      setError("");
                    }}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                      jdMode === mode.id 
                        ? "bg-slate-900 text-white shadow-xs" 
                        : "bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-655"
                    }`}
                  >
                    <mode.icon className="h-3.5 w-3.5" />
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Mode Fields */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[9.5px] font-bold text-slate-450 uppercase block tracking-wider">Target Job Title</span>
                  <Input 
                    type="text" 
                    placeholder="e.g. Senior React Developer" 
                    value={targetTitle} 
                    onChange={e => setTargetTitle(e.target.value)} 
                    className="h-9 text-xs" 
                  />
                </div>

                {jdMode === "paste" && (
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-bold text-slate-450 uppercase block tracking-wider">Job Description Details</span>
                    <textarea
                      placeholder="Paste the target responsibilities, qualifications, and requirements of the role here..."
                      value={jdText}
                      onChange={e => setJdText(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 p-3 text-xs h-32 focus:outline-none focus:border-slate-800 bg-white font-medium"
                    />
                  </div>
                )}

                {jdMode === "select" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-450 uppercase block tracking-wider">Select Platform Job Opening</span>
                      <select
                        value={selectedJobId}
                        onChange={e => handleJobSelect(e.target.value)}
                        className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs font-semibold outline-none focus:border-slate-800 focus:bg-white"
                      >
                        <option value="">-- Choose Job Opening --</option>
                        {platformJobs.map(j => (
                          <option key={j.id} value={j.id}>{j.title} ({j.category})</option>
                        ))}
                      </select>
                    </div>
                    {jdText && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Extracted Details</span>
                        <pre className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] text-slate-500 font-mono overflow-auto max-h-24 whitespace-pre-wrap">{jdText}</pre>
                      </div>
                    )}
                  </div>
                )}

                {jdMode === "file" && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-bold text-slate-450 uppercase block tracking-wider">Upload Job Description File</span>
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                        <FileUp className="h-6 w-6 text-slate-400 mb-1" />
                        <span className="text-[10px] font-bold text-slate-600">Choose Text / Markdown / Word Document</span>
                        <input type="file" accept=".txt,.md,.docx,.doc" onChange={handleJdFileUpload} className="hidden" />
                      </label>
                    </div>
                    {jdText && (
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Extracted Details</span>
                        <pre className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[9px] text-slate-500 font-mono overflow-auto max-h-24 whitespace-pre-wrap">{jdText}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-50">
                <button
                  onClick={runRealAtsAnalysis}
                  disabled={analyzing}
                  className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 text-xs shadow-md shadow-purple-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  {analyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 animate-pulse" />}
                  {analyzing ? "Evaluating resume against Job Description..." : "Analyze ATS & Job Match Compatibility"}
                </button>
              </div>
            </DashboardCard>
          </motion.div>
        ) : (
          /* Match scorecard view */
          <motion.div
            key="scorecard"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* ATS Score Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* ATS radial score card */}
              <div className="lg:col-span-2">
                <DashboardCard glowColor="purple" className="flex flex-col md:flex-row items-center gap-6 p-6">
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
                  <div className="space-y-1.5 text-center md:text-left flex-1">
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-100 text-purple-600 font-black text-[9px] uppercase tracking-wider font-sans">
                      ATS Evaluation Scorecard
                    </span>
                    <h4 className="font-display font-black text-slate-900 text-sm">Target: {targetTitle || "Software Engineer"}</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                      This scorecard displays metrics evaluated by the AI Matching Engine comparing your resume data against the specific target Job Description.
                    </p>
                  </div>
                  <button
                    onClick={handleResetAnalysis}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 text-[10px] transition-colors"
                  >
                    <X className="h-3.5 w-3.5" /> Re-evaluate
                  </button>
                </DashboardCard>
              </div>

              {/* Dynamic ATS Metrics Breakdown */}
              <div>
                <DashboardCard glowColor="indigo" className="p-5 space-y-3.5">
                  <h5 className="font-black text-slate-800 text-[10px] uppercase tracking-wider">ATS Score Breakdown</h5>
                  <div className="space-y-2 text-[10px] font-sans">
                    {[
                      { label: "Job Match %", val: matchScore },
                      { label: "Keyword Match %", val: useResumeStore.getState().keywordMatchPercentage },
                      { label: "Skills Match %", val: skillMatchPercentage },
                      { label: "Experience Match %", val: useResumeStore.getState().experienceMatchPercentage }
                    ].map(metric => (
                      <div key={metric.label} className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
                        <span className="font-semibold text-slate-500">{metric.label}</span>
                        <span className="font-black text-slate-800 font-mono">{metric.val !== undefined && metric.val > 0 ? `${metric.val}%` : "Insufficient Data"}</span>
                      </div>
                    ))}
                  </div>
                </DashboardCard>
              </div>
            </div>

            {/* Keyword matching analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Matched vs Missing skills */}
              <DashboardCard glowColor="blue" className="space-y-4">
                <h4 className="font-display font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-blue-500" /> Target Skills Check
                </h4>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Matched Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {matchedSkills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-[9px] uppercase tracking-wider font-mono">{skill}</span>
                      ))}
                      {matchedSkills.length === 0 && <span className="text-slate-400 italic text-[9.5px]">None matched.</span>}
                    </div>
                  </div>
                  <div className="space-y-1.5 pt-2 border-t border-slate-50">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Missing Skills</span>
                    <div className="flex flex-wrap gap-1">
                      {missingSkills.map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-rose-50 border border-rose-100 text-rose-600 font-black text-[9px] uppercase tracking-wider font-mono">{skill}</span>
                      ))}
                      {missingSkills.length === 0 && <span className="text-slate-400 italic text-[9.5px]">No missing skills.</span>}
                    </div>
                  </div>
                </div>
              </DashboardCard>

              {/* Missing keywords list */}
              <DashboardCard glowColor="orange" className="space-y-4">
                <h4 className="font-display font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-orange-500 animate-pulse" /> Missing JD Keywords
                </h4>
                <p className="text-[9.5px] text-slate-450 leading-relaxed font-sans">
                  The following keywords were identified in the Job Description but are completely absent from your profile. Incorporate them in descriptions to score higher:
                </p>
                <div className="flex flex-wrap gap-1">
                  {missingKeywords.map(keyword => (
                    <span key={keyword} className="px-2 py-0.5 rounded bg-amber-50 border border-amber-100 text-amber-600 font-black text-[9px] uppercase tracking-wider font-mono">{keyword}</span>
                  ))}
                  {missingKeywords.length === 0 && <span className="text-slate-400 italic text-[9.5px]">No missing keywords detected.</span>}
                </div>
              </DashboardCard>
            </div>

            {/* Strengths & Rewrite suggestions */}
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
                  {strengths.length === 0 && <li className="text-slate-400 italic">No strengths calculated.</li>}
                </ul>
              </DashboardCard>

              <DashboardCard glowColor="purple" className="space-y-4">
                <h4 className="font-display font-black text-slate-900 text-xs flex items-center gap-1.5">
                  <Lightbulb className="h-4 w-4 text-purple-500 animate-pulse" /> Actionable Rewrite Suggestions
                </h4>
                <ul className="space-y-2 text-[10.5px] text-slate-655 font-medium leading-relaxed">
                  {recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                  {recommendations.length === 0 && <li className="text-slate-400 italic">No suggestions calculated.</li>}
                </ul>
              </DashboardCard>
            </div>

            {/* Recommendations */}
            {(certRecommendations.length > 0 || projectRecommendations.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {certRecommendations.length > 0 && (
                  <DashboardCard glowColor="indigo" className="space-y-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Recommended Certifications</span>
                    <div className="space-y-1.5">
                      {certRecommendations.map((cert, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-semibold text-slate-700">
                          {cert}
                        </div>
                      ))}
                    </div>
                  </DashboardCard>
                )}

                {projectRecommendations.length > 0 && (
                  <DashboardCard glowColor="orange" className="space-y-3">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Target Portfolio Projects to Build</span>
                    <div className="space-y-1.5">
                      {projectRecommendations.map((proj, idx) => (
                        <div key={idx} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-semibold text-slate-700">
                          {proj}
                        </div>
                      ))}
                    </div>
                  </DashboardCard>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
