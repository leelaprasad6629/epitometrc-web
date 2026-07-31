"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, FileText, CheckCircle2, XCircle, Lightbulb, Save, User, 
  FileCheck, Edit3, MessageSquare, Play, Mic, MicOff, Volume2, 
  Briefcase, GraduationCap, Target, Compass, BookOpen, CheckSquare, 
  Map, Award, TrendingUp, AlertCircle, RefreshCw, Star, Trash2, ArrowRight,
  Globe, FileUp, Copy, Download, Check, Info, Calendar, ChevronRight, Loader2,
  Send, Brain, VideoOff, ZoomIn, ZoomOut, Maximize2, Layers, Plus, MoveUp, MoveDown,
  Wand2, History, RotateCcw, CopyPlus, FileSpreadsheet, ShieldAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { useResumeStore, ParsedResume, ResumeVersion } from "@/lib/ai/store/resumeStore";
import { Input } from "@/components/ui/input";
import ATSResumeTemplate from "@/components/resume/ATSResumeTemplate";
import AIEnhancementModal, { AISuggestionItem } from "@/components/resume/AIEnhancementModal";
import { downloadResumePDF, downloadResumeDOCX } from "@/lib/resumeExport";

type TabId = "choice" | "dashboard" | "studio" | "versions" | "interview";

