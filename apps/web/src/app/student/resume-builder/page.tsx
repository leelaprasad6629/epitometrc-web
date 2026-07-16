"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, FileText, CheckCircle2, XCircle, Lightbulb, Save, User, 
  FileCheck, Edit3, MessageSquare, Play, Mic, MicOff, Volume2, 
  Briefcase, GraduationCap, Target, Compass, BookOpen, CheckSquare, 
  Map, Award, TrendingUp, AlertCircle, RefreshCw, Star, Trash2, ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { useResumeStore } from "@/lib/ai/store/resumeStore";

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
  // TAB 1: RESUME OPTIMIZER STATES & HANDLERS
  // ==========================================
  const [resumeLoading, setResumeLoading] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState<any>(null);
  const [resumeBioDraft, setResumeBioDraft] = useState("");

  useEffect(() => {
    if (parsedResumeDetails?.bio) {
      setResumeBioDraft(parsedResumeDetails.bio);
    }
  }, [parsedResumeDetails]);

  const handleOptimizeResume = async () => {
    setResumeLoading(true);
    try {
      const response = await fetch("/api/ai/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bio: resumeBioDraft,
          experience: studentExperience,
          projects: studentProjects,
          skills: studentSkills,
          role: selectedJobRole
        })
      });
      const data = await response.json();
      if (data.success && data.result) {
        setOptimizedResume(data.result);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleAcceptOptimization = (type: "bio" | "experience" | "projects") => {
    if (!optimizedResume) return;
    if (type === "bio") {
      updateParsedDetails({ bio: optimizedResume.optimizedBio });
      setResumeBioDraft(optimizedResume.optimizedBio);
    } else if (type === "experience") {
      updateParsedDetails({ experience: optimizedResume.optimizedExperience });
    } else if (type === "projects") {
      updateParsedDetails({ projects: optimizedResume.optimizedProjects });
    }
  };

  // ==========================================
  // TAB 2: MOCK INTERVIEW STATES & HANDLERS
  // ==========================================
  const [interviewActive, setInterviewActive] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState({
    difficulty: "Intermediate",
    type: "Technical",
    mode: "Text"
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

    const initial = `Welcome to your ${interviewConfig.difficulty} level ${interviewConfig.type} mock interview for the ${selectedJobRole} role. Could you start by introducing yourself and detailing one major engineering project you deployed?`;
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
            date: new Date().toLocaleDateString(),
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
          {/* TAB 1: RESUME OPTIMIZER */}
          {activeTab === "resume" && (
            <motion.div
              key="resume"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="font-display text-base font-bold text-[#0b172a]">
                  ATS Resume Optimizer
                </h2>
                <p className="text-slate-400 text-xs font-medium font-sans">
                  Optimize your bio biography, project descriptions, and experience using high-impact recruiter keywords.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inputs Draft Column */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Biography Summary
                    </label>
                    <textarea
                      value={resumeBioDraft}
                      onChange={(e) => setResumeBioDraft(e.target.value)}
                      rows={4}
                      className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Active Skills Stack
                    </label>
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                      {studentSkills.map((s) => (
                        <span key={s} className="px-2.5 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleOptimizeResume}
                    disabled={resumeLoading}
                    variant="primary"
                    className="w-full h-10 rounded-xl font-bold"
                  >
                    {resumeLoading ? (
                      <span className="flex items-center gap-1.5 justify-center">
                        <RefreshCw className="h-4 w-4 animate-spin" /> Optimizing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 justify-center">
                        <Sparkles className="h-4 w-4" /> Optimize Resume
                      </span>
                    )}
                  </Button>
                </div>

                {/* Optimizations Comparison Column */}
                <div className="space-y-4">
                  {optimizedResume ? (
                    <div className="space-y-4">
                      {/* Bio comparison box */}
                      <div className="rounded-xl border border-slate-100 p-4 space-y-3 bg-slate-50/20">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider">
                            Optimized Bio summary
                          </span>
                          <button
                            onClick={() => handleAcceptOptimization("bio")}
                            className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg"
                          >
                            <FileCheck className="h-3 w-3" /> Accept
                          </button>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium">
                          {optimizedResume.optimizedBio}
                        </p>
                      </div>

                      {/* Keywords suggested box */}
                      <div className="rounded-xl border border-dashed border-slate-200 p-4 space-y-3 bg-slate-50/10">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                          <Lightbulb className="h-4 w-4" /> Suggested ATS Keywords
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {optimizedResume.suggestedKeywords?.map((kw: string) => (
                            <span key={kw} className="px-2 py-0.5 rounded-lg bg-indigo-50 text-[10px] font-bold text-indigo-700 border border-indigo-100">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Missing skills box */}
                      {optimizedResume.missingSkills?.length > 0 && (
                        <div className="rounded-xl border border-amber-100 bg-amber-50/20 p-4 space-y-2">
                          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 uppercase tracking-wider">
                            <AlertCircle className="h-4 w-4 text-amber-500" /> Missing Resume Sections / Skills
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {optimizedResume.missingSkills.map((sk: string) => (
                              <span key={sk} className="px-2 py-0.5 rounded-lg bg-amber-50 text-[10px] font-bold text-amber-700 border border-amber-200">
                                {sk}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center border border-dashed border-slate-100 rounded-xl p-8 text-center bg-slate-50/20">
                      <FileText className="h-10 w-10 text-slate-300" />
                      <p className="text-xs font-bold text-slate-400 mt-3">
                        Optimize your details to compare original vs AI refactored keywords.
                      </p>
                    </div>
                  )}
                </div>
              </div>
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
                      Setup Simulator
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Interview Type
                        </label>
                        <select
                          value={interviewConfig.type}
                          onChange={(e) => setInterviewConfig({ ...interviewConfig, type: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none"
                        >
                          <option value="Technical">Technical</option>
                          <option value="HR">HR / General</option>
                          <option value="Behavioral">Behavioral</option>
                          <option value="Coding">Coding Logic</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Difficulty Level
                        </label>
                        <select
                          value={interviewConfig.difficulty}
                          onChange={(e) => setInterviewConfig({ ...interviewConfig, difficulty: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Verbal Audio mode
                        </label>
                        <select
                          value={interviewConfig.mode}
                          onChange={(e) => setInterviewConfig({ ...interviewConfig, mode: e.target.value })}
                          className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none"
                        >
                          <option value="Text">Text-Only Mode</option>
                          <option value="Voice">Voice Speech Mode</option>
                        </select>
                      </div>
                    </div>

                    <Button
                      onClick={handleStartInterview}
                      variant="primary"
                      className="w-full h-10 rounded-xl font-bold shrink-0"
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
                          <div key={idx} className="pt-2 flex justify-between items-center text-xs">
                            <div>
                              <p className="font-bold text-slate-700">{hist.role} ({hist.type})</p>
                              <p className="text-[10px] text-slate-400 font-medium font-sans">{hist.date}</p>
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
                <div className="rounded-2xl border border-slate-100 p-6 space-y-6 shadow-md max-w-3xl mx-auto">
                  <div className="text-center space-y-2 pb-4 border-b border-slate-50">
                    <div className="inline-flex items-center justify-center p-3.5 bg-emerald-50 rounded-full border border-emerald-100 text-emerald-500">
                      <Award className="h-8 w-8" />
                    </div>
                    <h3 className="font-display text-lg font-bold text-[#0b172a]">
                      Interview Screen Completed!
                    </h3>
                    <p className="text-slate-400 text-xs font-sans">
                      Overall evaluation scorecard generated dynamically.
                    </p>
                  </div>

                  {/* Subscore metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {[
                      { label: "Overall Score", value: currentReport.overallScore, color: "text-orange-500 bg-orange-50 border-orange-100" },
                      { label: "Technical", value: currentReport.technicalScore, color: "text-blue-500 bg-blue-50 border-blue-100" },
                      { label: "Communication", value: currentReport.communicationScore, color: "text-indigo-500 bg-indigo-50 border-indigo-100" },
                      { label: "Fluency", value: currentReport.fluencyScore, color: "text-pink-500 bg-pink-50 border-pink-100" },
                      { label: "Confidence", value: currentReport.confidenceScore, color: "text-emerald-500 bg-emerald-50 border-emerald-100" }
                    ].map((m, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border text-center ${m.color}`}>
                        <span className="text-[9px] font-black uppercase tracking-wider block opacity-75">{m.label}</span>
                        <p className="text-2xl font-black mt-1 leading-none">{m.value}%</p>
                      </div>
                    ))}
                  </div>

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

                  {/* Recommended learning topics */}
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 space-y-2 bg-slate-50/20">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" /> Recommended Learning Topics
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {currentReport.learningTopics?.map((t: string, i: number) => (
                        <span key={i} className="px-2.5 py-0.5 rounded bg-white border border-slate-100 text-[10px] font-bold text-slate-655">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => setCurrentReport(null)}
                    variant="outline"
                    className="w-full h-10 rounded-xl font-bold"
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
