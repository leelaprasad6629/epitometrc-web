"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, FileText, CheckCircle2, XCircle, Lightbulb, Save, User, 
  FileCheck, Edit3, MessageSquare, Play, Mic, MicOff, Volume2, 
  Briefcase, GraduationCap, Target, Compass, BookOpen, CheckSquare, 
  Map, Award, TrendingUp, AlertCircle, RefreshCw, Star, Trash2, ArrowRight,
  Globe, FileUp, Copy, Download, Check, Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import AudioVisualizer from "@/components/ai/AudioVisualizer";
import { useResumeStore } from "@/lib/ai/store/resumeStore";
import { Input } from "@/components/ui/input";
import DashboardCard from "@/components/dashboard/DashboardCard";

type TabId = "resume" | "interview" | "questions" | "career" | "jobs" | "learning";

export default function AIResumeCoachPage() {
  const { 
    fileName, 
    parsedResumeDetails, 
    selectedJobRole, 
    updateParsedDetails, 
    setSelectedJobRole,
    loadProfileFromServer 
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<TabId>("resume");

  // Load profile from cookies/store on mount
  useEffect(() => {
    loadProfileFromServer();
  }, [loadProfileFromServer]);

  // Shared state: fallback values if resume details are null
  const studentSkills = parsedResumeDetails?.technicalSkills || ["JavaScript", "React", "TypeScript", "HTML5", "CSS3"];
  const studentBio = parsedResumeDetails?.bio || "Dedicated Software Engineering Apprentice.";
  const studentExperience = parsedResumeDetails?.experience || [];
  const studentProjects = parsedResumeDetails?.projects || [];
  const studentEducation = parsedResumeDetails?.education || [];

  // ==========================================
  // ==========================================
  // TAB 1: RESUME OPTIMIZER STATES & HANDLERS
  // ==========================================
  const [resumeLoading, setResumeLoading] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState<any>(null);
  const [targetTitle, setTargetTitle] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [targetJd, setTargetJd] = useState("");
  const [jdMode, setJdMode] = useState<"paste" | "select" | "file">("paste");
  
  // Suggestion review statuses
  const [acceptedSuggestions, setAcceptedSuggestions] = useState<Record<string, boolean>>({});
  const [rejectedSuggestions, setRejectedSuggestions] = useState<Record<string, boolean>>({});
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [activeSuggestionTab, setActiveSuggestionTab] = useState<"summary" | "experience" | "projects" | "skills" | "certs">("summary");

  // Compiled tailored resume mode
  const [compiledMode, setCompiledMode] = useState(false);
  const [platformJobs, setPlatformJobs] = useState<any[]>([]);

  // Load platform jobs list
  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPlatformJobs(data);
      })
      .catch((e) => console.error("Failed to load jobs list", e));
  }, []);

  // Pre-fill target role if set in store
  useEffect(() => {
    if (selectedJobRole) {
      setTargetTitle(selectedJobRole);
    }
  }, [selectedJobRole]);

  const handleJdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result?.toString() || "";
      setTargetJd(text);
    };
    reader.readAsText(file);
  };

  const handleOptimizeResume = async () => {
    if (!targetJd.trim()) {
      alert("Please provide a target Job Description to guide optimization.");
      return;
    }
    setResumeLoading(true);
    setOptimizedResume(null);
    setAcceptedSuggestions({});
    setRejectedSuggestions({});
    setCompiledMode(false);
    try {
      const response = await fetch("/api/ai/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle: targetTitle,
          companyName: targetCompany,
          jobDescription: targetJd,
          bio: parsedResumeDetails?.bio || "",
          experience: parsedResumeDetails?.experience || [],
          projects: parsedResumeDetails?.projects || [],
          skills: parsedResumeDetails?.verifiedSkills || [],
          certifications: parsedResumeDetails?.certifications || [],
          education: parsedResumeDetails?.education || []
        })
      });
      const data = await response.json();
      if (data.success && data.result) {
        setOptimizedResume(data.result);
        // Switch to the first available category suggestion tab
        if (data.result.summary) setActiveSuggestionTab("summary");
        else if (data.result.experience?.length > 0) setActiveSuggestionTab("experience");
        else if (data.result.projects?.length > 0) setActiveSuggestionTab("projects");
        else if (data.result.skills?.length > 0) setActiveSuggestionTab("skills");
        else if (data.result.certifications?.length > 0) setActiveSuggestionTab("certs");
      } else {
        alert(data.error || "Failed to generate suggestions.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Error generating suggestions: " + e.message);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleAcceptSuggestion = (sug: any, type: "summary" | "experience" | "projects" | "skills" | "certs") => {
    if (!parsedResumeDetails) return;

    if (type === "summary") {
      updateParsedDetails({ bio: sug.suggestedText });
      setAcceptedSuggestions(prev => ({ ...prev, summary: true }));
    } else if (type === "experience") {
      const updated = [...(parsedResumeDetails.experience || [])];
      if (updated[sug.index]) {
        updated[sug.index].responsibilities = sug.suggestedText;
        updateParsedDetails({ experience: updated });
      }
      setAcceptedSuggestions(prev => ({ ...prev, [`exp-${sug.index}`]: true }));
    } else if (type === "projects") {
      const updated = [...(parsedResumeDetails.projects || [])];
      if (updated[sug.index]) {
        updated[sug.index].description = sug.suggestedText;
        updateParsedDetails({ projects: updated });
      }
      setAcceptedSuggestions(prev => ({ ...prev, [`proj-${sug.index}`]: true }));
    } else if (type === "skills") {
      const current = parsedResumeDetails.verifiedSkills || [];
      if (!current.includes(sug.skillName)) {
        updateParsedDetails({ verifiedSkills: [...current, sug.skillName] });
      }
      setAcceptedSuggestions(prev => ({ ...prev, [`skill-${sug.skillName}`]: true }));
    } else if (type === "certs") {
      const updated = [...(parsedResumeDetails.certifications || [])];
      if (updated[sug.index]) {
        updated[sug.index].certificationName = sug.suggestedText;
        updateParsedDetails({ certifications: updated });
      }
      setAcceptedSuggestions(prev => ({ ...prev, [`cert-${sug.index}`]: true }));
    }
  };

  const handleRejectSuggestion = (sugId: string) => {
    setRejectedSuggestions(prev => ({ ...prev, [sugId]: true }));
  };

  const startEditSuggestion = (sugId: string, initialText: string) => {
    setEditingSuggestionId(sugId);
    setEditingText(initialText);
  };

  const saveEditedSuggestion = (sug: any, type: "summary" | "experience" | "projects" | "certs") => {
    if (!parsedResumeDetails) return;

    const finalValue = editingText.trim();
    if (!finalValue) return;

    if (type === "summary") {
      updateParsedDetails({ bio: finalValue });
      setAcceptedSuggestions(prev => ({ ...prev, summary: true }));
    } else if (type === "experience") {
      const updated = [...(parsedResumeDetails.experience || [])];
      if (updated[sug.index]) {
        updated[sug.index].responsibilities = finalValue;
        updateParsedDetails({ experience: updated });
      }
      setAcceptedSuggestions(prev => ({ ...prev, [`exp-${sug.index}`]: true }));
    } else if (type === "projects") {
      const updated = [...(parsedResumeDetails.projects || [])];
      if (updated[sug.index]) {
        updated[sug.index].description = finalValue;
        updateParsedDetails({ projects: updated });
      }
      setAcceptedSuggestions(prev => ({ ...prev, [`proj-${sug.index}`]: true }));
    } else if (type === "certs") {
      const updated = [...(parsedResumeDetails.certifications || [])];
      if (updated[sug.index]) {
        updated[sug.index].certificationName = finalValue;
        updateParsedDetails({ certifications: updated });
      }
      setAcceptedSuggestions(prev => ({ ...prev, [`cert-${sug.index}`]: true }));
    }

    setEditingSuggestionId(null);
  };

  const getCompiledResumeText = () => {
    if (!parsedResumeDetails) return "";
    const p = parsedResumeDetails;
    let res = "";
    res += `# ${p.fullName || "Candidate Name"}\n`;
    res += `${p.email || ""} | ${p.phone || ""} | ${p.location || ""}\n`;
    const links = [p.linkedin, p.github, p.portfolioWebsite].filter(Boolean);
    if (links.length > 0) {
      res += `${links.join(" | ")}\n`;
    }
    res += `\n---\n\n`;
    
    if (p.bio) {
      res += `## PROFESSIONAL SUMMARY\n${p.bio}\n\n`;
    }
    
    if (p.verifiedSkills && p.verifiedSkills.length > 0) {
      res += `## CORE TECHNOLOGIES & SKILLS\n${p.verifiedSkills.join(" • ")}\n\n`;
    }
    
    if (p.experience && p.experience.length > 0) {
      res += `## PROFESSIONAL EXPERIENCE\n`;
      p.experience.forEach(exp => {
        res += `### ${exp.role} | ${exp.companyName}\n`;
        res += `${exp.startDate || ""} - ${exp.endDate || ""} ${exp.duration ? `(${exp.duration})` : ""}\n`;
        if (exp.responsibilities) {
          const lines = exp.responsibilities.split("\n").map(l => l.trim()).filter(Boolean);
          lines.forEach(l => {
            res += `- ${l.startsWith("-") ? l.substring(1).trim() : l}\n`;
          });
        }
        res += `\n`;
      });
    }
    
    if (p.projects && p.projects.length > 0) {
      res += `## TECHNICAL PROJECTS\n`;
      p.projects.forEach(proj => {
        res += `### ${proj.projectTitle}\n`;
        if (proj.description) {
          const lines = proj.description.split("\n").map(l => l.trim()).filter(Boolean);
          lines.forEach(l => {
            res += `- ${l.startsWith("-") ? l.substring(1).trim() : l}\n`;
          });
        }
        res += `\n`;
      });
    }
    
    if (p.education && p.education.length > 0) {
      res += `## EDUCATION\n`;
      p.education.forEach(edu => {
        res += `### ${edu.degree} in ${edu.branch} | ${edu.institution}\n`;
        res += `${edu.startYear || ""} - ${edu.endYear || ""} ${edu.cgpa ? `(CGPA: ${edu.cgpa})` : ""}\n\n`;
      });
    }
    
    if (p.certifications && p.certifications.length > 0) {
      res += `## CERTIFICATIONS\n`;
      p.certifications.forEach(cert => {
        res += `- ${cert.certificationName} | ${cert.organization} (${cert.date || ""})\n`;
      });
    }
    
    return res;
  };

  const handleDownloadMarkdown = () => {
    const text = getCompiledResumeText();
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = `${(parsedResumeDetails?.fullName || "Resume").replace(/\s+/g, "_")}_Tailored_Resume.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyText = () => {
    const text = getCompiledResumeText();
    navigator.clipboard.writeText(text);
    alert("Tailored resume content copied to clipboard!");
  };

  // ==========================================
  // TAB 2: MOCK INTERVIEW STATES & HANDLERS
  // ==========================================
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState({
    difficulty: "Intermediate",
    type: "Technical",
    mode: "Text",
    company: "",
    jobDescription: ""
  });
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [interviewHistoryList, setInterviewHistoryList] = useState<any[]>([]);
  const [currentReport, setCurrentReport] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);

  // Speech Recognition hook setup
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = false;
        recog.lang = "en-US";
        recog.onresult = (event: any) => {
          const trans = event.results[event.results.length - 1][0].transcript;
          setStudentAnswer(prev => (prev ? prev + " " + trans : trans));
        };
        recog.onend = () => setIsListening(false);
        recognitionRef.current = recog;
      }
    }
    // Load local storage interview history
    const saved = localStorage.getItem("epitome_interview_history");
    if (saved) {
      setInterviewHistoryList(JSON.parse(saved));
    }
  }, []);

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      window.speechSynthesis.speak(u);
    }
  };

  const handleStartInterview = () => {
    setInterviewActive(true);
    setChatHistory([]);
    setQuestionIndex(1);
    setCurrentReport(null);
    setStudentAnswer("");

    // Make initial question fully personalized based on the candidate's actual resume details if available
    const primarySkill = parsedResumeDetails?.technicalSkills?.[0] || "Software Engineering";
    const primaryProj = parsedResumeDetails?.projects?.[0]?.projectTitle || "key engineering project";
    const companySegment = interviewConfig.company ? ` tailored for ${interviewConfig.company}` : "";

    const initial = `Hello! Welcome to your ${interviewConfig.difficulty} level ${interviewConfig.type} mock interview for the ${selectedJobRole} role${companySegment}. Looking at your profile, I see you have experience with ${primarySkill} and built "${primaryProj}". Let's start by having you introduce yourself and explain how you built and optimized that project.`;

    setCurrentQuestion(initial);
    if (interviewConfig.mode === "Voice") {
      speakText(initial);
    }
  };

  const handleNextQuestion = async () => {
    setInterviewLoading(true);
    try {
      const updatedHistory = [...chatHistory, { role: "interviewer", content: currentQuestion }, { role: "candidate", content: studentAnswer }];
      setChatHistory(updatedHistory);

      const response = await fetch("/api/ai/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedJobRole,
          interviewType: interviewConfig.type,
          difficulty: interviewConfig.difficulty,
          company: interviewConfig.company,
          jobDescription: interviewConfig.jobDescription,
          resumeContext: {
            skills: parsedResumeDetails?.technicalSkills,
            projects: parsedResumeDetails?.projects,
            experience: parsedResumeDetails?.experience,
            education: parsedResumeDetails?.education,
            certifications: parsedResumeDetails?.certifications
          },
          question: currentQuestion,
          answer: studentAnswer,
          history: updatedHistory
        })
      });
      const data = await response.json();
      if (data.success && data.result) {
        if (data.result.report) {
          setCurrentReport(data.result.report);
          setInterviewActive(false);
          const newHist = [{
            date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            role: selectedJobRole,
            type: interviewConfig.type,
            score: data.result.report.overallScore,
            report: data.result.report
          }, ...interviewHistoryList];
          setInterviewHistoryList(newHist);
          localStorage.setItem("epitome_interview_history", JSON.stringify(newHist));
        } else {
          setCurrentQuestion(data.result.nextQuestion);
          setStudentAnswer("");
          setQuestionIndex(prev => prev + 1);
          if (interviewConfig.mode === "Voice") {
            speakText(data.result.nextQuestion);
          }
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInterviewLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // ==========================================
  // TAB 3: QUESTION GENERATOR STATES & HANDLERS
  // ==========================================
  const [questionConfig, setQuestionConfig] = useState({
    difficulty: "Intermediate",
    type: "Technical",
    experience: "Apprentice"
  });
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any>(null);
  const [savedQuestionSets, setSavedQuestionSets] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("epitome_saved_questions");
    if (saved) {
      setSavedQuestionSets(JSON.parse(saved));
    }
  }, []);

  const handleGenerateQuestions = async () => {
    setQuestionsLoading(true);
    try {
      const response = await fetch("/api/ai/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: selectedJobRole,
          difficulty: questionConfig.difficulty,
          skills: studentSkills,
          experience: questionConfig.experience,
          interviewType: questionConfig.type
        })
      });
      const data = await response.json();
      if (data.success && data.result) {
        setGeneratedQuestions(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setQuestionsLoading(false);
    }
  };

  const handleSaveQuestionSet = () => {
    if (!generatedQuestions) return;
    const newSet = {
      id: Math.random().toString(),
      date: new Date().toLocaleDateString(),
      role: selectedJobRole,
      difficulty: questionConfig.difficulty,
      questions: generatedQuestions
    };
    const updated = [newSet, ...savedQuestionSets];
    setSavedQuestionSets(updated);
    localStorage.setItem("epitome_saved_questions", JSON.stringify(updated));
  };

  const handleDeleteSavedSet = (id: string) => {
    const updated = savedQuestionSets.filter(s => s.id !== id);
    setSavedQuestionSets(updated);
    localStorage.setItem("epitome_saved_questions", JSON.stringify(updated));
  };

  // ==========================================
  // TAB 4: CAREER ADVISOR STATES & HANDLERS
  // ==========================================
  const [advisorLoading, setAdvisorLoading] = useState(false);
  const [careerGuidance, setCareerGuidance] = useState<any>(null);

  const handleGetCareerGuidance = async () => {
    setAdvisorLoading(true);
    try {
      const response = await fetch("/api/ai/career-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: studentSkills,
          projects: studentProjects,
          courses: studentEducation,
          goal: selectedJobRole,
          interviewScores: interviewHistoryList.map(h => h.score),
          academicInfo: studentEducation
        })
      });
      const data = await response.json();
      if (data.success && data.result) {
        setCareerGuidance(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAdvisorLoading(false);
    }
  };

  // ==========================================
  // TAB 5: JOB RECOMMENDATION ENGINE STATES
  // ==========================================
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobRecommendations, setJobRecommendations] = useState<any[]>([]);
  const [jobPrefLocation, setJobPrefLocation] = useState("London, UK");

  const handleGetJobRecommendations = async () => {
    setJobsLoading(true);
    try {
      const response = await fetch("/api/ai/job-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: studentSkills,
          preferredRole: selectedJobRole,
          location: jobPrefLocation,
          experience: studentExperience,
          goal: selectedJobRole
        })
      });
      const data = await response.json();
      if (data.success && data.result?.jobs) {
        setJobRecommendations(data.result.jobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setJobsLoading(false);
    }
  };

  // ==========================================
  // TAB 6: LEARNING PATH STATES & HANDLERS
  // ==========================================
  const [learningLoading, setLearningLoading] = useState(false);
  const [learningPath, setLearningPath] = useState<any>(null);
  const [completedMilestones, setCompletedMilestones] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const savedPath = localStorage.getItem("epitome_learning_path_data");
    const savedMilestones = localStorage.getItem("epitome_learning_path_milestones");
    if (savedPath) setLearningPath(JSON.parse(savedPath));
    if (savedMilestones) setCompletedMilestones(JSON.parse(savedMilestones));
  }, []);

  const handleGenerateLearningPath = async () => {
    setLearningLoading(true);
    try {
      const response = await fetch("/api/ai/learning-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: studentSkills,
          goal: selectedJobRole,
          targetRole: selectedJobRole,
          weakAreas: careerGuidance?.weaknesses || [],
          interviewReports: interviewHistoryList.map(h => h.report)
        })
      });
      const data = await response.json();
      if (data.success && data.result) {
        setLearningPath(data.result);
        localStorage.setItem("epitome_learning_path_data", JSON.stringify(data.result));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLearningLoading(false);
    }
  };

  const handleToggleMilestone = (weekNum: number) => {
    const updated = { ...completedMilestones, [weekNum]: !completedMilestones[weekNum] };
    setCompletedMilestones(updated);
    localStorage.setItem("epitome_learning_path_milestones", JSON.stringify(updated));
  };

  const calculateLearningProgress = () => {
    if (!learningPath?.weeks) return 0;
    const completedCount = Object.values(completedMilestones).filter(Boolean).length;
    return Math.round((completedCount / learningPath.weeks.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Target Job Role selector & Profile sync banner */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-500">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold text-[#0b172a]">
              AI Career Development Suite
            </h1>
            <p className="text-slate-500 text-xs font-medium font-sans">
              All tools share the same verified student credentials for consistent matching analysis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-sans">
            Target Role:
          </span>
          <select
            value={selectedJobRole}
            onChange={(e) => setSelectedJobRole(e.target.value)}
            className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-55 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="Software Developer">Software Developer</option>
            <option value="Frontend Engineer">Frontend Engineer</option>
            <option value="Backend Developer">Backend Developer</option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="Cloud Solutions Architect">Cloud Solutions Architect</option>
            <option value="DevOps Specialist">DevOps Specialist</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
          </select>
        </div>
      </div>

      {/* Tabs bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-1">
        {[
          { id: "resume", label: "Resume Optimizer", icon: FileText },
          { id: "interview", label: "Mock Interview", icon: MessageSquare },
          { id: "questions", label: "Questions Library", icon: Lightbulb },
          { id: "career", label: "Career Advisor", icon: Compass },
          { id: "jobs", label: "Job Recommendations", icon: Briefcase },
          { id: "learning", label: "Learning Roadmaps", icon: Map }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? "bg-[#0b172a] text-white shadow-sm" 
                  : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main content window */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 min-h-[500px] shadow-sm relative">
        <AnimatePresence mode="wait">
          {/* TAB 1: RESUME OPTIMIZER (AI RESUME ASSISTANT) */}
          {activeTab === "resume" && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-50 pb-3">
                <div className="space-y-1">
                  <h2 className="font-display text-base font-bold text-[#0b172a] flex items-center gap-1.5">
                    <Sparkles className="h-5 w-5 text-orange-500" /> AI Resume Assistant
                  </h2>
                  <p className="text-slate-400 text-xs font-medium font-sans">
                    Contextual role-specific optimizations tailored to your target job, company, and description.
                  </p>
                </div>
                {optimizedResume && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCompiledMode(c => !c)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 ${
                        compiledMode
                          ? "bg-slate-100 hover:bg-slate-200 text-slate-700"
                          : "bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white"
                      }`}
                    >
                      {compiledMode ? (
                        <>
                          <Edit3 className="h-4 w-4" /> Back to Suggestions
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 animate-pulse" /> View Optimized Resume
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setOptimizedResume(null);
                        setCompiledMode(false);
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-655 font-bold text-xs"
                    >
                      Reset Assistant
                    </button>
                  </div>
                )}
              </div>

              {!optimizedResume ? (
                /* 1. CONFIGURATION VIEW: Inputs panel */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Job Title</span>
                        <Input
                          type="text"
                          placeholder="e.g. Senior Frontend Engineer"
                          value={targetTitle}
                          onChange={(e: any) => setTargetTitle(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Company</span>
                        <Input
                          type="text"
                          placeholder="e.g. Stripe, Google, Vercel"
                          value={targetCompany}
                          onChange={(e: any) => setTargetCompany(e.target.value)}
                          className="h-9 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Job Description</span>
                      
                      <div className="flex gap-2 border-b border-slate-100 pb-2">
                        {[
                          { id: "paste", label: "Paste JD Text" },
                          { id: "select", label: "Select Platform Job" },
                          { id: "file", label: "Upload JD File" }
                        ].map((mode) => (
                          <button
                            key={mode.id}
                            onClick={() => {
                              setJdMode(mode.id as any);
                              if (mode.id === "select" && platformJobs.length > 0) {
                                const job = platformJobs[0];
                                setTargetTitle(job.title || "");
                                setTargetCompany(job.company || "");
                                setTargetJd(job.description || "");
                              }
                            }}
                            className={`px-3 py-1 rounded-xl text-[10.5px] font-bold transition-all ${
                              jdMode === mode.id
                                ? "bg-slate-900 text-white shadow-xs"
                                : "bg-slate-50 text-slate-550 border border-slate-150 hover:bg-slate-100"
                            }`}
                          >
                            {mode.label}
                          </button>
                        ))}
                      </div>

                      {jdMode === "paste" && (
                        <textarea
                          placeholder="Paste the target job description requirements here..."
                          value={targetJd}
                          onChange={(e) => setTargetJd(e.target.value)}
                          rows={6}
                          className="w-full p-3 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-slate-800 bg-white font-sans"
                        />
                      )}

                      {jdMode === "select" && (
                        <div className="space-y-3">
                          <select
                            onChange={(e) => {
                              const job = platformJobs.find(j => j.id === e.target.value);
                              if (job) {
                                setTargetTitle(job.title || "");
                                setTargetCompany(job.company || "");
                                setTargetJd(job.description || "");
                              }
                            }}
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
                          >
                            {platformJobs.map((job) => (
                              <option key={job.id} value={job.id}>
                                {job.title} at {job.company}
                              </option>
                            ))}
                          </select>
                          <textarea
                            value={targetJd}
                            readOnly
                            rows={5}
                            className="w-full p-3 border border-slate-200 rounded-2xl text-xs bg-slate-50 text-slate-500 font-sans"
                          />
                        </div>
                      )}

                      {jdMode === "file" && (
                        <div className="space-y-3">
                          <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                            <FileUp className="h-6 w-6 text-slate-400 mb-1" />
                            <span className="text-[10px] font-bold text-slate-600">Choose Text / Markdown / Word Document</span>
                            <input type="file" accept=".txt,.md,.docx,.doc" onChange={handleJdFileUpload} className="hidden" />
                          </label>
                          {targetJd && (
                            <textarea
                              value={targetJd}
                              onChange={(e) => setTargetJd(e.target.value)}
                              rows={4}
                              className="w-full p-3 border border-slate-200 rounded-2xl text-xs focus:outline-none focus:border-slate-800 bg-white font-sans"
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleOptimizeResume}
                      disabled={resumeLoading}
                      className="w-full rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-3 text-xs shadow-md shadow-orange-500/10 hover:shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                    >
                      {resumeLoading ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" /> Analyzing resume & matching targets...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 animate-pulse" /> Analyze & Generate Optimizer Suggestions
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <DashboardCard glowColor="blue" className="p-4 space-y-3 bg-blue-50/10">
                      <div className="flex items-center gap-1.5 text-[10.5px] font-black text-blue-600 uppercase tracking-wider">
                        <Info className="h-4 w-4" /> AI Optimizer Guide
                      </div>
                      <p className="text-[10.5px] text-slate-500 leading-relaxed font-sans">
                        Our AI Assistant compares your current resume credentials with the target Job Description to highlight matches and suggest dynamic enhancements.
                      </p>
                      <ul className="space-y-2 text-[10.5px] text-slate-655 font-medium pl-4 list-disc">
                        <li>Optimizes summary summaries.</li>
                        <li>Adapts work history descriptions.</li>
                        <li>Verifies projects for key terms.</li>
                        <li>Identifies missing targeted skills.</li>
                      </ul>
                    </DashboardCard>
                  </div>
                </div>
              ) : compiledMode ? (
                /* 2. COMPILED TAILORED RESUME PREVIEW: A4 Sheet layout */
                <div className="max-w-4xl mx-auto space-y-6 text-left">
                  <div className="flex justify-between items-center bg-slate-50 border border-slate-150 p-3 rounded-2xl">
                    <span className="text-[10.5px] font-bold text-slate-600 flex items-center gap-1.5">
                      <Check className="h-4 w-4 text-emerald-500" /> Factual tailored resume compiled successfully!
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyText}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-655 font-bold text-[10.5px] transition-all"
                      >
                        <Copy className="h-3.5 w-3.5" /> Copy Text
                      </button>
                      <button
                        onClick={handleDownloadMarkdown}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10.5px] transition-all"
                      >
                        <Download className="h-3.5 w-3.5" /> Download MD
                      </button>
                    </div>
                  </div>

                  {/* A4 sheet preview */}
                  <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-8 sm:p-12 font-mono text-[11px] text-slate-800 leading-relaxed max-w-3xl mx-auto select-text whitespace-pre-wrap">
                    {getCompiledResumeText()}
                  </div>

                  <div className="text-center pt-2">
                    <p className="text-[10px] text-slate-400 font-medium">
                      Tip: You can use your browser's Print feature (Ctrl+P / Cmd+P) to save this page layout as a clean PDF document.
                    </p>
                  </div>
                </div>
              ) : (
                /* 3. SUGGESTIONS WORKSPACE VIEW: Section tabs + Interactive list review */
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
                  {/* Left panel tabs selector */}
                  <div className="lg:col-span-1 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
                    {[
                      { id: "summary", label: "Profile Summary", count: optimizedResume.summary ? 1 : 0 },
                      { id: "experience", label: "Work History", count: optimizedResume.experience?.length || 0 },
                      { id: "projects", label: "Projects Portfolio", count: optimizedResume.projects?.length || 0 },
                      { id: "skills", label: "Suggested Skills", count: optimizedResume.skills?.length || 0 },
                      { id: "certs", label: "Certifications", count: optimizedResume.certifications?.length || 0 }
                    ].map((sec) => (
                      <button
                        key={sec.id}
                        onClick={() => {
                          setActiveSuggestionTab(sec.id as any);
                          setEditingSuggestionId(null);
                        }}
                        className={`flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 text-left ${
                          activeSuggestionTab === sec.id
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-50 hover:bg-slate-100 text-slate-655 border border-slate-100"
                        }`}
                      >
                        <span>{sec.label}</span>
                        {sec.count > 0 && (
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black ${
                            activeSuggestionTab === sec.id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                          }`}>
                            {sec.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Right panel suggestion lists */}
                  <div className="lg:col-span-3 space-y-4">
                    
                    {/* Summary Tab Suggestions */}
                    {activeSuggestionTab === "summary" && optimizedResume.summary && (
                      (() => {
                        const sug = optimizedResume.summary;
                        const isAccepted = acceptedSuggestions["summary"];
                        const isRejected = rejectedSuggestions["summary"];
                        const isEditing = editingSuggestionId === "summary";

                        if (isRejected) return <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 italic text-[11.5px]">Suggestion dismissed.</div>;

                        return (
                          <div className="border border-slate-150 rounded-2xl p-5 bg-slate-50/10 space-y-4 relative overflow-hidden">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                              <span className="text-[10px] font-bold text-orange-500 uppercase block tracking-wider">Tailored Summary Optimization</span>
                              {isAccepted && (
                                <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-bold flex items-center gap-1 border border-emerald-100">
                                  <Check className="h-3 w-3" /> Updated in Profile
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1.5">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Current Text</span>
                                <p className="text-slate-500 leading-relaxed font-sans">{sug.originalText || "No summary provided."}</p>
                              </div>

                              <div className="p-3.5 bg-emerald-50/10 rounded-xl border border-emerald-100/30 space-y-1.5 relative">
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">AI Suggested Wording</span>
                                {isEditing ? (
                                  <textarea
                                    value={editingText}
                                    onChange={(e) => setEditingText(e.target.value)}
                                    rows={4}
                                    className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none"
                                  />
                                ) : (
                                  <p className="text-slate-700 font-semibold leading-relaxed font-sans">{sug.suggestedText}</p>
                                )}
                              </div>
                            </div>

                            <div className="p-3 bg-amber-50/20 border border-amber-100/50 rounded-xl text-[10.5px] text-slate-655 font-medium flex gap-2">
                              <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-amber-800">Why this helps:</span> {sug.explanation}
                              </div>
                            </div>

                            {!isAccepted && (
                              <div className="flex gap-2 justify-end pt-2 border-t border-slate-50">
                                {isEditing ? (
                                  <>
                                    <button onClick={() => setEditingSuggestionId(null)} className="px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                                    <button onClick={() => saveEditedSuggestion(sug, "summary")} className="px-3 py-1 text-[10px] font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800">Save & Accept</button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => handleRejectSuggestion("summary")} className="px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-500">Dismiss</button>
                                    <button onClick={() => startEditSuggestion("summary", sug.suggestedText)} className="px-2.5 py-1 text-[10px] font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-0.5"><Edit3 className="h-3 w-3" /> Edit</button>
                                    <button onClick={() => handleAcceptSuggestion(sug, "summary")} className="px-3.5 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-0.5"><Check className="h-3.5 w-3.5" /> Accept Suggestion</button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()
                    )}

                    {/* Experience Tab Suggestions */}
                    {activeSuggestionTab === "experience" && (
                      optimizedResume.experience && optimizedResume.experience.length > 0 ? (
                        optimizedResume.experience.map((sug: any, idx: number) => {
                          const sugId = `exp-${sug.index}`;
                          const isAccepted = acceptedSuggestions[sugId];
                          const isRejected = rejectedSuggestions[sugId];
                          const isEditing = editingSuggestionId === sugId;

                          if (isRejected) return <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 italic text-[11.5px]">Suggestion dismissed.</div>;

                          return (
                            <div key={idx} className="border border-slate-150 rounded-2xl p-5 bg-slate-50/10 space-y-4 relative">
                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <div>
                                  <h4 className="font-bold text-slate-800 text-[11px]">{sug.companyName}</h4>
                                  <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block mt-0.5">Role: {sug.originalRole}</span>
                                </div>
                                {isAccepted && (
                                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-bold flex items-center gap-1 border border-emerald-100">
                                    <Check className="h-3 w-3" /> Updated in Profile
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1.5">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Current Text</span>
                                  <p className="text-slate-550 leading-relaxed font-sans whitespace-pre-wrap">{sug.originalText || "No description provided."}</p>
                                </div>

                                <div className="p-3.5 bg-emerald-50/10 rounded-xl border border-emerald-100/30 space-y-1.5">
                                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">AI Suggested STAR wording</span>
                                  {isEditing ? (
                                    <textarea
                                      value={editingText}
                                      onChange={(e) => setEditingText(e.target.value)}
                                      rows={5}
                                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none font-sans"
                                    />
                                  ) : (
                                    <p className="text-slate-700 font-semibold leading-relaxed font-sans whitespace-pre-wrap">{sug.suggestedText}</p>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 bg-amber-50/20 border border-amber-100/50 rounded-xl text-[10.5px] text-slate-655 font-medium flex gap-2">
                                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-amber-800">Why this helps:</span> {sug.explanation}
                                </div>
                              </div>

                              {!isAccepted && (
                                <div className="flex gap-2 justify-end pt-2 border-t border-slate-50">
                                  {isEditing ? (
                                    <>
                                      <button onClick={() => setEditingSuggestionId(null)} className="px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                                      <button onClick={() => saveEditedSuggestion(sug, "experience")} className="px-3 py-1 text-[10px] font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-sans">Save & Accept</button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => handleRejectSuggestion(sugId)} className="px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-500">Dismiss</button>
                                      <button onClick={() => startEditSuggestion(sugId, sug.suggestedText)} className="px-2.5 py-1 text-[10px] font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-0.5"><Edit3 className="h-3 w-3" /> Edit</button>
                                      <button onClick={() => handleAcceptSuggestion(sug, "experience")} className="px-3 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-0.5"><Check className="h-3.5 w-3.5" /> Accept Suggestion</button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                          No parsed work experience found to optimize.
                        </div>
                      )
                    )}

                    {/* Projects Tab Suggestions */}
                    {activeSuggestionTab === "projects" && (
                      optimizedResume.projects && optimizedResume.projects.length > 0 ? (
                        optimizedResume.projects.map((sug: any, idx: number) => {
                          const sugId = `proj-${sug.index}`;
                          const isAccepted = acceptedSuggestions[sugId];
                          const isRejected = rejectedSuggestions[sugId];
                          const isEditing = editingSuggestionId === sugId;

                          if (isRejected) return <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 italic text-[11.5px]">Suggestion dismissed.</div>;

                          return (
                            <div key={idx} className="border border-slate-150 rounded-2xl p-5 bg-slate-50/10 space-y-4 relative">
                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <h4 className="font-bold text-slate-800 text-[11px]">Project: {sug.projectTitle}</h4>
                                {isAccepted && (
                                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-bold flex items-center gap-1 border border-emerald-100">
                                    <Check className="h-3 w-3" /> Updated in Profile
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1.5">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Current Text</span>
                                  <p className="text-slate-550 leading-relaxed font-sans whitespace-pre-wrap">{sug.originalText || "No project description provided."}</p>
                                </div>

                                <div className="p-3.5 bg-emerald-50/10 rounded-xl border border-emerald-100/30 space-y-1.5">
                                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">AI Suggested wording</span>
                                  {isEditing ? (
                                    <textarea
                                      value={editingText}
                                      onChange={(e) => setEditingText(e.target.value)}
                                      rows={5}
                                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none font-sans"
                                    />
                                  ) : (
                                    <p className="text-slate-700 font-semibold leading-relaxed font-sans whitespace-pre-wrap">{sug.suggestedText}</p>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 bg-amber-50/20 border border-amber-100/50 rounded-xl text-[10.5px] text-slate-655 font-medium flex gap-2">
                                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-amber-800">Why this helps:</span> {sug.explanation}
                                </div>
                              </div>

                              {!isAccepted && (
                                <div className="flex gap-2 justify-end pt-2 border-t border-slate-50">
                                  {isEditing ? (
                                    <>
                                      <button onClick={() => setEditingSuggestionId(null)} className="px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                                      <button onClick={() => saveEditedSuggestion(sug, "projects")} className="px-3 py-1 text-[10px] font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800 font-sans">Save & Accept</button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => handleRejectSuggestion(sugId)} className="px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-500">Dismiss</button>
                                      <button onClick={() => startEditSuggestion(sugId, sug.suggestedText)} className="px-2.5 py-1 text-[10px] font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-0.5"><Edit3 className="h-3 w-3" /> Edit</button>
                                      <button onClick={() => handleAcceptSuggestion(sug, "projects")} className="px-3 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-0.5"><Check className="h-3.5 w-3.5" /> Accept Suggestion</button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                          No parsed technical projects found to optimize.
                        </div>
                      )
                    )}

                    {/* Skills Tab Suggestions */}
                    {activeSuggestionTab === "skills" && (
                      optimizedResume.skills && optimizedResume.skills.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {optimizedResume.skills.map((sug: any, idx: number) => {
                            const sugId = `skill-${sug.skillName}`;
                            const isAccepted = acceptedSuggestions[sugId];
                            const isRejected = rejectedSuggestions[sugId];

                            if (isRejected) return null;

                            return (
                              <div key={idx} className="border border-slate-150 rounded-2xl p-4 bg-slate-50/10 flex flex-col justify-between gap-3 text-left">
                                <div className="space-y-1.5">
                                  <div className="flex justify-between items-center">
                                    <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-[10.5px]">
                                      {sug.skillName}
                                    </span>
                                    {isAccepted && (
                                      <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5">
                                        <Check className="h-3 w-3" /> Added
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-500 leading-relaxed font-sans pr-1">{sug.explanation}</p>
                                </div>

                                {!isAccepted && (
                                  <div className="flex gap-2 justify-end pt-2 border-t border-slate-50">
                                    <button onClick={() => handleRejectSuggestion(sugId)} className="text-[9px] font-bold text-slate-400 hover:text-slate-500">Dismiss</button>
                                    <button onClick={() => handleAcceptSuggestion(sug, "skills")} className="px-2.5 py-1 text-[9px] font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg">Add to Profile</button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                          No missing skill recommendations generated.
                        </div>
                      )
                    )}

                    {/* Certifications Tab Suggestions */}
                    {activeSuggestionTab === "certs" && (
                      optimizedResume.certifications && optimizedResume.certifications.length > 0 ? (
                        optimizedResume.certifications.map((sug: any, idx: number) => {
                          const sugId = `cert-${sug.index}`;
                          const isAccepted = acceptedSuggestions[sugId];
                          const isRejected = rejectedSuggestions[sugId];
                          const isEditing = editingSuggestionId === sugId;

                          if (isRejected) return <div key={idx} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-400 italic text-[11.5px]">Suggestion dismissed.</div>;

                          return (
                            <div key={idx} className="border border-slate-150 rounded-2xl p-5 bg-slate-50/10 space-y-4 relative">
                              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                <h4 className="font-bold text-slate-800 text-[11px]">Certification Title Enhancement</h4>
                                {isAccepted && (
                                  <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 text-[9px] font-bold flex items-center gap-1 border border-emerald-100">
                                    <Check className="h-3 w-3" /> Updated in Profile
                                  </span>
                                )}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-3.5 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1.5">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Current Text</span>
                                  <p className="text-slate-555 leading-relaxed font-sans">{sug.originalText}</p>
                                </div>

                                <div className="p-3.5 bg-emerald-50/10 rounded-xl border border-emerald-100/30 space-y-1.5">
                                  <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider block">AI Suggested wording</span>
                                  {isEditing ? (
                                    <Input
                                      value={editingText}
                                      onChange={(e) => setEditingText(e.target.value)}
                                      className="h-8.5 text-xs bg-white"
                                    />
                                  ) : (
                                    <p className="text-slate-700 font-semibold leading-relaxed font-sans">{sug.suggestedText}</p>
                                  )}
                                </div>
                              </div>

                              <div className="p-3 bg-amber-50/20 border border-amber-100/50 rounded-xl text-[10.5px] text-slate-655 font-medium flex gap-2">
                                <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                <div>
                                  <span className="font-bold text-amber-800">Why this helps:</span> {sug.explanation}
                                </div>
                              </div>

                              {!isAccepted && (
                                <div className="flex gap-2 justify-end pt-2 border-t border-slate-50">
                                  {isEditing ? (
                                    <>
                                      <button onClick={() => setEditingSuggestionId(null)} className="px-2.5 py-1 text-[10px] font-bold text-slate-500 border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
                                      <button onClick={() => saveEditedSuggestion(sug, "certs")} className="px-3 py-1 text-[10px] font-bold bg-slate-900 text-white rounded-lg hover:bg-slate-800">Save & Accept</button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => handleRejectSuggestion(sugId)} className="px-2.5 py-1 text-[10px] font-bold text-slate-400 hover:text-slate-500">Dismiss</button>
                                      <button onClick={() => startEditSuggestion(sugId, sug.suggestedText)} className="px-2.5 py-1 text-[10px] font-bold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-0.5"><Edit3 className="h-3 w-3" /> Edit</button>
                                      <button onClick={() => handleAcceptSuggestion(sug, "certs")} className="px-3 py-1 text-[10px] font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center gap-0.5"><Check className="h-3.5 w-3.5" /> Accept Suggestion</button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
                          No certifications parsed to optimize.
                        </div>
                      )
                    )}

                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: MOCK INTERVIEW */}
          {activeTab === "interview" && (
            <motion.div
              key="interview"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-display text-base font-bold text-[#0b172a]">
                  Verbal & Text AI Mock Interview Simulator
                </h2>
                <p className="text-slate-400 text-xs font-medium font-sans">
                  Practice verbal screens utilizing Text-to-Speech audio and speech recognition transcribers.
                </p>
              </div>

              {!interviewActive && !currentReport && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Setup parameters panel */}
                  <div className="lg:col-span-2 space-y-5 rounded-2xl border border-slate-100 p-5 bg-slate-50/30">
                    <h3 className="font-display text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Setup Simulator Options
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Interview Type
                        </label>
                        <select
                          value={interviewConfig.type}
                          onChange={(e) => setInterviewConfig({ ...interviewConfig, type: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none bg-white"
                        >
                          <option value="Technical">Technical Interview</option>
                          <option value="HR">HR / Leadership Screen</option>
                          <option value="Resume-Based">Resume-Based Deepdive</option>
                          <option value="Project-Based">Project-Based Showcase</option>
                          <option value="Behavioral">Behavioral (STAR method)</option>
                          <option value="Coding">Coding Logic & Architecture</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Difficulty Level
                        </label>
                        <select
                          value={interviewConfig.difficulty}
                          onChange={(e) => setInterviewConfig({ ...interviewConfig, difficulty: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none bg-white"
                        >
                          <option value="Beginner">Beginner / Graduate</option>
                          <option value="Intermediate">Intermediate / Associate</option>
                          <option value="Advanced">Advanced / Tech Lead</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Verbal Audio mode
                        </label>
                        <select
                          value={interviewConfig.mode}
                          onChange={(e) => setInterviewConfig({ ...interviewConfig, mode: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none bg-white"
                        >
                          <option value="Text">Text-Only Mode</option>
                          <option value="Voice">Voice Speech Mode</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Target Company (Optional)
                        </label>
                        <select
                          value={interviewConfig.company}
                          onChange={(e) => setInterviewConfig({ ...interviewConfig, company: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none bg-white"
                        >
                          <option value="">None (Generic Industry Standard)</option>
                          <option value="Google">Google (System Design & DSA)</option>
                          <option value="Amazon">Amazon (Leadership Principles)</option>
                          <option value="Microsoft">Microsoft (Coding & Devops)</option>
                          <option value="TCS">TCS (Tech Foundation)</option>
                          <option value="Infosys">Infosys (Analytical & logic)</option>
                          <option value="Accenture">Accenture (Enterprise Consulting)</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Job Role
                        </label>
                        <input
                          type="text"
                          value={selectedJobRole}
                          onChange={(e) => setSelectedJobRole(e.target.value)}
                          placeholder="e.g. Frontend Engineer"
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Custom Job Description (Optional)
                      </label>
                      <textarea
                        value={interviewConfig.jobDescription}
                        onChange={(e) => setInterviewConfig({ ...interviewConfig, jobDescription: e.target.value })}
                        placeholder="Paste target job spec here to align the interviewer's focus questions..."
                        rows={3}
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none bg-white resize-none"
                      />
                    </div>

                    <Button
                      onClick={handleStartInterview}
                      variant="primary"
                      className="w-full h-10 rounded-xl font-bold shrink-0 bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      <Play className="mr-1.5 h-4 w-4 fill-white" /> Start Mock Interview
                    </Button>
                  </div>

                  {/* Historical logs sidebar */}
                  <div className="space-y-3">
                    <h3 className="font-display text-xs font-bold text-slate-500 uppercase tracking-wider">
                      History Logs
                    </h3>
                    <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1 divide-y divide-slate-50">
                      {interviewHistoryList.length > 0 ? (
                        interviewHistoryList.map((hist, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setCurrentReport(hist.report)}
                            className="pt-2 flex justify-between items-center text-xs cursor-pointer hover:bg-slate-50 p-2 rounded-xl border border-transparent hover:border-slate-100 transition-all duration-200"
                          >
                            <div>
                              <p className="font-bold text-slate-750">{hist.role} ({hist.type})</p>
                              <p className="text-[9.5px] text-slate-400 font-medium font-sans">{hist.date}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                              Score: {hist.score}%
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[11px] text-slate-400 font-sans">No completed interviews yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Active Session Console */}
              {interviewActive && (
                <div className="max-w-2xl mx-auto rounded-2xl border border-slate-100 p-6 space-y-5 shadow-md">
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                    <span className="px-3 py-1 rounded-full bg-orange-50 text-[10px] font-bold text-orange-600 border border-orange-100">
                      Question {questionIndex} of 5
                    </span>
                    {interviewConfig.mode === "Voice" && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 font-sans">
                        <Volume2 className="h-4.5 w-4.5 text-slate-400 animate-pulse" /> Voice synthesis active
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                      AI Recruiter Question
                    </label>
                    <p className="text-sm font-bold text-slate-800 leading-relaxed font-sans bg-slate-50 p-4 rounded-xl border border-slate-100">
                      {currentQuestion}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">
                        Your Answer
                      </label>
                      {recognitionRef.current && interviewConfig.mode === "Voice" && (
                        <button
                          onClick={toggleListening}
                          className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg transition-colors ${
                            isListening
                              ? "bg-red-50 text-red-600 border border-red-200 animate-pulse"
                              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                          }`}
                        >
                          {isListening ? <MicOff className="h-3 w-3" /> : <Mic className="h-3 w-3" />}
                          {isListening ? "Stop Speech Rec" : "Speak Answer"}
                        </button>
                      )}
                    </div>
                    {interviewConfig.mode === "Voice" && (
                      <AudioVisualizer isListening={isListening} />
                    )}
                    <textarea
                      value={studentAnswer}
                      onChange={(e) => setStudentAnswer(e.target.value)}
                      rows={4}
                      placeholder="Type your response here or click 'Speak Answer' to utilize speech recognition transcribers..."
                      className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 font-sans"
                    />
                  </div>

                  <Button
                    onClick={handleNextQuestion}
                    disabled={interviewLoading || !studentAnswer.trim()}
                    variant="primary"
                    className="w-full h-10 rounded-xl font-bold"
                  >
                    {interviewLoading ? (
                      <span className="flex items-center gap-1.5 justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Evaluating Answer...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 justify-center">
                        Submit Answer & Next <ArrowRight className="ml-1.5 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </div>
              )}

              {/* Scorecard Report Screen */}
              {currentReport && (
                <div className="rounded-2xl border border-slate-100 p-6 space-y-6 shadow-md max-w-3xl mx-auto bg-white">
                  <div className="text-center space-y-2 pb-4 border-b border-slate-50">
                    <div className="inline-flex items-center justify-center p-3.5 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-500">
                      <Award className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      Interview Scorecard Completed!
                    </h3>
                    <p className="text-slate-400 text-xs font-sans">
                      Overall evaluation metrics generated dynamically by the AI Interview Engine.
                    </p>
                  </div>

                  {/* Subscore metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                    {[
                      { label: "Overall Score", value: currentReport.overallScore || currentReport.score || 0, color: "text-orange-500 bg-orange-50 border-orange-100" },
                      { label: "Technical", value: currentReport.technicalScore || 0, color: "text-blue-500 bg-blue-50 border-blue-100" },
                      { label: "Communication", value: currentReport.communicationScore || 0, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
                      { label: "Fluency", value: currentReport.fluencyScore || 0, color: "text-pink-500 bg-pink-50 border-pink-100" },
                      { label: "Confidence", value: currentReport.confidenceScore || 0, color: "text-emerald-500 bg-emerald-50 border-emerald-100" },
                      { label: "Problem Solving", value: currentReport.problemSolvingScore || 0, color: "text-cyan-500 bg-cyan-50 border-cyan-100" }
                    ].map((m, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border text-center ${m.color}`}>
                        <span className="text-[9px] font-black uppercase tracking-wider block opacity-75">{m.label}</span>
                        <p className="text-2xl font-black mt-1 leading-none">{m.value}%</p>
                      </div>
                    ))}
                  </div>

                  {/* Recruiter Scorecard Panel */}
                  {currentReport.recruiterScorecard && (
                    <div className="rounded-2xl border border-slate-100 p-5 space-y-4 bg-slate-50/40 text-left">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Recruiter Scorecard Summary
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10.5px] font-bold text-slate-400 block">Hiring Recommendation</span>
                          <span className={`inline-block px-2.5 py-0.5 rounded-lg text-xs font-bold border ${
                            currentReport.recruiterScorecard.hiringRecommendation?.includes("Strong") 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-250" 
                              : "bg-amber-50 text-amber-700 border-amber-250"
                          }`}>
                            {currentReport.recruiterScorecard.hiringRecommendation}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10.5px] font-bold text-slate-400 block">Candidate Readiness</span>
                          <span className="text-xs font-bold text-slate-700">
                            {currentReport.recruiterScorecard.candidateReadiness}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-slate-100/60">
                        <span className="text-[10.5px] font-bold text-slate-400 block">Suitable Roles</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentReport.recruiterScorecard.suitableRoles?.map((r: string, i: number) => (
                            <span key={i} className="px-2.5 py-0.5 rounded bg-white border border-slate-100 text-[10px] font-bold text-slate-655">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 pt-2 border-t border-slate-100/60">
                        <span className="text-[10.5px] font-bold text-slate-400 block">Interview Summary & Impressions</span>
                        <p className="text-[11px] font-bold text-slate-600 leading-relaxed font-sans">
                          {currentReport.recruiterScorecard.interviewSummary || currentReport.feedback}
                        </p>
                      </div>

                      {currentReport.recruiterScorecard.skillGaps?.length > 0 && (
                        <div className="space-y-1 pt-2 border-t border-slate-100/60">
                          <span className="text-[10.5px] font-bold text-slate-400 block">Skill Gaps Detected</span>
                          <div className="flex flex-wrap gap-1.5">
                            {currentReport.recruiterScorecard.skillGaps?.map((g: string, i: number) => (
                              <span key={i} className="px-2.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-100 text-[9.5px] font-bold">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Strengths & Improvements */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/10 p-4 space-y-3">
                      <h4 className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500" /> Strengths
                      </h4>
                      <ul className="list-disc pl-4 space-y-1.5 text-[10.5px] font-bold text-slate-700">
                        {currentReport.strengths?.map((str: string, i: number) => <li key={i}>{str}</li>)}
                      </ul>
                    </div>

                    <div className="rounded-xl border border-amber-100 bg-amber-50/10 p-4 space-y-3">
                      <h4 className="text-[10px] font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="h-4.5 w-4.5 text-amber-500 animate-pulse" /> Suggested Improvements
                      </h4>
                      <ul className="list-disc pl-4 space-y-1.5 text-[10.5px] font-bold text-slate-700">
                        {currentReport.improvements?.map((imp: string, i: number) => <li key={i}>{imp}</li>)}
                      </ul>
                    </div>
                  </div>

                  {/* Detailed Q&A and Missed Concepts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {currentReport.questionsAnsweredWell?.length > 0 && (
                      <div className="rounded-xl border border-slate-100 p-4 space-y-2 text-left bg-slate-50/30">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Questions Answered Well</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-655 font-sans text-[10.5px]">
                          {currentReport.questionsAnsweredWell.map((q: string, idx: number) => <li key={idx}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                    {currentReport.questionsAnsweredPoorly?.length > 0 && (
                      <div className="rounded-xl border border-slate-100 p-4 space-y-2 text-left bg-slate-50/30">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Questions Answered Weakly</span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-655 font-sans text-[10.5px]">
                          {currentReport.questionsAnsweredPoorly.map((q: string, idx: number) => <li key={idx}>{q}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Missed Concepts & Recommendations */}
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 space-y-3 bg-slate-50/20 text-left">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" /> Recommended Learning & Action Plan
                    </h4>

                    {currentReport.missedConcepts?.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 block">Missed Core Concepts</span>
                        <div className="flex flex-wrap gap-1.5">
                          {currentReport.missedConcepts?.map((c: string, i: number) => (
                            <span key={i} className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {currentReport.recommendedCertifications?.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Certifications</span>
                          <ul className="list-disc pl-3 text-[10px] text-slate-600 font-medium">
                            {currentReport.recommendedCertifications.map((c: string, i: number) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                      )}

                      {currentReport.recommendedProjects?.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Practice Projects</span>
                          <ul className="list-disc pl-3 text-[10px] text-slate-600 font-medium">
                            {currentReport.recommendedProjects.map((p: string, i: number) => <li key={i}>{p}</li>)}
                          </ul>
                        </div>
                      )}

                      {currentReport.recommendedResources?.length > 0 && (
                        <div className="space-y-1">
                          <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider block">Suggested Resources</span>
                          <ul className="list-disc pl-3 text-[10px] text-slate-600 font-medium">
                            {currentReport.recommendedResources.map((r: string, i: number) => <li key={i}>{r}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      onClick={() => setActiveTab("learning")}
                      variant="primary"
                      className="w-full h-10 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white"
                    >
                      <Map className="mr-1.5 h-4 w-4" /> Review Learning Roadmap
                    </Button>
                    <Button
                      onClick={() => setActiveTab("jobs")}
                      variant="outline"
                      className="w-full h-10 rounded-xl font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700"
                    >
                      <Briefcase className="mr-1.5 h-4 w-4" /> View Matching Jobs
                    </Button>
                  </div>

                  <Button
                    onClick={() => setCurrentReport(null)}
                    variant="outline"
                    className="w-full h-10 rounded-xl font-bold bg-white hover:bg-slate-50 border border-slate-200 text-slate-700"
                  >
                    Start Another Interview
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: QUESTION GENERATOR */}
          {activeTab === "questions" && (
            <motion.div
              key="questions"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-display text-base font-bold text-[#0b172a]">
                  AI Interview Question Generator
                </h2>
                <p className="text-slate-400 text-xs font-medium font-sans">
                  Generate dynamic question sets sorted into 6 critical recruitment categories.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inputs Setup Panel */}
                <div className="space-y-4 rounded-2xl border border-slate-100 p-5 bg-slate-50/20">
                  <h3 className="font-display text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Generator Options
                  </h3>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Difficulty
                      </label>
                      <select
                        value={questionConfig.difficulty}
                        onChange={(e) => setQuestionConfig({ ...questionConfig, difficulty: e.target.value })}
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Experience Level
                      </label>
                      <select
                        value={questionConfig.experience}
                        onChange={(e) => setQuestionConfig({ ...questionConfig, experience: e.target.value })}
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none"
                      >
                        <option value="Apprentice">Apprentice / Intern</option>
                        <option value="Junior">Junior Engineer</option>
                        <option value="Senior">Senior Technical</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Interview Type
                      </label>
                      <select
                        value={questionConfig.type}
                        onChange={(e) => setQuestionConfig({ ...questionConfig, type: e.target.value })}
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none"
                      >
                        <option value="Technical">Technical Stack</option>
                        <option value="HR">HR / Culture Fit</option>
                        <option value="Behavioral">Behavioral / Scenario</option>
                        <option value="Coding">Coding Challenge</option>
                      </select>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateQuestions}
                    disabled={questionsLoading}
                    variant="primary"
                    className="w-full h-10 rounded-xl font-bold shrink-0"
                  >
                    {questionsLoading ? (
                      <span className="flex items-center gap-1.5 justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Generating...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 justify-center">
                        <Sparkles className="h-4 w-4" /> Generate Questions
                      </span>
                    )}
                  </Button>

                  {generatedQuestions && (
                    <Button
                      onClick={handleSaveQuestionSet}
                      variant="outline"
                      className="w-full h-9 rounded-xl text-xs font-bold"
                    >
                      <Save className="mr-1.5 h-3.5 w-3.5" /> Save Question Set
                    </Button>
                  )}
                </div>

                {/* Outputs Panel */}
                <div className="lg:col-span-2 space-y-4">
                  {generatedQuestions ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {[
                        { label: "Technical Questions", key: "technical" },
                        { label: "HR / Culture Questions", key: "hr" },
                        { label: "Behavioral Questions", key: "behavioral" },
                        { label: "Scenario-Based Questions", key: "scenario" },
                        { label: "Coding Questions", key: "coding" },
                        { label: "Project-Based Questions", key: "project" }
                      ].map((sec) => {
                        const qs = generatedQuestions[sec.key] || [];
                        if (qs.length === 0) return null;
                        return (
                          <div key={sec.key} className="rounded-xl border border-slate-100 p-4 space-y-2 bg-slate-50/20">
                            <span className="text-[10px] font-extrabold text-[#0b172a] uppercase tracking-wider block">
                              {sec.label}
                            </span>
                            <ul className="list-decimal pl-4 space-y-1.5 text-xs font-sans font-medium text-slate-700">
                              {qs.map((q: string, idx: number) => <li key={idx}>{q}</li>)}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-100 rounded-xl p-8 text-center bg-slate-50/20 min-h-[300px]">
                      <Lightbulb className="h-10 w-10 text-slate-300" />
                      <p className="text-xs font-bold text-slate-400 mt-3">
                        Select parameters and generate questions to populate library.
                      </p>
                    </div>
                  )}

                  {/* Saved Sets Library */}
                  {savedQuestionSets.length > 0 && (
                    <div className="pt-4 border-t border-slate-50 space-y-3">
                      <h3 className="font-display text-xs font-bold text-slate-655 uppercase tracking-wider">
                        Saved Questions Library
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {savedQuestionSets.map((s) => (
                          <div key={s.id} className="p-3.5 rounded-xl border border-slate-100 flex justify-between items-start gap-2 bg-slate-50/10">
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-700">{s.role} ({s.difficulty})</p>
                              <p className="text-[10px] text-slate-400 font-sans font-semibold">{s.date}</p>
                            </div>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => setGeneratedQuestions(s.questions)}
                                className="text-[9px] font-bold text-orange-500 hover:text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleDeleteSavedSet(s.id)}
                                className="text-slate-400 hover:text-red-500"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 4: CAREER ADVISOR */}
          {activeTab === "career" && (
            <motion.div
              key="career"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-display text-base font-bold text-[#0b172a]">
                  AI career Advisor Mentor
                </h2>
                <p className="text-slate-400 text-xs font-medium font-sans">
                  Obtain readiness scores, strengths assessments, and curated 30-60-90 day planning guides.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Advisor Action Panel */}
                <div className="rounded-2xl border border-slate-100 p-5 space-y-4 bg-slate-50/20 text-center">
                  <Compass className="mx-auto h-10 w-10 text-orange-500 animate-spin-slow" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">Compile Active Profile Details</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      Merges verified credentials, courses completed, and project entries.
                    </p>
                  </div>

                  <Button
                    onClick={handleGetCareerGuidance}
                    disabled={advisorLoading}
                    variant="primary"
                    className="w-full h-10 rounded-xl font-bold shrink-0"
                  >
                    {advisorLoading ? (
                      <span className="flex items-center gap-1.5 justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Reviewing Profile...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 justify-center">
                        <Sparkles className="h-4 w-4" /> Generate Career Report
                      </span>
                    )}
                  </Button>
                </div>

                {/* Advisor Outputs Dashboard */}
                <div className="lg:col-span-2 space-y-4">
                  {careerGuidance ? (
                    <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
                      {/* Readiness score donut indicator */}
                      <div className="rounded-xl border border-slate-100 p-4 flex items-center gap-5 bg-slate-50/20">
                        <div className="relative h-16 w-16 flex items-center justify-center rounded-full border-4 border-orange-500 text-base font-black text-[#0b172a]">
                          {careerGuidance.careerReadinessScore}%
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-700">Career Readiness Rating</p>
                          <p className="text-[10px] text-slate-400 font-sans leading-relaxed mt-0.5">
                            Targeting: <span className="font-semibold text-slate-500">{selectedJobRole}</span>. Recommends: {careerGuidance.recommendedCareerPaths?.join(", ")}.
                          </p>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/10 space-y-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Strengths</span>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-655 font-sans font-medium">
                            {careerGuidance.strengths?.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                          </ul>
                        </div>
                        <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/10 space-y-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Areas for Improvement</span>
                          <ul className="list-disc pl-4 space-y-1 text-xs text-slate-655 font-sans font-medium">
                            {careerGuidance.weaknesses?.map((w: string, idx: number) => <li key={idx}>{w}</li>)}
                          </ul>
                        </div>
                      </div>

                      {/* Roadmaps */}
                      <div className="rounded-xl border border-slate-100 p-5 space-y-4">
                        <span className="text-[10px] font-bold text-[#0b172a] uppercase tracking-wider block flex items-center gap-1.5">
                          <TrendingUp className="h-4.5 w-4.5 text-orange-500" /> 30-60-90 Day Mentor Plan
                        </span>
                        
                        <div className="space-y-4">
                          {[
                            { label: "Day 1-30 Foundation", data: careerGuidance.roadmap30 },
                            { label: "Day 31-60 Optimization", data: careerGuidance.roadmap60 },
                            { label: "Day 61-90 Internship Search", data: careerGuidance.roadmap90 }
                          ].map((rm, i) => (
                            <div key={i} className="relative pl-5 border-l border-slate-100 space-y-1">
                              <span className="absolute -left-1.5 top-0.5 h-3 w-3 rounded-full bg-orange-500 border border-white"></span>
                              <span className="text-xs font-bold text-slate-800 block">{rm.label}</span>
                              <ul className="list-disc pl-4 space-y-1 text-[10.5px] text-slate-500 font-sans">
                                {rm.data?.map((itm: string, idx: number) => <li key={idx}>{itm}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-100 rounded-xl p-8 text-center bg-slate-50/20 min-h-[300px]">
                      <Compass className="h-10 w-10 text-slate-300" />
                      <p className="text-xs font-bold text-slate-400 mt-3">
                        Review your skills stack, completed courses, and generate mentor advisor scorecard.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 5: JOB RECOMMENDATIONS */}
          {activeTab === "jobs" && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-display text-base font-bold text-[#0b172a]">
                  AI Job Recommendation Engine
                </h2>
                <p className="text-slate-400 text-xs font-medium font-sans">
                  Calculate compatibility alignment scores, matched skills, and suggested career improvements.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inputs location panel */}
                <div className="space-y-4 rounded-2xl border border-slate-100 p-5 bg-slate-50/20">
                  <h3 className="font-display text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Match Preferences
                  </h3>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Preferred Location
                      </label>
                      <input
                        type="text"
                        value={jobPrefLocation}
                        onChange={(e) => setJobPrefLocation(e.target.value)}
                        placeholder="e.g. London, UK"
                        className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-655 focus:outline-none font-sans"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleGetJobRecommendations}
                    disabled={jobsLoading}
                    variant="primary"
                    className="w-full h-10 rounded-xl font-bold shrink-0"
                  >
                    {jobsLoading ? (
                      <span className="flex items-center gap-1.5 justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Matching Jobs...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 justify-center">
                        <Sparkles className="h-4 w-4" /> Recommend Jobs
                      </span>
                    )}
                  </Button>
                </div>

                {/* Job recommendation card list */}
                <div className="lg:col-span-2 space-y-4">
                  {jobRecommendations.length > 0 ? (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {jobRecommendations.map((job, idx) => (
                        <div key={idx} className="rounded-xl border border-slate-100 p-5 space-y-4 bg-slate-50/10">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <h3 className="font-display text-sm font-bold text-[#0b172a]">{job.title}</h3>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans">{job.company} • {job.location}</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-xl bg-orange-50 text-xs font-black text-orange-600 border border-orange-100">
                              {job.matchScore}% Match
                            </span>
                          </div>

                          <div className="space-y-2">
                            <p className="text-xs text-slate-655 font-sans leading-relaxed">
                              {job.matchExplanation}
                            </p>

                            {/* Skills pills */}
                            <div className="flex flex-wrap gap-1.5">
                              {job.matchedSkills?.map((sk: string) => (
                                <span key={sk} className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                                  {sk}
                                </span>
                              ))}
                              {job.missingSkills?.map((sk: string) => (
                                <span key={sk} className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-500 border border-slate-200">
                                  Missing: {sk}
                                </span>
                              ))}
                            </div>

                            {/* Eligibility suggestions */}
                            <p className="text-[10px] text-indigo-650 bg-indigo-50/30 p-2.5 rounded-lg border border-indigo-50/50 font-sans font-semibold">
                              💡 {job.eligibilitySuggestions}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-100 rounded-xl p-8 text-center bg-slate-50/20 min-h-[300px]">
                      <Briefcase className="h-10 w-10 text-slate-300" />
                      <p className="text-xs font-bold text-slate-400 mt-3">
                        Set location preferences and generate job compatibility scores.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 6: LEARNING PATH */}
          {activeTab === "learning" && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-display text-base font-bold text-[#0b172a]">
                  AI Learning Path Generator
                </h2>
                <p className="text-slate-400 text-xs font-medium font-sans">
                  Generate target skill development roadmaps and track milestone progress dynamically.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Generation triggers panel */}
                <div className="rounded-2xl border border-slate-100 p-5 space-y-4 bg-slate-50/20 text-center">
                  <Map className="mx-auto h-10 w-10 text-orange-500 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-700">Custom Syllabus Generator</p>
                    <p className="text-[10px] text-slate-400 font-sans leading-relaxed">
                      Creates a weekly practice syllabus mapping weak areas found during advisor reports.
                    </p>
                  </div>

                  <Button
                    onClick={handleGenerateLearningPath}
                    disabled={learningLoading}
                    variant="primary"
                    className="w-full h-10 rounded-xl font-bold shrink-0"
                  >
                    {learningLoading ? (
                      <span className="flex items-center gap-1.5 justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Formulating Path...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 justify-center">
                        <Sparkles className="h-4 w-4" /> Generate Learning Path
                      </span>
                    )}
                  </Button>
                </div>

                {/* Timeline display panel */}
                <div className="lg:col-span-2 space-y-4">
                  {learningPath ? (
                    <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
                      {/* Weekly progress bar */}
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/15 space-y-2">
                        <div className="flex justify-between items-center text-xs font-bold">
                          <span className="text-slate-700">Course Roadmap Milestones</span>
                          <span className="text-orange-500">{calculateLearningProgress()}% Complete</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-orange-500 transition-all duration-500"
                            style={{ width: `${calculateLearningProgress()}%` }}
                          />
                        </div>
                      </div>

                      {/* Timeline weeks */}
                      <div className="space-y-4">
                        {learningPath.weeks?.map((wk: any) => {
                          const isDone = !!completedMilestones[wk.weekNumber];
                          return (
                            <div
                              key={wk.weekNumber}
                              className={`p-4 rounded-xl border transition-all ${
                                isDone
                                  ? "border-emerald-100 bg-emerald-50/10 opacity-75"
                                  : "border-slate-100 bg-white"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1">
                                  <span className="px-2 py-0.5 rounded bg-[#0b172a] text-[9px] font-bold text-white uppercase tracking-wider">
                                    Week {wk.weekNumber}
                                  </span>
                                  <h4 className="text-xs font-black text-slate-800 pt-1">
                                    {wk.topic}
                                  </h4>
                                </div>
                                <button
                                  onClick={() => handleToggleMilestone(wk.weekNumber)}
                                  className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border ${
                                    isDone
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                                  }`}
                                >
                                  <CheckSquare className="h-3.5 w-3.5" />
                                  {isDone ? "Completed" : "Mark Done"}
                                </button>
                              </div>

                              <p className="text-[11px] text-slate-500 font-sans leading-relaxed mt-2 pl-1 border-l-2 border-slate-100">
                                {wk.details}
                              </p>

                              {/* Study Questions */}
                              {wk.practiceQuestions?.length > 0 && (
                                <div className="mt-3.5 space-y-1.5 pl-1">
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">
                                    Practice Questions
                                  </span>
                                  <ul className="list-disc pl-4 space-y-1 text-[10px] font-sans font-semibold text-slate-655">
                                    {wk.practiceQuestions.map((q: string, i: number) => <li key={i}>{q}</li>)}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-100 rounded-xl p-8 text-center bg-slate-50/20 min-h-[300px]">
                      <Map className="h-10 w-10 text-slate-300" />
                      <p className="text-xs font-bold text-slate-400 mt-3">
                        Formulate week-by-week study syllabus mapping weak fields.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