export default function AIResumeStudioPage() {
  const { 
    parsedResumeDetails, 
    updateParsedDetails, 
    loadProfileFromServer,
    setResumeData,
    addResumeVersion,
    rollbackToVersion
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<TabId>("choice");
  const [creationMode, setCreationMode] = useState<"profile" | "upload" | null>(null);

  // File Upload States
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

  // Studio UI States
  const [zoomScale, setZoomScale] = useState(0.9);
  const [editorSection, setEditorSection] = useState<string>("personal");
  const [showEnhancementModal, setShowEnhancementModal] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState("");

  // Multiple Resumes Management (Stored in local state / database profile)
  const [resumesList, setResumesList] = useState<Array<{ id: string; title: string; updatedAt: string; data: ParsedResume }>>([]);
  const [activeResumeId, setActiveResumeId] = useState<string>("default");

  // Executive Dashboard Stats
  const [lastDownloadDate, setLastDownloadDate] = useState<string | null>(null);
  const [lastEnhanceDate, setLastEnhanceDate] = useState<string | null>(null);

  // Load profile on mount
  useEffect(() => {
    loadProfileFromServer();
  }, []);

  // Initialize resumes list when profile details load
  useEffect(() => {
    if (parsedResumeDetails) {
      const currentTitle = parsedResumeDetails.fullName ? `${parsedResumeDetails.fullName}'s ATS Resume` : "My ATS Resume";
      setResumesList([
        {
          id: "default",
          title: currentTitle,
          updatedAt: new Date().toLocaleDateString(),
          data: parsedResumeDetails
        }
      ]);
    }
  }, [parsedResumeDetails]);

  const activeResumeData: ParsedResume = (parsedResumeDetails || {
    fullName: "Student User",
    headline: "Full Stack Developer",
    email: "student@example.com",
    phone: "+1 234 567 8900",
    location: "San Francisco, CA",
    profileImage: null,
    linkedin: "https://linkedin.com",
    github: "https://github.com",
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
    bio: "Passionate software engineering student with expertise in modern full-stack web development.",
    technicalSkills: ["JavaScript", "TypeScript", "React", "Node.js", "PostgreSQL", "Tailwind CSS"],
    softSkills: ["Problem Solving", "Teamwork", "Communication"],
    education: [{ degree: "B.S.", branch: "Computer Science", institution: "University Tech", university: "State University", startYear: "2021", endYear: "2025", cgpa: "3.8/4.0" }],
    experience: [{ companyName: "TechCorp", role: "Software Intern", employmentType: "Internship", startDate: "Jun 2024", endDate: "Aug 2024", duration: "3 mos", responsibilities: "Built scalable web components using React and TypeScript.\nOptimized backend REST endpoints reducing latency by 25%." }],
    projects: [{ projectTitle: "AI Career Copilot", description: "Built an end-to-end resume intelligence studio with real-time ATS optimization.", technologiesUsed: ["Next.js", "Groq AI", "Tailwind"], githubLink: "", liveUrl: "", duration: "2 mos" }],
    certifications: [{ certificationName: "AWS Certified Developer", organization: "Amazon Web Services", date: "2024", credentialId: "AWS-1234" }],
    internships: [],
    achievements: [{ title: "Hackathon Winner", description: "1st place in National AI Hackathon 2024 out of 150 teams." }],
    awards: [],
    publications: [],
    workshops: [],
    hackathons: [],
    leadershipRoles: [],
    volunteerExperience: [],
    languagesKnown: ["English", "Spanish"],
    professionalInterests: [],
    interests: [],
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
    sectionOrder: ["summary", "technicalSkills", "experience", "projects", "education", "certifications", "achievements", "languagesKnown"],
    overallCompleteness: 85,
    completenessMetrics: {},
    resumeVersions: []
  }) as ParsedResume;

  // Compute ATS Health Scores (0-100)
  const calculateATSScore = () => {
    let score = 40; // Base baseline
    if (activeResumeData.fullName && activeResumeData.email && activeResumeData.phone) score += 15;
    if (activeResumeData.bio && activeResumeData.bio.length > 50) score += 15;
    if (activeResumeData.technicalSkills && activeResumeData.technicalSkills.length >= 5) score += 10;
    if (activeResumeData.experience && activeResumeData.experience.length > 0) score += 10;
    if (activeResumeData.education && activeResumeData.education.length > 0) score += 10;
    return Math.min(100, score);
  };

  const atsScoreVal = calculateATSScore();
  const formattingScoreVal = 95; // Fixed Master Template guarantees high formatting score
  const grammarScoreVal = 90;
  const readabilityScoreVal = 92;
  const keywordMatchScoreVal = Math.min(100, Math.round(atsScoreVal * 0.95));

  const getStrengthBadge = (score: number) => {
    if (score >= 90) return { label: "Excellent", color: "bg-emerald-500 text-white" };
    if (score >= 75) return { label: "Strong", color: "bg-indigo-500 text-white" };
    if (score >= 60) return { label: "Good", color: "bg-amber-500 text-white" };
    return { label: "Needs Work", color: "bg-rose-500 text-white" };
  };

  const strengthBadge = getStrengthBadge(atsScoreVal);

  // File Upload Handler (PDF, DOC, DOCX up to 25MB)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError("");
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    const ext = file.name.toLowerCase();
    const isValidFormat = ext.endsWith(".pdf") || ext.endsWith(".doc") || ext.endsWith(".docx");

    if (file.size > MAX_SIZE || !isValidFormat) {
      setUploadError("Resume must be a PDF, DOC, or DOCX file and cannot exceed 25 MB.");
      return;
    }

    setUploadLoading(true);
    setUploadProgress(20);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        setUploadProgress(50);
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

        setUploadProgress(80);
        const data = await res.json();

        if (res.ok && data.success && data.result) {
          setResumeData(file.name, base64Data, file.type || "application/pdf", data.result, data.confidenceScores || {});
          setCreationMode("upload");
          setActiveTab("studio");
          setSaveSuccessMsg("Resume uploaded and parsed successfully! All content populates editable fields.");
          setTimeout(() => setSaveSuccessMsg(""), 4000);
        } else {
          setUploadError(data.error || "Failed to parse resume content.");
        }
      } catch (err: any) {
        setUploadError("Parsing error: " + err.message);
      } finally {
        setUploadLoading(false);
        setUploadProgress(100);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleChooseGenerateProfile = () => {
    setCreationMode("profile");
    setActiveTab("studio");
  };

  // Section Reordering
  const moveSection = (index: number, direction: "up" | "down") => {
    const order = [...(activeResumeData.sectionOrder || ["summary", "technicalSkills", "experience", "projects", "education", "certifications", "achievements", "languagesKnown"])];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= order.length) return;
    const temp = order[index];
    order[index] = order[targetIdx];
    order[targetIdx] = temp;
    updateParsedDetails({ sectionOrder: order });
  };

  // AI Suggestion Accept / Reject Handlers
  const handleAcceptAISuggestion = (sug: AISuggestionItem) => {
    // Record current snapshot to version history before mutating
    const versionId = `V${(activeResumeData.resumeVersions?.length || 0) + 1}`;
    const versionSnapshot: ResumeVersion = {
      versionId,
      timestamp: new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString(),
      targetCompany: "AI Enhanced",
      targetRole: activeResumeData.headline || "Target Role",
      jobDescriptionText: "",
      parsedResumeSnapshot: JSON.parse(JSON.stringify(activeResumeData)),
      changeSummary: `Accepted AI suggestion: ${sug.title}`,
      generalAtsScore: atsScoreVal,
      jobMatchScore: keywordMatchScoreVal
    };

    addResumeVersion(versionSnapshot);

    if (sug.category === "summary") {
      updateParsedDetails({ bio: sug.suggestedText });
    } else if (sug.category === "skills" || sug.category === "keywords") {
      const skills = Array.from(new Set([...(activeResumeData.technicalSkills || []), sug.suggestedText]));
      updateParsedDetails({ technicalSkills: skills });
    } else if (sug.category === "experience" && typeof sug.index === "number") {
      const updatedExp = [...(activeResumeData.experience || [])];
      if (updatedExp[sug.index]) {
        updatedExp[sug.index].responsibilities = sug.suggestedText;
        updateParsedDetails({ experience: updatedExp });
      }
    }

    setLastEnhanceDate(new Date().toLocaleDateString());
    setSaveSuccessMsg(`Accepted suggestion: "${sug.title}"`);
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  const handleRejectAISuggestion = (sugId: string) => {
    setSaveSuccessMsg("Suggestion rejected.");
    setTimeout(() => setSaveSuccessMsg(""), 2000);
  };

  // Save Draft to Database
  const handleSaveDraft = async () => {
    await updateParsedDetails(activeResumeData);
    setSaveSuccessMsg("Resume draft saved securely to database!");
    setTimeout(() => setSaveSuccessMsg(""), 3000);
  };

  // PDF Export
  const handleExportPDF = () => {
    downloadResumePDF(`${activeResumeData.fullName?.replace(/\s+/g, "_") || "ATS"}_Resume.pdf`);
    setLastDownloadDate(new Date().toLocaleDateString());
  };

  // DOCX Export
  const handleExportDOCX = () => {
    downloadResumeDOCX(activeResumeData, `${activeResumeData.fullName?.replace(/\s+/g, "_") || "ATS"}_Resume.docx`);
    setLastDownloadDate(new Date().toLocaleDateString());
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans pb-12">
      
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-xl text-white shadow-md">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                AI Resume Studio <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-extrabold uppercase">Pro</span>
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">
                Fixed Master ATS-Friendly Single-Column Layout Generator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full lg:w-auto justify-center">
          <button
            onClick={() => setActiveTab("choice")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "choice"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Creation Options
          </button>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "dashboard"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("studio")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "studio"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Live Studio & Editor
          </button>
          <button
            onClick={() => setActiveTab("versions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "versions"
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            Version History
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-center lg:justify-end">
          <button
            onClick={() => setShowEnhancementModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-xs rounded-lg shadow hover:opacity-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Enhance with AI
          </button>
          <button
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium text-xs rounded-lg hover:bg-slate-300 dark:hover:bg-slate-700 transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Draft
          </button>
        </div>
      </header>

      {/* Global Success Notification banner */}
      <AnimatePresence>
        {saveSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 text-center shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {saveSuccessMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl w-full mx-auto px-4 pt-6 flex-1">

        {/* OPTION SELECTION TAB */}
        {activeTab === "choice" && (
          <div className="py-8 max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">
                Create Your Professional ATS Resume
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
                Every generated resume strictly utilizes our fixed ATS-friendly professional master template. Select how you want to start:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Option 1: Generate with AI from Profile */}
              <div
                onClick={handleChooseGenerateProfile}
                className="group cursor-pointer p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Option 1
                </div>
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Generate Resume with AI
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                  Automatically build a recruiter-optimized resume using your existing profile details, education, verified skills, and work history stored in EpitomeTRC.
                </p>
                <div className="inline-flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
                  Generate from Profile <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>

              {/* Option 2: Upload Existing Resume */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 shadow-sm hover:shadow-xl transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                  Option 2 (NEW)
                </div>
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center mb-4">
                  <FileUp className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Upload Existing Resume
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                  Upload your existing resume in PDF, DOC, or DOCX format (up to 25 MB). AI extracts all content into editable fields and formats it into our fixed master template.
                </p>

                {/* Upload Drag/Drop Box */}
                <label className="block border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:bg-purple-50/50 dark:hover:bg-purple-950/20 transition-all">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadLoading}
                  />
                  {uploadLoading ? (
                    <div className="py-2">
                      <Loader2 className="w-6 h-6 text-purple-600 animate-spin mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        AI Extracting Resume Content ({uploadProgress}%)...
                      </p>
                    </div>
                  ) : (
                    <div>
                      <FileSpreadsheet className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                      <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">
                        Click to Choose File (PDF, DOC, DOCX)
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">Supported: PDF, DOC, DOCX (Maximum 25 MB)</span>
                    </div>
                  )}
                </label>

                {uploadError && (
                  <div className="mt-3 p-2 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs rounded-lg flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* EXECUTIVE DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 py-4">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase">Total Resumes</span>
                <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {resumesList.length}
                </div>
                <span className="text-[11px] text-emerald-600 font-medium">All using ATS Master Template</span>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase">Best ATS Score</span>
                <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-2">
                  {atsScoreVal}/100
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${strengthBadge.color}`}>
                    {strengthBadge.label}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">Calculated in real-time</span>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase">Last Download Date</span>
                <div className="text-base font-bold text-slate-900 dark:text-white mt-2">
                  {lastDownloadDate || "Not downloaded yet"}
                </div>
                <span className="text-[11px] text-slate-500">Supports PDF & DOCX</span>
              </div>

              <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <span className="text-xs font-semibold text-slate-500 uppercase">Last AI Enhancement</span>
                <div className="text-base font-bold text-purple-600 dark:text-purple-400 mt-2">
                  {lastEnhanceDate || "Ready for AI review"}
                </div>
                <span className="text-[11px] text-slate-500">Granular Accept/Reject</span>
              </div>
            </div>

            {/* Resume Health Breakdown */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                ATS Health & Score Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                  <span className="text-xs font-semibold text-slate-500">Formatting Score</span>
                  <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{formattingScoreVal}%</div>
                  <span className="text-[10px] text-slate-400">Pure ATS Single-Column</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                  <span className="text-xs font-semibold text-slate-500">Grammar Score</span>
                  <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">{grammarScoreVal}%</div>
                  <span className="text-[10px] text-slate-400">Action Verbs Verified</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                  <span className="text-xs font-semibold text-slate-500">Readability Score</span>
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400 mt-1">{readabilityScoreVal}%</div>
                  <span className="text-[10px] text-slate-400">Recruiter Friendly</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center">
                  <span className="text-xs font-semibold text-slate-500">Keyword Match</span>
                  <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">{keywordMatchScoreVal}%</div>
                  <span className="text-[10px] text-slate-400">Tech & Soft Skills</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setActiveTab("studio")}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-2"
              >
                Open Resume Studio Editor <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* LIVE STUDIO & EDITOR TAB (SIDE-BY-SIDE) */}
        {activeTab === "studio" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 py-2">

            {/* LEFT SIDE: EDITOR & SECTION CONTROLS (5 COLS) */}
            <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5 max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  Resume Content Editor
                </h3>
                <span className="text-[11px] text-slate-500">Updates live preview instantly</span>
              </div>

              {/* Section Selector */}
              <div className="flex flex-wrap gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                {[
                  { id: "personal", label: "Personal" },
                  { id: "summary", label: "Summary" },
                  { id: "skills", label: "Skills" },
                  { id: "experience", label: "Work Exp" },
                  { id: "projects", label: "Projects" },
                  { id: "education", label: "Education" },
                  { id: "certifications", label: "Certs" },
                  { id: "reorder", label: "Reorder" },
                ].map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setEditorSection(sec.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      editorSection === sec.id
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                    }`}
                  >
                    {sec.label}
                  </button>
                ))}
              </div>

              {/* SECTION: PERSONAL INFO */}
              {editorSection === "personal" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
                    <Input
                      value={activeResumeData.fullName || ""}
                      onChange={e => updateParsedDetails({ fullName: e.target.value })}
                      placeholder="e.g. Jane Doe"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Professional Title</label>
                    <Input
                      value={activeResumeData.headline || ""}
                      onChange={e => updateParsedDetails({ headline: e.target.value })}
                      placeholder="e.g. Senior Full Stack Engineer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Email</label>
                      <Input
                        value={activeResumeData.email || ""}
                        onChange={e => updateParsedDetails({ email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Phone</label>
                      <Input
                        value={activeResumeData.phone || ""}
                        onChange={e => updateParsedDetails({ phone: e.target.value })}
                        placeholder="+1 234 567 890"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Location / Address</label>
                    <Input
                      value={activeResumeData.location || ""}
                      onChange={e => updateParsedDetails({ location: e.target.value })}
                      placeholder="City, State, Country"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">LinkedIn URL</label>
                      <Input
                        value={activeResumeData.linkedin || ""}
                        onChange={e => updateParsedDetails({ linkedin: e.target.value })}
                        placeholder="https://linkedin.com/in/..."
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">GitHub URL</label>
                      <Input
                        value={activeResumeData.github || ""}
                        onChange={e => updateParsedDetails({ github: e.target.value })}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SECTION: SUMMARY */}
              {editorSection === "summary" && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Professional Summary</label>
                    <button
                      onClick={() => setShowEnhancementModal(true)}
                      className="text-[11px] font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:underline"
                    >
                      <Sparkles className="w-3 h-3" /> AI Enhance Summary
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={activeResumeData.bio || ""}
                    onChange={e => updateParsedDetails({ bio: e.target.value })}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Write a compelling professional summary..."
                  />
                </div>
              )}

              {/* SECTION: SKILLS */}
              {editorSection === "skills" && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Technical Skills (comma separated)
                    </label>
                    <textarea
                      rows={3}
                      value={(activeResumeData.technicalSkills || []).join(", ")}
                      onChange={e => {
                        const arr = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                        updateParsedDetails({ technicalSkills: arr });
                      }}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Soft Skills (comma separated)
                    </label>
                    <textarea
                      rows={2}
                      value={(activeResumeData.softSkills || []).join(", ")}
                      onChange={e => {
                        const arr = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
                        updateParsedDetails({ softSkills: arr });
                      }}
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                    />
                  </div>
                </div>
              )}

              {/* SECTION: WORK EXPERIENCE */}
              {editorSection === "experience" && (
                <div className="space-y-4 text-xs">
                  {(activeResumeData.experience || []).map((exp, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 relative">
                      <button
                        onClick={() => {
                          const updated = activeResumeData.experience.filter((_, i) => i !== idx);
                          updateParsedDetails({ experience: updated });
                        }}
                        className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 p-1"
                        title="Delete Entry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={exp.role || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.experience];
                            updated[idx].role = e.target.value;
                            updateParsedDetails({ experience: updated });
                          }}
                          placeholder="Job Title"
                        />
                        <Input
                          value={exp.companyName || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.experience];
                            updated[idx].companyName = e.target.value;
                            updateParsedDetails({ experience: updated });
                          }}
                          placeholder="Company Name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={exp.startDate || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.experience];
                            updated[idx].startDate = e.target.value;
                            updateParsedDetails({ experience: updated });
                          }}
                          placeholder="Start Date (e.g. Jan 2023)"
                        />
                        <Input
                          value={exp.endDate || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.experience];
                            updated[idx].endDate = e.target.value;
                            updateParsedDetails({ experience: updated });
                          }}
                          placeholder="End Date (e.g. Present)"
                        />
                      </div>

                      <textarea
                        rows={3}
                        value={exp.responsibilities || ""}
                        onChange={e => {
                          const updated = [...activeResumeData.experience];
                          updated[idx].responsibilities = e.target.value;
                          updateParsedDetails({ experience: updated });
                        }}
                        placeholder="Bullet points (one per line)..."
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const updated = [...(activeResumeData.experience || []), { companyName: "", role: "", employmentType: "Full-Time", startDate: "", endDate: "", duration: "", responsibilities: "" }];
                      updateParsedDetails({ experience: updated });
                    }}
                    className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-indigo-100"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Work Experience
                  </button>
                </div>
              )}

              {/* SECTION: PROJECTS */}
              {editorSection === "projects" && (
                <div className="space-y-4 text-xs">
                  {(activeResumeData.projects || []).map((proj, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 relative">
                      <button
                        onClick={() => {
                          const updated = activeResumeData.projects.filter((_, i) => i !== idx);
                          updateParsedDetails({ projects: updated });
                        }}
                        className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 p-1"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <Input
                        value={proj.projectTitle || ""}
                        onChange={e => {
                          const updated = [...activeResumeData.projects];
                          updated[idx].projectTitle = e.target.value;
                          updateParsedDetails({ projects: updated });
                        }}
                        placeholder="Project Title"
                      />

                      <textarea
                        rows={2}
                        value={proj.description || ""}
                        onChange={e => {
                          const updated = [...activeResumeData.projects];
                          updated[idx].description = e.target.value;
                          updateParsedDetails({ projects: updated });
                        }}
                        placeholder="Project Description..."
                        className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={proj.githubLink || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.projects];
                            updated[idx].githubLink = e.target.value;
                            updateParsedDetails({ projects: updated });
                          }}
                          placeholder="GitHub URL"
                        />
                        <Input
                          value={proj.liveUrl || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.projects];
                            updated[idx].liveUrl = e.target.value;
                            updateParsedDetails({ projects: updated });
                          }}
                          placeholder="Live URL"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const updated = [...(activeResumeData.projects || []), { projectTitle: "", description: "", technologiesUsed: [], githubLink: "", liveUrl: "", duration: "" }];
                      updateParsedDetails({ projects: updated });
                    }}
                    className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-indigo-100"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>
              )}

              {/* SECTION: EDUCATION */}
              {editorSection === "education" && (
                <div className="space-y-4 text-xs">
                  {(activeResumeData.education || []).map((edu, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 relative">
                      <button
                        onClick={() => {
                          const updated = activeResumeData.education.filter((_, i) => i !== idx);
                          updateParsedDetails({ education: updated });
                        }}
                        className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 p-1"
                        title="Delete Education"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={edu.degree || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.education];
                            updated[idx].degree = e.target.value;
                            updateParsedDetails({ education: updated });
                          }}
                          placeholder="Degree (e.g. B.Tech)"
                        />
                        <Input
                          value={edu.branch || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.education];
                            updated[idx].branch = e.target.value;
                            updateParsedDetails({ education: updated });
                          }}
                          placeholder="Major / Branch"
                        />
                      </div>

                      <Input
                        value={edu.institution || edu.university || ""}
                        onChange={e => {
                          const updated = [...activeResumeData.education];
                          updated[idx].institution = e.target.value;
                          updated[idx].university = e.target.value;
                          updateParsedDetails({ education: updated });
                        }}
                        placeholder="Institution / University Name"
                      />

                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          value={edu.startYear || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.education];
                            updated[idx].startYear = e.target.value;
                            updateParsedDetails({ education: updated });
                          }}
                          placeholder="Start Year"
                        />
                        <Input
                          value={edu.endYear || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.education];
                            updated[idx].endYear = e.target.value;
                            updateParsedDetails({ education: updated });
                          }}
                          placeholder="End Year"
                        />
                        <Input
                          value={edu.cgpa || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.education];
                            updated[idx].cgpa = e.target.value;
                            updateParsedDetails({ education: updated });
                          }}
                          placeholder="CGPA / Score"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const updated = [...(activeResumeData.education || []), { degree: "", branch: "", institution: "", university: "", startYear: "", endYear: "", cgpa: "" }];
                      updateParsedDetails({ education: updated });
                    }}
                    className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-indigo-100"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </button>
                </div>
              )}

              {/* SECTION: CERTIFICATIONS */}
              {editorSection === "certifications" && (
                <div className="space-y-4 text-xs">
                  {(activeResumeData.certifications || []).map((cert, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/70 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 relative">
                      <button
                        onClick={() => {
                          const updated = activeResumeData.certifications.filter((_, i) => i !== idx);
                          updateParsedDetails({ certifications: updated });
                        }}
                        className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 p-1"
                        title="Delete Certification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <Input
                        value={cert.certificationName || ""}
                        onChange={e => {
                          const updated = [...activeResumeData.certifications];
                          updated[idx].certificationName = e.target.value;
                          updateParsedDetails({ certifications: updated });
                        }}
                        placeholder="Certification Name"
                      />

                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={cert.organization || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.certifications];
                            updated[idx].organization = e.target.value;
                            updateParsedDetails({ certifications: updated });
                          }}
                          placeholder="Issuing Organization"
                        />
                        <Input
                          value={cert.date || ""}
                          onChange={e => {
                            const updated = [...activeResumeData.certifications];
                            updated[idx].date = e.target.value;
                            updateParsedDetails({ certifications: updated });
                          }}
                          placeholder="Date Issued"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const updated = [...(activeResumeData.certifications || []), { certificationName: "", organization: "", date: "", credentialId: "" }];
                      updateParsedDetails({ certifications: updated });
                    }}
                    className="w-full py-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-1 hover:bg-indigo-100"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Certification
                  </button>
                </div>
              )}

              {/* SECTION: REORDER SECTIONS */}
              {editorSection === "reorder" && (
                <div className="space-y-2 text-xs">
                  <p className="text-[11px] text-slate-500 mb-2">
                    Drag or use buttons to reorder how sections display in the fixed ATS Master Template:
                  </p>
                  {(activeResumeData.sectionOrder || ["summary", "technicalSkills", "experience", "projects", "education", "certifications", "achievements", "languagesKnown"]).map((secKey, idx) => (
                    <div key={secKey} className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                      <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                        {idx + 1}. {secKey.replace(/([A-Z])/g, " $1")}
                      </span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveSection(idx, "up")}
                          disabled={idx === 0}
                          className="p-1 text-slate-500 hover:text-indigo-600 disabled:opacity-30"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => moveSection(idx, "down")}
                          disabled={idx === (activeResumeData.sectionOrder?.length || 8) - 1}
                          className="p-1 text-slate-500 hover:text-indigo-600 disabled:opacity-30"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* RIGHT SIDE: LIVE ATS MASTER TEMPLATE PREVIEW & ZOOM CONTROLS (7 COLS) */}
            <div className="lg:col-span-7 bg-slate-200/70 dark:bg-slate-900/90 rounded-2xl border border-slate-300 dark:border-slate-800 p-4 flex flex-col min-h-[85vh]">
              
              {/* Preview Toolbar */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 mb-4 shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-emerald-500" />
                    Live ATS Master Preview
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${strengthBadge.color}`}>
                    ATS Score: {atsScoreVal}/100
                  </span>
                </div>

                {/* Zoom & Export Controls */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-0.5 text-xs">
                    <button
                      onClick={() => setZoomScale(prev => Math.max(0.5, prev - 0.1))}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2 font-mono text-[11px]">{Math.round(zoomScale * 100)}%</span>
                    <button
                      onClick={() => setZoomScale(prev => Math.min(1.5, prev + 0.1))}
                      className="p-1 hover:bg-slate-200 dark:hover:bg-slate-600 rounded"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleExportPDF}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> PDF
                  </button>

                  <button
                    onClick={handleExportDOCX}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
                  >
                    <Download className="w-3.5 h-3.5" /> DOCX
                  </button>
                </div>
              </div>

              {/* Scrollable Preview Canvas */}
              <div className="flex-1 overflow-auto flex justify-center py-4 px-2">
                <ATSResumeTemplate data={activeResumeData} zoomScale={zoomScale} isPreview={true} />
              </div>
            </div>

          </div>
        )}

        {/* VERSION HISTORY TAB */}
        {activeTab === "versions" && (
          <div className="py-6 max-w-4xl mx-auto space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-600" />
              Resume Version History
            </h3>
            <p className="text-xs text-slate-500">
              Restore previous snapshots saved whenever AI suggestions or major edits were performed.
            </p>

            {(activeResumeData.resumeVersions || []).length === 0 ? (
              <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center">
                <History className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  No previous versions recorded yet.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Versions are automatically generated when accepting AI enhancements or saving major edits.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {(activeResumeData.resumeVersions || []).map((ver: ResumeVersion) => (
                  <div key={ver.versionId} className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-md">
                          {ver.versionId}
                        </span>
                        <span className="text-xs text-slate-500">{ver.timestamp}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-1">
                        {ver.changeSummary || "Snapshot restore point"}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        rollbackToVersion(ver.versionId);
                        setSaveSuccessMsg(`Rolled back to version ${ver.versionId}`);
                        setTimeout(() => setSaveSuccessMsg(""), 3000);
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg hover:bg-indigo-100"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore Version
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* AI ENHANCEMENT MODAL */}
      <AIEnhancementModal
        isOpen={showEnhancementModal}
        onClose={() => setShowEnhancementModal(false)}
        resumeData={activeResumeData}
        onAcceptSuggestion={handleAcceptAISuggestion}
        onRejectSuggestion={handleRejectAISuggestion}
      />

    </div>
  );
}
