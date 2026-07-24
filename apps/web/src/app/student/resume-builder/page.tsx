"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, FileText, CheckCircle2, XCircle, Lightbulb, Save, User, 
  FileCheck, Edit3, MessageSquare, Play, Mic, MicOff, Volume2, 
  Briefcase, GraduationCap, Target, Compass, BookOpen, CheckSquare, 
  Map, Award, TrendingUp, AlertCircle, RefreshCw, Star, Trash2, ArrowRight,
  Globe, FileUp, Copy, Download, Check, Info, Calendar, ChevronRight, Loader2,
  Send, Brain, VideoOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { useResumeStore, CareerGoal, ResumeVersion } from "@/lib/ai/store/resumeStore";
import { Input } from "@/components/ui/input";

type TabId = "dashboard" | "resume" | "learning" | "interview" | "career" | "jobs";

export default function AICareerCopilotPage() {
  const { 
    fileName, 
    parsedResumeDetails, 
    selectedJobRole, 
    updateParsedDetails, 
    setSelectedJobRole,
    loadProfileFromServer,
    atsScore,
    matchScore,
    skillMatchPercentage,
    keywordMatchPercentage,
    experienceMatchPercentage,
    matchedSkills,
    missingSkills,
    missingKeywords,
    strengths,
    improvements,
    recommendations,
    certRecommendations,
    projectRecommendations,
    deleteResume,
    setCareerGoal,
    addResumeVersion,
    rollbackToVersion,
    completeCourseInStore,
    rejectSuggestionInStore,
    setResumeData,
    saveInterviewSession
  } = useResumeStore();

  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [setupStep, setSetupStep] = useState<"upload" | "goal">("upload");

  // Local state for setup inputs
  const [targetTitle, setTargetTitle] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [targetJd, setTargetJd] = useState("");
  const [jdMode, setJdMode] = useState<"paste" | "select" | "file">("paste");
  
  // Jobs API state
  const [platformJobs, setPlatformJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState("");
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobsError, setJobsError] = useState("");

  // Loading states
  const [uploadLoading, setUploadLoading] = useState(false);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [optimizedResume, setOptimizedResume] = useState<any>(null);

  // Suggested optimizations reviews
  const [editingSuggestionId, setEditingSuggestionId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [selectedOptimTab, setSelectedOptimTab] = useState<"available" | "better" | "missing">("available");

  // Compiled resume text view
  const [compiledMode, setCompiledMode] = useState(false);

  // Local states for mock interview
  const [questions, setQuestions] = useState<any[]>([]);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [companyProfile, setCompanyProfile] = useState<any>(null);

  // New Live Mock Interview Session states
  const [mockSessionActive, setMockSessionActive] = useState(false);
  const [mockLoading, setMockLoading] = useState(false);
  const [mockQuestion, setMockQuestion] = useState("");
  const [mockAnswer, setMockAnswer] = useState("");
  const [mockCount, setMockCount] = useState(0);
  const [mockHistory, setMockHistory] = useState<any[]>([]);
  const [mockFinished, setMockFinished] = useState(false);
  const [mockReport, setMockReport] = useState<any | null>(null);
  const [mockIsListening, setMockIsListening] = useState(false);
  const [mockError, setMockError] = useState("");
  const [mockSpeakActive, setMockSpeakActive] = useState(false);
  const [mockStream, setMockStream] = useState<MediaStream | null>(null);
  const mockVideoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Integrity & Onboarding states
  const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  const [violationLog, setViolationLog] = useState<string[]>([]);
  const [showViolationAlert, setShowViolationAlert] = useState("");

  // Technical Coding Interview states
  const [isCodingQuestion, setIsCodingQuestion] = useState(false);
  const [codeTemplate, setCodeTemplate] = useState("");
  const [codeSubmission, setCodeSubmission] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("javascript");
  const [compilerOutput, setCompilerOutput] = useState("");
  const [compilerRunning, setCompilerRunning] = useState(false);

  // Listen for integrity violations during active screen
  useEffect(() => {
    if (!mockSessionActive || mockFinished) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        logViolation("Exited fullscreen mode");
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        logViolation("Switched browser tabs or minimized window");
      }
    };

    const handleWindowBlur = () => {
      logViolation("Lost window focus");
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
    };
  }, [mockSessionActive, mockFinished, violationCount, violationLog]);

  const logViolation = (type: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const violationMessage = `${type} at ${timestamp}`;
    const nextCount = violationCount + 1;

    setViolationCount(nextCount);
    const updatedLog = [...violationLog, violationMessage];
    setViolationLog(updatedLog);

    if (nextCount >= 3) {
      terminateSessionDueToCheating(updatedLog);
    } else {
      setShowViolationAlert(`INTEGRITY WARNING: Attempting to switch tabs, exit full-screen, or lose window focus is prohibited. Warning count: ${nextCount} of 3. Reach 3 to terminate FAIL.`);
    }
  };

  const terminateSessionDueToCheating = (logs: string[]) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (mockIsListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setMockIsListening(false);
    }
    if (mockStream) {
      mockStream.getTracks().forEach((track) => track.stop());
      setMockStream(null);
    }

    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    const failedReport = {
      overallScore: 0,
      technicalScore: 0,
      communicationScore: 0,
      confidenceScore: 0,
      problemSolvingScore: 0,
      strengths: ["None (Terminated)"],
      weaknesses: ["Terminated due to multiple integrity violations"],
      improvements: ["Maintain full screen focus and avoid switching tabs during official screens."],
      learningTopics: ["Ethics and Professional Conduct"],
      recruiterScorecard: {
        hiringRecommendation: "No Hire / Flagged",
        candidateReadiness: "Unprepared",
        suitableRoles: [],
        skillGaps: ["Integrity Violations Detected"],
        interviewSummary: `Session automatically terminated at warning threshold. Violation log: ${logs.join("; ")}`,
        overallImpression: "Candidate repeatedly left the screen, exited fullscreen, or switched tabs."
      }
    };

    setMockFinished(true);
    setMockReport(failedReport);

    const session = {
      sessionId: `INT_${new Date().getTime()}_FLG`,
      timestamp: new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString(),
      role: targetTitle,
      company: targetCompany,
      score: 0,
      hiringRecommendation: "No Hire / Flagged",
      report: failedReport
    };
    saveInterviewSession(session);
  };

  const runMockCompiler = () => {
    if (compilerRunning) return;
    setCompilerRunning(true);
    setCompilerOutput("Running test cases...");

    setTimeout(() => {
      const randomSuccess = Math.random() > 0.15;
      if (randomSuccess) {
        setCompilerOutput("Test case 1/3: SUCCESS\nTest case 2/3: SUCCESS\nTest case 3/3: SUCCESS\n\nAll test cases passed successfully!");
      } else {
        setCompilerOutput("Test case 1/3: SUCCESS\nTest case 2/3: FAILURE (Expected 42, Got undefined)\n\nBuild aborted due to test case failure.");
      }
      setCompilerRunning(false);
    }, 1200);
  };

  // Initialize speech recognition for live mock
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = false;
        recog.lang = "en-US";

        recog.onresult = (event: any) => {
          const resultText = event.results[event.results.length - 1][0].transcript;
          setMockAnswer(prev => (prev ? prev + " " + resultText : resultText));
        };

        recog.onerror = (event: any) => {
          console.error("Speech Recognition Error:", event.error);
          setMockError(`Microphone connection error: ${event.error}. Please type manually if needed.`);
          setMockIsListening(false);
        };

        recog.onend = () => {
          setMockIsListening(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  const speakMockText = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      utterance.onstart = () => setMockSpeakActive(true);
      utterance.onend = () => setMockSpeakActive(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startLiveMockSession = () => {
    if (!parsedResumeDetails) {
      alert("Please upload and optimize your resume in the 'Resume Optimizer' tab first to provide personalized profile context for the interview.");
      return;
    }
    setShowFullscreenWarning(true);
  };

  const enterFullscreenAndStart = () => {
    setShowFullscreenWarning(false);
    setMockHistory([]);
    setMockFinished(false);
    setMockReport(null);
    setMockAnswer("");
    setMockError("");
    setViolationCount(0);
    setViolationLog([]);
    setShowViolationAlert("");
    setIsCodingQuestion(false);
    setCodeSubmission("");
    setCompilerOutput("");

    // Request fullscreen mode
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    // Capture user webcam video stream
    if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          setMockStream(stream);
          setTimeout(() => {
            if (mockVideoRef.current) {
              mockVideoRef.current.srcObject = stream;
            }
          }, 300);
        })
        .catch((err) => {
          console.warn("Camera request blocked or failed:", err);
          setMockError("Webcam access failed/denied. Running in audio-only mode.");
        });
    }

    const primaryLang = parsedResumeDetails?.programmingLanguages?.[0] || parsedResumeDetails?.technicalSkills?.[0] || "Software Engineering principles";
    const primaryProject = parsedResumeDetails?.projects?.[0]?.projectTitle || "your projects list";

    const initialQ = `Hello! Welcome to your AI mock interview screening for the ${targetTitle} role at ${targetCompany}. Looking at your technical profile highlighting experience in ${primaryLang} and projects like "${primaryProject}", could you explain the architecture of this project and describe the most difficult system scaling challenge you solved?`;

    setMockCount(1);
    setMockQuestion(initialQ);
    setMockSessionActive(true);

    setTimeout(() => speakMockText(initialQ), 400);
  };

  const toggleMockListening = () => {
    if (!recognitionRef.current) {
      setMockError("Speech Recognition API is not supported in this browser. Please use Google Chrome or type manually.");
      return;
    }

    setMockError("");
    if (mockIsListening) {
      recognitionRef.current.stop();
      setMockIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setMockIsListening(true);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const submitMockAnswer = async () => {
    if (!mockAnswer.trim() || mockLoading) return;
    setMockLoading(true);

    if (mockIsListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setMockIsListening(false);
    }

    try {
      const res = await fetch("/api/ai/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: targetTitle,
          company: targetCompany,
          jobDescription: targetJd,
          question: mockQuestion,
          answer: mockAnswer,
          history: mockHistory,
          resumeContext: parsedResumeDetails,
          codeSubmission: isCodingQuestion ? codeSubmission : "",
          codeLanguage: isCodingQuestion ? codeLanguage : ""
        })
      });

      const data = await res.json();
      if (res.ok && data.success && data.result) {
        const r = data.result;
        
        // Append user turn to history
        const updatedHistory = [
          ...mockHistory,
          { role: "assistant", content: mockQuestion },
          { role: "user", content: mockAnswer }
        ];
        setMockHistory(updatedHistory);

        // Update coding environment states
        if (r.isCodingQuestion) {
          setIsCodingQuestion(true);
          setCodeTemplate(r.codeTemplate || "");
          setCodeSubmission(r.codeTemplate || "");
          setCompilerOutput("");
        } else {
          setIsCodingQuestion(false);
        }

        if (r.report) {
          setMockFinished(true);
          setMockReport(r.report);
          
          if (mockStream) {
            mockStream.getTracks().forEach((track) => track.stop());
            setMockStream(null);
          }
          
          if (document.fullscreenElement) {
            document.exitFullscreen().catch(() => {});
          }

          // Save interview session to database store
          const session = {
            sessionId: `INT_${new Date().getTime()}`,
            timestamp: new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString(),
            role: targetTitle,
            company: targetCompany,
            score: r.report.overallScore || 80,
            hiringRecommendation: r.report.recruiterScorecard?.hiringRecommendation || "Hold",
            report: r.report
          };
          saveInterviewSession(session);
        } else {
          setMockCount(prev => prev + 1);
          setMockQuestion(r.nextQuestion);
          setMockAnswer("");
          setTimeout(() => speakMockText(r.nextQuestion), 400);
        }
      } else {
        setMockError("Failed to parse interview response.");
      }
    } catch (err: any) {
      setMockError("Connection error. Please try again: " + err.message);
    } finally {
      setMockLoading(false);
    }
  };

  const closeMockSession = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (mockIsListening && recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if (mockStream) {
      mockStream.getTracks().forEach((track) => track.stop());
      setMockStream(null);
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setMockSessionActive(false);
  };

  // Fetch jobs on mount
  useEffect(() => {
    loadProfileFromServer();
    setJobsLoading(true);
    setJobsError("");
    fetch("/api/jobs")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.jobs)) {
          setPlatformJobs(data.jobs);
        } else {
          setJobsError("Failed to parse jobs list format.");
        }
      })
      .catch((e) => {
        console.error("Failed to load jobs list", e);
        setJobsError("Jobs catalog currently offline.");
      })
      .finally(() => {
        setJobsLoading(false);
      });
  }, [loadProfileFromServer]);

  // Read initial tab parameter from URL query string if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam && ["dashboard", "resume", "interview", "career"].includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  // Sync inputs if careerGoal already exists in store
  useEffect(() => {
    if (parsedResumeDetails?.careerGoal) {
      setTargetTitle(parsedResumeDetails.careerGoal.targetRole || "");
      setTargetCompany(parsedResumeDetails.careerGoal.targetCompany || "");
      setTargetJd(parsedResumeDetails.careerGoal.targetJobDescription || "");
    }
  }, [parsedResumeDetails?.careerGoal]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
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
          alert("Parsing service unavailable.");
          return;
        }

        const data = await res.json();
        if (data.success) {
          setResumeData(file.name, base64Data, file.type || "application/pdf", data.result, data.confidenceScores);
          setSetupStep("goal");
        } else {
          alert(data.error || "Parsing failed.");
        }
      } catch (err: any) {
        alert("Error parsing resume: " + err.message);
      } finally {
        setUploadLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const launchCareerCopilot = async () => {
    if (!targetTitle.trim() || !targetCompany.trim() || !targetJd.trim()) {
      alert("Please fill in all Career Goal fields.");
      return;
    }

    setCopilotLoading(true);
    try {
      const goal: CareerGoal = {
        targetRole: targetTitle,
        targetCompany: targetCompany,
        targetJobDescription: targetJd,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCareerGoal(goal);

      // 1. Run ATS matching and missing skills analyzer
      const matchRes = await fetch("/api/ai/resume-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText: JSON.stringify(parsedResumeDetails),
          jobDescription: targetJd
        })
      });
      const matchData = await matchRes.json();
      if (matchData.success && matchData.result) {
        const r = matchData.result;
        useResumeStore.setState({
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
      }

      // 2. Run section suggestion builder
      const builderRes = await fetch("/api/ai/resume-builder", {
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
      const builderData = await builderRes.json();
      if (builderData.success && builderData.result) {
        setOptimizedResume(builderData.result);
      }

      // 3. Generate detailed company profile OA & style
      setCompanyProfile({
        name: targetCompany,
        style: "Technical OA (HackerRank/CodeSignal) followed by 2 system design rounds and a behavioral bar raiser.",
        rounds: "1 Online Assessment + 2 Coding Rounds + 1 System Design + 1 Hiring Manager review",
        oaPattern: "Focuses heavily on Arrays, Strings, Trees, and dynamic programming optimization.",
        behavioral: "Evaluates ownership, customer obsession, and collaboration principles.",
        skills: "React, Next.js, Node.js, AWS Cloud, Docker",
        tech: "Modern JS stacks with TypeScript"
      });

      // Clear layout toggles
      setCompiledMode(false);
      setActiveTab("dashboard");

    } catch (e: any) {
      alert("Failed to analyze goal: " + e.message);
    } finally {
      setCopilotLoading(false);
    }
  };

  const handleJdFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setTargetJd(event.target?.result?.toString() || "");
    };
    reader.readAsText(file);
  };

  const handleAcceptSuggestion = (sug: any, type: "available" | "better") => {
    if (!parsedResumeDetails) return;

    // Create rollback snapshot before changing
    const versionId = `V${(parsedResumeDetails.resumeVersions?.length || 0) + 1}`;
    const version: ResumeVersion = {
      versionId,
      timestamp: new Date().toLocaleTimeString() + " " + new Date().toLocaleDateString(),
      targetCompany: targetCompany,
      targetRole: targetTitle,
      jobDescriptionText: targetJd,
      parsedResumeSnapshot: JSON.parse(JSON.stringify(parsedResumeDetails)),
      changeSummary: `Accepted suggestions for ${sug.section || "profile details"}.`,
      generalAtsScore: atsScore,
      jobMatchScore: matchScore
    };

    addResumeVersion(version);

    if (sug.section === "summary") {
      updateParsedDetails({ bio: sug.suggestedText });
    } else if (sug.section === "experience" && typeof sug.index === "number") {
      const updated = [...(parsedResumeDetails.experience || [])];
      if (updated[sug.index]) {
        updated[sug.index].responsibilities = sug.suggestedText;
        updateParsedDetails({ experience: updated });
      }
    } else if (sug.section === "projects" && typeof sug.index === "number") {
      const updated = [...(parsedResumeDetails.projects || [])];
      if (updated[sug.index]) {
        updated[sug.index].description = sug.suggestedText;
        updateParsedDetails({ projects: updated });
      }
    } else if (sug.section === "skills") {
      const updated = [...(parsedResumeDetails.technicalSkills || [])];
      if (!updated.includes(sug.suggestedText)) {
        updated.push(sug.suggestedText);
        updateParsedDetails({ technicalSkills: updated });
      }
    }

    // Filter accepted out of local list
    if (type === "available") {
      setOptimizedResume((prev: any) => ({
        ...prev,
        alreadyAvailable: prev.alreadyAvailable.filter((x: any) => x.id !== sug.id)
      }));
    } else {
      setOptimizedResume((prev: any) => ({
        ...prev,
        betterPresentation: prev.betterPresentation.filter((x: any) => x.id !== sug.id)
      }));
    }
  };

  const handleEditSuggestion = (sug: any) => {
    setEditingSuggestionId(sug.id);
    setEditingText(sug.suggestedText);
  };

  const handleSaveSuggestionEdit = (sug: any, type: "available" | "better") => {
    const updatedSug = { ...sug, suggestedText: editingText };
    handleAcceptSuggestion(updatedSug, type);
    setEditingSuggestionId(null);
  };

  const handleGenerateQuestions = async () => {
    setInterviewLoading(true);
    try {
      const res = await fetch("/api/ai/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: targetTitle,
          company: targetCompany,
          jobDescription: targetJd,
          skills: parsedResumeDetails?.technicalSkills || [],
          experience: parsedResumeDetails?.experience || []
        })
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.questions)) {
        setQuestions(data.questions);
      } else {
        alert("Failed to load interview prep questions.");
      }
    } catch (e: any) {
      alert("Error loading prep questions: " + e.message);
    } finally {
      setInterviewLoading(false);
    }
  };

  const copyOptimizedMarkdown = () => {
    const md = compileMarkdownText();
    navigator.clipboard.writeText(md);
    alert("ATS formatted markdown resume copied to clipboard!");
  };

  const downloadOptimizedMarkdown = () => {
    const md = compileMarkdownText();
    const element = document.createElement("a");
    const file = new Blob([md], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${parsedResumeDetails?.fullName?.replace(/\s+/g, "_") || "Tailored"}_Resume.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const compileMarkdownText = () => {
    const p = parsedResumeDetails;
    if (!p) return "";
    let txt = `# ${p.fullName || "Your Name"}\n`;
    if (p.email || p.phone || p.location) {
      txt += `${p.email || ""} | ${p.phone || ""} | ${p.location || ""}\n`;
    }
    const links = [p.linkedin, p.github, p.portfolioWebsite].filter(Boolean);
    if (links.length > 0) {
      txt += `${links.join(" | ")}\n`;
    }
    txt += `\n---\n\n## PROFESSIONAL SUMMARY\n${p.bio || "No summary specified."}\n\n`;
    
    if (p.education?.length > 0) {
      txt += `## EDUCATION\n`;
      p.education.forEach(e => {
        txt += `* **${e.degree} ${e.branch ? `in ${e.branch}` : ""}** - ${e.institution || e.university} (${e.startYear || ""} - ${e.endYear || ""}) GPA: ${e.cgpa || ""}\n`;
      });
      txt += `\n`;
    }
    
    if (p.experience?.length > 0) {
      txt += `## WORK HISTORY\n`;
      p.experience.forEach(exp => {
        txt += `### ${exp.role} - ${exp.companyName}\n`;
        txt += `*${exp.startDate} - ${exp.endDate} (${exp.employmentType || "Full-Time"})*\n`;
        txt += `${exp.responsibilities}\n\n`;
      });
    }

    if (p.projects?.length > 0) {
      txt += `## ACADEMIC PROJECTS\n`;
      p.projects.forEach(proj => {
        txt += `### ${proj.projectTitle}\n`;
        txt += `*Duration: ${proj.duration || "N/A"}*\n`;
        txt += `${proj.description}\n`;
        if (proj.technologiesUsed?.length > 0) {
          txt += `*Technologies:* ${proj.technologiesUsed.join(", ")}\n`;
        }
        txt += `\n`;
      });
    }

    if (p.technicalSkills?.length > 0) {
      txt += `## TECHNICAL SKILLS\n`;
      txt += `* ${p.technicalSkills.join(", ")}\n`;
    }

    return txt;
  };

  const handleJobChange = (jobId: string) => {
    setSelectedJobId(jobId);
    if (!jobId) {
      setTargetTitle("");
      setTargetCompany("");
      setTargetJd("");
      return;
    }
    const job = platformJobs.find(j => j.id === jobId);
    if (job) {
      setTargetTitle(job.title || "");
      setTargetCompany(job.company || "Epitome Partner");
      setTargetJd(job.description || "");
    }
  };

  // CHECK CONTEXT STAGE
  const hasResume = !!parsedResumeDetails;
  const hasGoal = !!parsedResumeDetails?.careerGoal;

  return (
    <div className="min-h-screen bg-[#FAFBFF] text-slate-800 flex flex-col p-4 md:p-6 lg:p-8 font-sans overflow-x-hidden relative">
      
      {/* Visual background blurs & Shifting gradient meshes */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-violet-200/40 blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-20 right-10 w-[500px] h-[500px] rounded-full bg-blue-200/30 blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-orange-100/50 blur-3xl -z-10 pointer-events-none" />

      {/* Floating Animated Connection Nodes SVG Background */}
      <div className="absolute inset-0 -z-20 opacity-[0.06] pointer-events-none select-none overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="#4f46e5" strokeWidth="1" />
          <line x1="30%" y1="40%" x2="50%" y2="15%" stroke="#4f46e5" strokeWidth="1" />
          <line x1="50%" y1="15%" x2="70%" y2="35%" stroke="#ea580c" strokeWidth="1" />
          <line x1="70%" y1="35%" x2="90%" y2="10%" stroke="#4f46e5" strokeWidth="1" />
          <line x1="30%" y1="40%" x2="20%" y2="70%" stroke="#ea580c" strokeWidth="1" />
          <line x1="50%" y1="15%" x2="60%" y2="60%" stroke="#4f46e5" strokeWidth="1" />
          <line x1="70%" y1="35%" x2="75%" y2="80%" stroke="#4f46e5" strokeWidth="1" />
          <circle cx="10%" cy="20%" r="4" fill="#4f46e5" className="animate-ping" />
          <circle cx="30%" cy="40%" r="5" fill="#4f46e5" />
          <circle cx="50%" cy="15%" r="4" fill="#ea580c" />
          <circle cx="70%" cy="35%" r="5" fill="#4f46e5" />
          <circle cx="90%" cy="10%" r="4" fill="#4f46e5" />
          <circle cx="20%" cy="70%" r="5" fill="#ea580c" />
          <circle cx="60%" cy="60%" r="4" fill="#4f46e5" />
          <circle cx="75%" cy="80%" r="5" fill="#4f46e5" />
        </svg>
      </div>

      {/* SETUP WIZARD (Unconfigured Context Mode) */}
      {(!hasResume || !hasGoal) ? (
        <div className="max-w-4xl mx-auto w-full my-auto flex flex-col gap-8 text-center py-10 z-10">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-wider uppercase bg-orange-500/10 text-orange-600 border border-orange-500/20 shadow-xs">
              <Sparkles className="h-3.5 w-3.5 text-orange-500 animate-pulse" /> Flagship AI Feature
            </span>
            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 leading-tight tracking-tight">
              AI Career Copilot
            </h1>
            <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              Redesigning your placement journey. Feed the Copilot your resume and target role to begin a unified preparation path.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden transition-all duration-300">
            
            {/* Step 1: Upload Resume */}
            {setupStep === "upload" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">Step 1: Upload Your Resume</h3>
                  <p className="text-xs text-slate-500">The single source of truth for your profile details.</p>
                </div>

                <div className="border-2 border-dashed border-slate-200 hover:border-violet-300 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition-all bg-slate-50/50 relative hover:bg-slate-50">
                  {uploadLoading ? (
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="h-8 w-8 text-violet-600 animate-spin" />
                      <span className="text-xs font-bold text-slate-600">Reading PDF layouts & extracting details...</span>
                    </div>
                  ) : (
                    <>
                      <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-xs">
                        <FileUp className="h-6 w-6 text-violet-500 animate-bounce" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800">Drag and drop your file here, or click to browse</p>
                        <p className="text-[10px] text-slate-405">Supports PDF, DOCX, and TXT formats</p>
                      </div>
                      <label className="cursor-pointer">
                        <span className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md transition-all">
                          Select File
                        </span>
                        <input type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleResumeUpload} className="hidden" />
                      </label>
                    </>
                  )}
                </div>

                {hasResume && (
                  <div className="flex justify-between items-center bg-green-50/60 p-3.5 border border-green-100 rounded-2xl">
                    <div className="flex items-center gap-2 text-left">
                      <Check className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs font-bold text-green-900">{fileName}</p>
                        <p className="text-[9px] text-green-700">Parsed successfully</p>
                      </div>
                    </div>
                    <button onClick={() => setSetupStep("goal")} className="text-xs font-bold text-violet-600 flex items-center gap-0.5 hover:text-violet-500">
                      Next Step <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Goal Configuration */}
            {setupStep === "goal" && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 flex items-center justify-center gap-1.5">
                    Step 2: Define Career Target
                  </h3>
                  <p className="text-xs text-slate-500">All AI modules will automatically optimize against this target.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Target Job Title</span>
                    <Input 
                      type="text" 
                      placeholder="e.g. Senior Frontend Engineer" 
                      value={targetTitle} 
                      onChange={e => setTargetTitle(e.target.value)} 
                      className="bg-white border-slate-200 text-slate-800 h-9 text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Target Company</span>
                    <Input 
                      type="text" 
                      placeholder="e.g. Stripe, Microsoft" 
                      value={targetCompany} 
                      onChange={e => setTargetCompany(e.target.value)} 
                      className="bg-white border-slate-200 text-slate-800 h-9 text-xs" 
                    />
                  </div>
                </div>

                <div className="space-y-2 text-left">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block">Target Job Description</span>
                  
                  <div className="flex gap-2 border-b border-slate-100 pb-2">
                    {[
                      { id: "paste", label: "Paste JD Text" },
                      { id: "select", label: "Select Platform Job" },
                      { id: "file", label: "Upload JD File" }
                    ].map(mode => (
                      <button 
                        key={mode.id} 
                        onClick={() => {
                          setJdMode(mode.id as any);
                          if (mode.id === "select" && platformJobs.length > 0) {
                            handleJobChange(platformJobs[0].id);
                          }
                        }}
                        className={`px-3 py-1 rounded-xl text-[10px] font-black transition-all ${
                          jdMode === mode.id 
                            ? "bg-slate-900 text-white shadow-sm" 
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                      onChange={e => setTargetJd(e.target.value)} 
                      className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-slate-800 h-32 focus:outline-none focus:border-slate-350" 
                    />
                  )}

                  {jdMode === "select" && (
                    <div className="space-y-2">
                      {jobsLoading ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500 py-3">
                          <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                          <span>Loading active platform jobs list...</span>
                        </div>
                      ) : jobsError ? (
                        <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 flex items-center gap-1.5">
                          <AlertCircle className="h-4 w-4" /> {jobsError}
                        </div>
                      ) : platformJobs.length === 0 ? (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-1.5">
                          <Info className="h-4 w-4 text-slate-400" /> No jobs available in the platform database.
                        </div>
                      ) : (
                        <select
                          value={selectedJobId}
                          onChange={e => handleJobChange(e.target.value)}
                          className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-violet-500"
                        >
                          <option value="">-- Select a Platform Job --</option>
                          {platformJobs.map(job => (
                            <option key={job.id} value={job.id}>{job.title} at {job.company || "Epitome Partner"}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  )}

                  {jdMode === "file" && (
                    <div className="border-2 border-dashed border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-center bg-slate-50/50">
                      <FileUp className="h-5 w-5 text-slate-400 mb-2" />
                      <span className="text-[10px] text-slate-500 font-bold mb-3">Upload JD .txt or .md file</span>
                      <label className="cursor-pointer">
                        <span className="h-8 px-3 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs inline-flex items-center">Browse</span>
                        <input type="file" accept=".txt,.md" onChange={handleJdFileUpload} className="hidden" />
                      </label>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={() => setSetupStep("upload")} className="h-10 px-4 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-all">
                    Back
                  </button>
                  <button 
                    disabled={copilotLoading}
                    onClick={launchCareerCopilot}
                    className="flex-1 h-10 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                  >
                    {copilotLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Synthesizing AI Copilot Environment...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" /> Launch Career Copilot
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CORE COPILOT ACTIVE VIEW */
        <div className="max-w-6xl mx-auto w-full flex flex-col gap-6 z-10">
          
          {/* Unified AI Context Header Bar */}
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/60 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-orange-500 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-200 px-2 py-0.5 rounded-full uppercase tracking-wider">Active Target</span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">Source: {fileName}</span>
                </div>
                <h2 className="text-sm font-black text-slate-800">
                  {targetCompany} &bull; {targetTitle}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  deleteResume();
                  setSetupStep("upload");
                }}
                className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 bg-white text-slate-600 hover:text-slate-800 font-bold text-xs transition-all flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Re-configure Copilot
              </button>
            </div>
          </div>

          {/* Unified Journey Navigation Bar */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
            {[
              { id: "dashboard", label: "Dashboard Overview", icon: Compass },
              { id: "resume", label: "Resume Optimizer", icon: FileText },
              { id: "learning", label: "Skill Gap & learning", icon: Map },
              { id: "interview", label: "Interview Prep", icon: MessageSquare },
              { id: "career", label: "Actionable Coach", icon: Calendar },
              { id: "jobs", label: "Job Recommendations", icon: Briefcase }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-md" 
                      : "bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Render Active Tab */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/60 p-6 min-h-[500px] shadow-xl relative transition-all duration-350">
            
            {/* Tab: Dashboard */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                
                {/* 1. Placement Progress Journey */}
                <div className="bg-[#F4F6FC]/60 border border-slate-150 p-6 rounded-2xl space-y-4">
                  <div className="text-left space-y-1">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block">Copilot Journey Tracker</span>
                    <h3 className="text-base font-bold text-slate-800">Preparing for placement at {targetCompany} as {targetTitle}</h3>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    {[
                      { label: "Resume Uploaded", done: true },
                      { label: "Resume Parsed", done: true },
                      { label: "Profile Generated", done: true },
                      { label: "ATS Analysis", done: atsScore > 0 },
                      { label: "Skill Gap", done: missingSkills?.length > 0 },
                      { label: "Resume Ready", done: (parsedResumeDetails?.resumeVersions?.length || 0) > 0 },
                      { label: "Interview Ready", done: questions.length > 0 },
                      { label: "Ready to Apply", done: ((parsedResumeDetails?.resumeVersions?.length || 0) > 0) && (questions.length > 0) }
                    ].map((step, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full flex items-center justify-center border font-mono text-[10px] font-black ${
                          step.done 
                            ? "bg-green-500/10 border-green-500/20 text-green-600" 
                            : "bg-slate-200 border-slate-300 text-slate-500"
                        }`}>
                          {step.done ? "✓" : idx + 1}
                        </div>
                        <span className={`text-xs font-bold ${step.done ? "text-slate-800" : "text-slate-400"}`}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Cockpit scorecards grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* General ATS Score card */}
                  <div className="bg-white border border-slate-150 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-xs">
                    <div className="text-left w-full">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">General ATS Compatibility</span>
                    </div>
                    {atsScore > 0 ? (
                      <div className="relative h-28 w-28 flex items-center justify-center">
                        <svg className="h-full w-full transform -rotate-90">
                          <circle cx="56" cy="56" r="45" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                          <circle cx="56" cy="56" r="45" stroke="#8b5cf6" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 - (atsScore / 100) * (2 * Math.PI * 45)} strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-xl font-mono font-black text-slate-800">{atsScore}%</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 py-10 font-mono uppercase tracking-widest">Insufficient Data</span>
                    )}
                    <span className="text-[10px] text-slate-500 leading-normal">Evaluates structural layout, section formatting, and readable headers.</span>
                  </div>

                  {/* Job Match Score card */}
                  <div className="bg-white border border-slate-150 p-5 rounded-2xl flex flex-col items-center justify-center text-center gap-3 shadow-xs">
                    <div className="text-left w-full">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Role Match Alignment</span>
                    </div>
                    {matchScore > 0 ? (
                      <div className="relative h-28 w-28 flex items-center justify-center">
                        <svg className="h-full w-full transform -rotate-90">
                          <circle cx="56" cy="56" r="45" stroke="#E2E8F0" strokeWidth="8" fill="transparent" />
                          <circle cx="56" cy="56" r="45" stroke="#f97316" strokeWidth="8" fill="transparent" strokeDasharray={2 * Math.PI * 45} strokeDashoffset={2 * Math.PI * 45 - (matchScore / 100) * (2 * Math.PI * 45)} strokeLinecap="round" />
                        </svg>
                        <span className="absolute text-xl font-mono font-black text-slate-800">{matchScore}%</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 py-10 font-mono uppercase tracking-widest">Insufficient Data</span>
                    )}
                    <span className="text-[10px] text-slate-500 leading-normal">Evaluates semantic matches strictly against the target JD requirements.</span>
                  </div>

                  {/* Missing Skills card */}
                  <div className="bg-white border border-slate-155 p-5 rounded-2xl flex flex-col justify-between gap-3 text-left shadow-xs">
                    <div className="space-y-1">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Target Skills Inventory</span>
                      <h4 className="text-xs font-bold text-slate-800">Required Skills Analysis</h4>
                    </div>
                    {missingSkills?.length > 0 ? (
                      <div className="flex flex-col gap-2 my-2 overflow-y-auto max-h-24">
                        <div className="flex flex-wrap gap-1.5">
                          {matchedSkills.slice(0, 4).map((s: any, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-green-50 text-green-600 border border-green-150">{s}</span>
                          ))}
                          {missingSkills.slice(0, 4).map((s: any, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 rounded-md text-[9px] font-bold bg-red-50 text-red-600 border border-red-150">{s.name || s}</span>
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-orange-600 font-mono">Matched: {matchedSkills.length} &bull; Missing: {missingSkills.length}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-slate-400 py-8 font-mono uppercase tracking-widest text-center">Insufficient Data</span>
                    )}
                    <button onClick={() => setActiveTab("learning")} className="w-full h-8 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1">
                      Analyze Skill Gap <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* 3. Version Rollback card */}
                <div className="bg-white border border-slate-150 p-5 rounded-2xl space-y-4 shadow-xs">
                  <div className="text-left">
                    <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Resume Version Control</span>
                    <h3 className="text-xs font-bold text-slate-800">Accepted Snapshots Rollback History</h3>
                  </div>

                  {(parsedResumeDetails?.resumeVersions?.length || 0) > 0 ? (
                    <div className="flex flex-col gap-3">
                      {parsedResumeDetails?.resumeVersions?.map((v, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-50/50 p-3.5 border border-slate-200/60 rounded-xl">
                          <div className="text-left space-y-0.5">
                            <span className="text-[10px] font-black text-violet-600 font-mono">{v.versionId} &bull; {v.timestamp}</span>
                            <p className="text-xs font-bold text-slate-800">{v.changeSummary}</p>
                            <span className="text-[9px] text-slate-500 font-mono">Target: {v.targetCompany} ({v.targetRole})</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md border border-slate-200">ATS: {v.generalAtsScore}%</span>
                            <button 
                              onClick={() => {
                                rollbackToVersion(v.versionId);
                                alert(`Profile details restored back to version ${v.versionId}!`);
                              }}
                              className="h-8 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-[10px] transition-all"
                            >
                              Rollback
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 text-xs font-bold font-mono uppercase tracking-wider">
                      No snapshots created yet. Accept optimizations to create versions.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Resume Optimizer */}
            {activeTab === "resume" && (
              <div className="space-y-6">
                
                {/* 1. Header controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-3 border-b border-slate-200">
                  <div className="text-left space-y-0.5">
                    <h3 className="text-base font-bold text-slate-800 flex items-center gap-1">
                      <Sparkles className="h-4.5 w-4.5 text-orange-500" /> Resume Optimizer
                    </h3>
                    <p className="text-xs text-slate-500 leading-normal">Classified bullet points recommendations to optimize text structures without inventing credentials.</p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setCompiledMode(c => !c)}
                      className={`h-9 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                        compiledMode 
                          ? "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
                          : "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600"
                      }`}
                    >
                      {compiledMode ? (
                        <>
                          <Edit3 className="h-4 w-4" /> Back to Suggestions
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4" /> Compile Tailored Resume (A4)
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 2. Compiled mode view */}
                {compiledMode ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-3 border border-slate-200 rounded-2xl">
                      <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                        <FileCheck className="h-4 w-4 text-green-600" /> Tailored ATS-Compliant Markdown Resume Ready
                      </span>
                      <div className="flex gap-2">
                        <button onClick={copyOptimizedMarkdown} className="h-8 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-[10px] flex items-center gap-1">
                          <Copy className="h-3.5 w-3.5" /> Copy Markdown
                        </button>
                        <button onClick={downloadOptimizedMarkdown} className="h-8 px-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-bold text-[10px] flex items-center gap-1">
                          <Download className="h-3.5 w-3.5" /> Download .md
                        </button>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-2xl bg-white text-slate-900 p-8 min-h-[600px] text-left overflow-y-auto max-h-[700px] shadow-inner font-mono text-[11px] leading-relaxed whitespace-pre-wrap">
                      {compileMarkdownText()}
                    </div>
                  </div>
                ) : (
                  /* Suggestions review mode */
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* Left tabs selector */}
                    <div className="lg:col-span-1 flex flex-col gap-2 text-left">
                      {[
                        { id: "available", label: "Already Available", count: optimizedResume?.alreadyAvailable?.length || 0 },
                        { id: "better", label: "Better Presentation", count: optimizedResume?.betterPresentation?.length || 0 },
                        { id: "missing", label: "Missing Requirements", count: missingSkills?.length || 0 }
                      ].map(sec => (
                        <button
                          key={sec.id}
                          onClick={() => {
                            setSelectedOptimTab(sec.id as any);
                            setEditingSuggestionId(null);
                          }}
                          className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all text-left ${
                            selectedOptimTab === sec.id
                              ? "bg-violet-600 text-white shadow-md"
                              : "bg-white hover:bg-slate-50 text-slate-650 border border-slate-200/60"
                          }`}
                        >
                          <span>{sec.label}</span>
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-mono font-black ${
                            selectedOptimTab === sec.id ? "bg-violet-750 text-white" : "bg-slate-100 text-slate-500"
                          }`}>
                            {sec.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Right content view */}
                    <div className="lg:col-span-3 space-y-4">
                      
                      {/* Sub-Tab 1: Already Available */}
                      {selectedOptimTab === "available" && (
                        <div className="space-y-4 text-left">
                          {(optimizedResume?.alreadyAvailable?.length || 0) > 0 ? (
                            optimizedResume.alreadyAvailable.map((sug: any, idx: number) => (
                              <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-3 shadow-xs">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9.5px] font-black uppercase bg-violet-50 text-violet-600 border border-violet-100 px-2 py-0.5 rounded-md">
                                      {sug.section}
                                    </span>
                                    <span className="text-[9.5px] font-bold text-orange-600 font-mono">
                                      Confidence: {sug.confidenceScore || 90}%
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-semibold">{sug.whyExplanation}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Before</span>
                                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-150">{sug.originalText}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-black text-violet-600 uppercase tracking-wider block">After</span>
                                    {editingSuggestionId === sug.id ? (
                                      <textarea 
                                        value={editingText} 
                                        onChange={e => setEditingText(e.target.value)} 
                                        className="w-full text-xs text-slate-800 bg-white border border-slate-300 p-2.5 rounded-xl focus:outline-none h-20"
                                      />
                                    ) : (
                                      <p className="text-xs text-slate-850 bg-violet-50/20 p-2.5 rounded-xl border border-violet-100">{sug.suggestedText}</p>
                                    )}
                                  </div>
                                </div>

                                <p className="text-[10.5px] text-slate-500 italic">&bull; {sug.explanation}</p>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                  {editingSuggestionId === sug.id ? (
                                    <>
                                      <button onClick={() => setEditingSuggestionId(null)} className="h-7.5 px-3 rounded-lg border border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50">Cancel</button>
                                      <button onClick={() => handleSaveSuggestionEdit(sug, "available")} className="h-7.5 px-3 rounded-lg bg-green-600 text-white font-bold text-[10px] hover:bg-green-505">Save & Accept</button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => handleEditSuggestion(sug)} className="h-7.5 px-3 rounded-lg border border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50">Edit</button>
                                      <button onClick={() => handleAcceptSuggestion(sug, "available")} className="h-7.5 px-3 rounded-lg bg-violet-600 hover:bg-violet-550 text-white font-bold text-[10px]">Accept optimization</button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10 text-slate-400 text-xs font-mono uppercase tracking-wider">
                              All available optimizations reviewed and synced!
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sub-Tab 2: Better Presentation */}
                      {selectedOptimTab === "better" && (
                        <div className="space-y-4 text-left">
                          {(optimizedResume?.betterPresentation?.length || 0) > 0 ? (
                            optimizedResume.betterPresentation.map((sug: any, idx: number) => (
                              <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-3 shadow-xs">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[9.5px] font-black uppercase bg-orange-50 text-orange-600 border border-orange-100 px-2 py-0.5 rounded-md">
                                      {sug.section} [Index {sug.index}]
                                    </span>
                                    <span className="text-[9.5px] font-bold text-orange-600 font-mono">
                                      Confidence: {sug.confidenceScore || 90}%
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-slate-400 font-semibold">{sug.whyExplanation}</span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Before (Original Experience Description)</span>
                                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-150 whitespace-pre-wrap">{sug.originalText}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-wider block">After (STAR Rewritten Wording)</span>
                                    {editingSuggestionId === sug.id ? (
                                      <textarea 
                                        value={editingText} 
                                        onChange={e => setEditingText(e.target.value)} 
                                        className="w-full text-xs text-slate-805 bg-white border border-slate-300 p-3 rounded-xl focus:outline-none h-36 whitespace-pre-wrap"
                                      />
                                    ) : (
                                      <p className="text-xs text-slate-850 bg-orange-50/20 p-3 rounded-xl border border-orange-100 whitespace-pre-wrap">{sug.suggestedText}</p>
                                    )}
                                  </div>
                                </div>

                                <p className="text-[10.5px] text-slate-500 italic">&bull; {sug.explanation}</p>

                                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                                  {editingSuggestionId === sug.id ? (
                                    <>
                                      <button onClick={() => setEditingSuggestionId(null)} className="h-7.5 px-3 rounded-lg border border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50">Cancel</button>
                                      <button onClick={() => handleSaveSuggestionEdit(sug, "better")} className="h-7.5 px-3 rounded-lg bg-green-600 text-white font-bold text-[10px] hover:bg-green-550">Save & Accept</button>
                                    </>
                                  ) : (
                                    <>
                                      <button onClick={() => handleEditSuggestion(sug)} className="h-7.5 px-3 rounded-lg border border-slate-200 text-slate-500 font-bold text-[10px] hover:bg-slate-50">Edit</button>
                                      <button onClick={() => handleAcceptSuggestion(sug, "better")} className="h-7.5 px-3 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-[10px]">Accept rewrite</button>
                                    </>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-10 text-slate-400 text-xs font-mono uppercase tracking-wider">
                              All bullet points rewrites reviewed and synced!
                            </div>
                          )}
                        </div>
                      )}

                      {/* Sub-Tab 3: Missing Requirements */}
                      {selectedOptimTab === "missing" && (
                        <div className="space-y-4 text-left">
                          <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl space-y-1">
                            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1"><Info className="h-4 w-4 text-orange-500" /> Fact Check Protection Active</h4>
                            <p className="text-[10px] text-slate-500 leading-relaxed">
                              Epitome AI Career Copilot strictly enforces factual integrity. We do not manufacture fake credentials. Missing requirements must be verified (by completing the course or manual evaluation) before they can be added to your profile resume data.
                            </p>
                          </div>

                          {missingSkills?.length > 0 ? (
                            missingSkills.map((sug: any, idx: number) => {
                              const skillName = sug.name || sug;
                              const isCompleted = parsedResumeDetails?.completedCourses?.includes(sug.recommendedCourseId);
                              
                              return (
                                <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl space-y-3 shadow-xs">
                                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9.5px] font-black uppercase bg-red-50 text-red-650 border border-red-100 px-2 py-0.5 rounded-md">
                                        Missing skill
                                      </span>
                                      <span className="text-xs font-bold text-slate-800">{skillName}</span>
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                                      sug.importance === "HIGH" ? "bg-red-50 text-red-600 border border-red-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                                    }`}>
                                      {sug.importance || "HIGH"} Priority
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <span className="text-[9.5px] font-black text-slate-400 uppercase">Reason for Requirement</span>
                                    <p className="text-xs text-slate-600">{sug.reason || "This is a critical core skill evaluated in the coding assessments of the JD."}</p>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3.5 border border-slate-150 rounded-xl text-xs">
                                    <div className="space-y-1">
                                      <span className="text-[9px] font-black text-slate-400 uppercase">Recommended Learning Path</span>
                                      {sug.recommendedCourseId ? (
                                        <div className="space-y-1 text-left">
                                          <p className="font-bold text-slate-800 text-[11px]">{sug.recommendedCourseTitle}</p>
                                          <span className="text-[9.5px] text-slate-500 font-mono">Duration: {sug.estimatedTime || "12 hours"}</span>
                                        </div>
                                      ) : (
                                        <div className="space-y-0.5 text-left">
                                          <p className="font-bold text-slate-700">External Resource</p>
                                          <a href={sug.externalLearningPath || "#"} target="_blank" rel="noopener noreferrer" className="text-[10px] text-violet-600 hover:underline block truncate">
                                            {sug.externalLearningPath || "Documentation site"}
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex flex-col justify-center items-end">
                                      {sug.recommendedCourseId ? (
                                        isCompleted ? (
                                          <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                                              <CheckSquare className="h-4 w-4" /> Course Completed
                                            </span>
                                            <button 
                                              onClick={() => {
                                                const updated = [...(parsedResumeDetails?.technicalSkills || [])];
                                                if (!updated.includes(skillName)) {
                                                  updated.push(skillName);
                                                  updateParsedDetails({ technicalSkills: updated });
                                                }
                                                alert(`${skillName} verified and successfully added to your resume skills!`);
                                              }}
                                              className="h-8 px-3 rounded-lg bg-green-650 text-white font-bold text-[10px] transition-all"
                                            >
                                              Add Skill
                                            </button>
                                          </div>
                                        ) : (
                                          <button 
                                            onClick={() => {
                                              completeCourseInStore(sug.recommendedCourseId, skillName);
                                              alert(`You have started & completed the course: ${sug.recommendedCourseTitle}! ${skillName} is now verified.`);
                                            }}
                                            className="h-8 px-3.5 rounded-lg bg-violet-600 hover:bg-violet-550 text-white font-bold text-[10px] transition-all flex items-center gap-1"
                                          >
                                            <Play className="h-3 w-3 fill-current" /> Complete & Verify Skill
                                          </button>
                                        )
                                      ) : (
                                        <button 
                                          onClick={() => {
                                            const updated = [...(parsedResumeDetails?.technicalSkills || [])];
                                            if (!updated.includes(skillName)) {
                                              updated.push(skillName);
                                              updateParsedDetails({ technicalSkills: updated });
                                            }
                                            alert(`${skillName} verified manually and added to your profile!`);
                                          }}
                                          className="h-8 px-3.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] transition-all hover:bg-slate-200"
                                        >
                                          Manually Verify Skill
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-10 text-slate-400 text-xs font-mono uppercase tracking-wider">
                              No missing skills detected! Your profile fully covers the JD requirements.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Skill Gap & Learning */}
            {activeTab === "learning" && (
              <div className="space-y-6 text-left">
                <div className="space-y-1 border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-1">
                    <Map className="h-5 w-5 text-violet-600" /> Skill Gap & Learning Paths
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal">Compare your current resume skills against the target job description requirements to identify critical learning items.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left Comparison Summary list */}
                  <div className="lg:col-span-1 space-y-4">
                    <div className="bg-white border border-slate-200/60 p-4.5 rounded-2xl space-y-3 shadow-xs">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase block">Existing Skills Overlap</span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedSkills?.length > 0 ? (
                          matchedSkills.map((s: any, idx: number) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-green-50 text-green-600 border border-green-150">{s}</span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">No matched skills analysed yet.</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/60 p-4.5 rounded-2xl space-y-3 shadow-xs">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase block">Overall Skill Match Rate</span>
                      {matchScore > 0 ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-850">
                            <span>Overlap Rate</span>
                            <span>{skillMatchPercentage || 80}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 border border-slate-200">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${skillMatchPercentage || 80}%` }} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Insufficient Data</span>
                      )}
                    </div>
                  </div>

                  {/* Right Learning list */}
                  <div className="lg:col-span-2 space-y-4">
                    <h4 className="text-xs font-black text-slate-805 uppercase tracking-wider">Required Skills Gap Alignment</h4>
                    
                    {missingSkills?.length > 0 ? (
                      missingSkills.map((sug: any, idx: number) => {
                        const skillName = sug.name || sug;
                        const isCompleted = parsedResumeDetails?.completedCourses?.includes(sug.recommendedCourseId);
                        
                        return (
                          <div key={idx} className="bg-white border border-slate-200/60 p-4.5 rounded-2xl flex justify-between items-center gap-4 shadow-xs">
                            <div className="space-y-1 text-left">
                              <div className="flex items-center gap-2">
                                <h5 className="font-bold text-slate-800 text-xs">{skillName}</h5>
                                <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                                  sug.importance === "HIGH" ? "bg-red-50 text-red-600 border border-red-150" : "bg-yellow-50 text-yellow-600 border border-yellow-150"
                                }`}>
                                  {sug.importance || "HIGH"} Priority
                                </span>
                              </div>
                              <p className="text-[10.5px] text-slate-500 leading-normal">{sug.reason}</p>
                              <div className="flex gap-4 text-[9.5px] text-slate-400 font-mono pt-1">
                                <span>Time: {sug.estimatedTime || "12h"}</span>
                                <span>Course: {sug.recommendedCourseTitle || "External Link"}</span>
                              </div>
                            </div>

                            <div>
                              {sug.recommendedCourseId ? (
                                isCompleted ? (
                                  <span className="text-[10px] font-bold text-green-600 flex items-center gap-1"><Check className="h-4.5 w-4.5" /> Completed</span>
                                ) : (
                                  <button 
                                    onClick={() => {
                                      completeCourseInStore(sug.recommendedCourseId, skillName);
                                      alert(`Course "${sug.recommendedCourseTitle}" marked completed! ${skillName} is now verified.`);
                                    }}
                                    className="h-8 px-3 rounded-lg bg-violet-600 hover:bg-violet-550 text-white font-bold text-[10px]"
                                  >
                                    Verify Skill
                                  </button>
                                )
                              ) : (
                                <a href={sug.externalLearningPath || "#"} target="_blank" rel="noopener noreferrer" className="h-8 px-3 rounded-lg bg-slate-100 border border-slate-205 text-slate-700 font-bold text-[10px] inline-flex items-center hover:bg-slate-200">
                                  Learn
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-10 text-slate-405 text-xs font-mono uppercase tracking-wider">
                        No missing skills analysed. Run the Launch Copilot analysis first!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Tab: Mock Interview */}
            {activeTab === "interview" && (
              <div className="space-y-6 text-left">
                <div className="space-y-1 border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-1">
                    <MessageSquare className="h-5 w-5 text-violet-600 animate-pulse" /> Live AI Mock Screen
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    Conduct voice-activated, adaptive mock interviews with the virtual assistant based on your profile targeting {targetCompany}.
                  </p>
                </div>

                {!mockSessionActive ? (
                  /* Initial setup and history view */
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left start panel */}
                    <div className="lg:col-span-1 bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
                      <div className="space-y-1 text-center py-4">
                        <div className="h-14 w-14 rounded-full bg-violet-50 flex items-center justify-center mx-auto border border-violet-100 mb-2">
                          <Brain className="h-7 w-7 text-violet-500 animate-pulse" />
                        </div>
                        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Start Screen Simulation</h4>
                        <p className="text-[10px] text-slate-450 leading-relaxed max-w-xs mx-auto">
                          Conduct an adaptive, 5-question mock technical screen utilizing speech-to-text inputs.
                        </p>
                      </div>

                      <button 
                        onClick={startLiveMockSession}
                        className="w-full h-10 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Play className="h-4 w-4 fill-current" /> Start Live Voice Mock
                      </button>
                    </div>

                    {/* Right history list */}
                    <div className="lg:col-span-2 space-y-3">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Verbal Screen History</h4>
                      
                      {parsedResumeDetails?.interviewHistory && parsedResumeDetails.interviewHistory.length > 0 ? (
                        <div className="flex flex-col gap-3">
                          {parsedResumeDetails.interviewHistory.map((sess: any, idx: number) => (
                            <div key={idx} className="bg-white border border-slate-200/60 p-4 rounded-xl flex justify-between items-center shadow-xs">
                              <div className="text-left space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-violet-600 font-mono">{sess.sessionId}</span>
                                  <span className="text-[9px] font-bold text-slate-400">{sess.timestamp}</span>
                                </div>
                                <h5 className="text-xs font-bold text-slate-800">Target: {sess.company} &bull; {sess.role}</h5>
                                <p className="text-[10px] text-slate-500 leading-normal">{sess.report?.recruiterScorecard?.interviewSummary || "Mock completed successfully."}</p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                <div className="text-right">
                                  <span className="text-xs font-black text-slate-800 block">{sess.score}%</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                    sess.hiringRecommendation === "Strong Hire" || sess.hiringRecommendation === "Hire"
                                      ? "bg-green-50 text-green-600"
                                      : "bg-amber-50 text-amber-600"
                                  }`}>{sess.hiringRecommendation}</span>
                                </div>
                                <button 
                                  onClick={() => {
                                    setMockFinished(true);
                                    setMockReport(sess.report);
                                    setMockSessionActive(true);
                                  }}
                                  className="h-7 px-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-[10px]"
                                >
                                  Report
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 bg-slate-50 border border-slate-200/60 rounded-2xl text-slate-450 text-xs font-mono uppercase tracking-wider">
                          No interview sessions conducted yet.
                        </div>
                      )}
                    </div>
                  </div>
                ) : mockFinished ? (
                  /* Final feedback report scorecard view */
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                      <div className="text-left">
                        <span className="text-[10px] font-black bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Recruiter Scorecard
                        </span>
                        <h4 className="text-sm font-bold text-slate-800 pt-1">Interview Performance Intelligence Report</h4>
                      </div>
                      <button 
                        onClick={() => {
                          setMockSessionActive(false);
                          setMockFinished(false);
                        }}
                        className="h-8.5 px-3.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs"
                      >
                        Back to List
                      </button>
                    </div>

                    {/* Gauges stats scorecard grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { label: "Overall Score", value: mockReport?.overallScore || 80, color: "stroke-violet-500" },
                        { label: "Technical Depth", value: mockReport?.technicalScore || 80, color: "stroke-indigo-500" },
                        { label: "Communication", value: mockReport?.communicationScore || 85, color: "stroke-emerald-500" },
                        { label: "Confidence", value: mockReport?.confidenceScore || 85, color: "stroke-orange-500" },
                        { label: "Problem Solving", value: mockReport?.problemSolvingScore || 80, color: "stroke-blue-500" }
                      ].map((gauge, idx) => {
                        const radius = 22;
                        const circ = 2 * Math.PI * radius;
                        return (
                          <div key={idx} className="bg-white border border-slate-200/60 p-4 rounded-xl flex flex-col items-center justify-center text-center shadow-xs">
                            <div className="relative h-12 w-12 flex items-center justify-center mb-1">
                              <svg className="h-full w-full -rotate-90">
                                <circle cx="24" cy="24" r={radius} className="stroke-slate-100 fill-transparent stroke-2.5" />
                                <circle cx="24" cy="24" r={radius} className={`fill-transparent stroke-2.5 transition-all duration-500 ${gauge.color}`} strokeDasharray={circ} strokeDashoffset={circ - (gauge.value / 100) * circ} strokeLinecap="round" />
                              </svg>
                              <span className="absolute text-[10px] font-black text-slate-800 font-mono">{gauge.value}%</span>
                            </div>
                            <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider">{gauge.label}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Recommendation scorecard and details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Recruiter recommendation */}
                      <div className="md:col-span-1 bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
                        <div className="space-y-0.5 border-b border-slate-100 pb-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase">Hiring Recommendation</span>
                          <p className="text-base font-black text-slate-800">{mockReport?.recruiterScorecard?.hiringRecommendation || "Hire"}</p>
                        </div>
                        <div className="space-y-0.5 border-b border-slate-100 pb-2">
                          <span className="text-[9px] font-black text-slate-400 uppercase">Candidate Readiness</span>
                          <p className="text-xs font-bold text-slate-700">{mockReport?.recruiterScorecard?.candidateReadiness || "Job Ready"}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-black text-slate-400 uppercase block">Suitable Roles</span>
                          <div className="flex flex-wrap gap-1">
                            {mockReport?.recruiterScorecard?.suitableRoles?.map((r: any, idx: number) => (
                              <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-bold border border-slate-200">{r}</span>
                            )) || <span className="text-xs text-slate-500 italic">None suggested</span>}
                          </div>
                        </div>
                      </div>

                      {/* Strengths & Weaknesses */}
                      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-2.5 shadow-xs">
                          <h5 className="text-[10px] font-black text-green-600 uppercase tracking-wider flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> Demonstrated Strengths
                          </h5>
                          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                            {mockReport?.strengths?.map((s: any, idx: number) => (
                              <li key={idx}>{s}</li>
                            )) || <li>Solid system design architecture logic.</li>}
                          </ul>
                        </div>

                        <div className="bg-white border border-slate-200 p-4.5 rounded-2xl space-y-2.5 shadow-xs">
                          <h5 className="text-[10px] font-black text-red-650 uppercase tracking-wider flex items-center gap-1">
                            <XCircle className="h-4 w-4" /> Detected Gaps
                          </h5>
                          <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
                            {mockReport?.weaknesses?.map((w: any, idx: number) => (
                              <li key={idx}>{w}</li>
                            )) || <li>Add concurrency lock detail descriptions.</li>}
                          </ul>
                        </div>
                      </div>

                    </div>

                    {/* Actionable coaching learning bridges */}
                    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 shadow-xs">
                      <div className="text-left space-y-0.5">
                        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <BookOpen className="h-4.5 w-4.5 text-violet-500 animate-pulse" /> Actionable Learning Bridging Gaps
                        </h5>
                        <p className="text-[10px] text-slate-450">Specific training recommendations matching the weaknesses flagged in the screening session.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mockReport?.learningTopics?.slice(0, 3).map((topic: string, idx: number) => (
                          <div key={idx} className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between gap-3 text-left">
                            <div className="space-y-1">
                              <span className="text-[8.5px] font-mono font-black text-violet-600 uppercase tracking-wider">Concept Gap</span>
                              <h6 className="text-xs font-bold text-slate-800 leading-snug">{topic}</h6>
                            </div>
                            <button 
                              onClick={() => {
                                alert(`Enrolling in Epitome path for ${topic}...`);
                                setActiveTab("learning");
                              }}
                              className="h-8.5 w-full rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-[10px] transition-all flex items-center justify-center gap-1"
                            >
                              Explore Path <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Active Live Mock Session */
                  <div className="space-y-4">
                    {/* Onboarding Fullscreen Warning Modal */}
                    {showFullscreenWarning && (
                      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-center">
                          <div className="h-12 w-12 rounded-full bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center mx-auto animate-pulse">
                            <AlertCircle className="h-6 w-6" />
                          </div>
                          <div className="space-y-1.5">
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider">Interview Integrity Check</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                              This mock screen runs in **Browser Full-Screen Mode** to simulate official placement assessments. 
                              Exiting full-screen, switching tabs, or losing window focus will register integrity warnings. 
                              Exceeding **3 warnings** terminates the session immediately with failure.
                            </p>
                          </div>
                          <div className="flex gap-3 pt-2">
                            <button 
                              onClick={() => setShowFullscreenWarning(false)}
                              className="flex-1 h-9 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                            <button 
                              onClick={enterFullscreenAndStart}
                              className="flex-1 h-9 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs shadow-md shadow-violet-500/10"
                            >
                              I Agree, Enter Fullscreen
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Integrity Warnings Popup Banner */}
                    {showViolationAlert && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[10.5px] text-red-700 font-bold flex items-start gap-2 shadow-sm">
                        <AlertCircle className="h-4.5 w-4.5 shrink-0 text-red-600" />
                        <div className="space-y-0.5 text-left">
                          <span>{showViolationAlert}</span>
                          <span className="block text-[9.5px] font-normal text-slate-500">Leaving full-screen focus triggers security logging. Warning count: {violationCount} of 3.</span>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                      {/* Left Avatar & Video panel */}
                      <div className="lg:col-span-2 bg-white border border-slate-200 p-5 rounded-2xl flex flex-col items-center justify-between gap-4 text-center min-h-[360px] shadow-xs">
                        
                        {/* Live Video Feed Container */}
                        <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden relative h-52 flex items-center justify-center shadow-inner">
                          {mockStream ? (
                            <video 
                              ref={mockVideoRef}
                              autoPlay 
                              playsInline 
                              muted 
                              className="w-full h-full object-cover transform -scale-x-100" 
                            />
                          ) : (
                            <div className="flex flex-col items-center gap-1.5 text-slate-500 text-xs font-mono">
                              <VideoOff className="h-6 w-6 text-slate-650 animate-pulse" />
                              <span>Camera Stream Offline</span>
                            </div>
                          )}
                          
                          {/* Interactive floating AI Interviewer mini-panel PIP */}
                          <div className="absolute bottom-2.5 right-2.5 h-14 w-14 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center shadow-md overflow-hidden z-20">
                            <div className={`h-8 w-8 rounded-full bg-violet-50 flex items-center justify-center border transition-all duration-300 ${
                              mockSpeakActive 
                                ? "border-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.35)] scale-105" 
                                : "border-slate-205"
                            }`}>
                              <Sparkles className={`h-4.5 w-4.5 text-violet-505 text-violet-500 ${mockSpeakActive ? "animate-spin" : ""}`} />
                            </div>
                          </div>

                          {/* Status tag */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[8.5px] font-black text-slate-200 font-mono tracking-wider">
                            <div className={`h-1.5 w-1.5 rounded-full ${mockStream ? "bg-red-500 animate-ping" : "bg-slate-400"}`} />
                            {mockStream ? "REC LIVE" : "STBY"}
                          </div>
                        </div>

                        <div className="w-full space-y-1 text-left px-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black text-slate-450 uppercase tracking-widest block">Interviewer Avatar State</h4>
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[8.5px] font-black border ${
                              mockSpeakActive 
                                ? "bg-violet-50 border-violet-200 text-violet-650"
                                : mockIsListening 
                                  ? "bg-orange-50 border-orange-200 text-orange-650 animate-pulse"
                                  : "bg-slate-50 border-slate-200 text-slate-500"
                            }`}>
                              {mockSpeakActive ? "Speaking..." : mockIsListening ? "Listening..." : "Idle"}
                            </span>
                          </div>
                        </div>

                        {/* Listening Visualizer wave animation bars */}
                        {mockIsListening && (
                          <div className="flex gap-1 justify-center items-end h-8 my-1 w-full">
                            {[1.5, 3.5, 2, 4.5, 2.5, 3.5, 1.5, 4, 2].map((h, idx) => (
                              <div 
                                key={idx} 
                                className="bg-orange-500 w-1 rounded-full animate-pulse transition-all duration-300"
                                style={{ 
                                  height: `${h * 6}px`,
                                  animationDelay: `${idx * 80}ms` 
                                }} 
                              />
                            ))}
                          </div>
                        )}

                        <button 
                          onClick={closeMockSession}
                          className="w-full h-8.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-bold text-xs"
                        >
                          Exit Interview Screen
                        </button>
                      </div>

                      {/* Right active QA panel (Coding Editor / Standard split pane) */}
                      <div className="lg:col-span-3 space-y-4 text-left">
                        {isCodingQuestion ? (
                          /* split coding workspace */
                          <div className="grid grid-cols-1 gap-4">
                            
                            {/* Question context */}
                            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-1">
                              <span className="text-[8.5px] font-mono font-black text-violet-600 uppercase tracking-wider block">Coding challenge question</span>
                              <p className="text-xs font-bold text-slate-800 leading-relaxed font-sans">{mockQuestion}</p>
                            </div>

                            {/* Code editor card */}
                            <div className="bg-slate-900 text-slate-200 rounded-3xl border border-slate-800 overflow-hidden shadow-lg flex flex-col min-h-[360px]">
                              
                              {/* Editor header */}
                              <div className="bg-slate-950 border-b border-slate-805 px-4 py-2 flex items-center justify-between">
                                <span className="text-[9px] font-mono text-slate-400 font-black uppercase tracking-wider flex items-center gap-1.5">
                                  <div className="h-1.5 w-1.5 rounded-full bg-violet-500" /> coding_workspace.cpp
                                </span>
                                
                                <select 
                                  value={codeLanguage}
                                  onChange={e => setCodeLanguage(e.target.value)}
                                  className="h-7 rounded bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-bold outline-none"
                                >
                                  <option value="javascript">JavaScript</option>
                                  <option value="python">Python</option>
                                  <option value="cpp">C++</option>
                                  <option value="java">Java</option>
                                </select>
                              </div>

                              {/* Editor block */}
                              <div className="flex-1 flex bg-slate-900 font-mono text-[11px] relative p-3">
                                <div className="text-slate-650 select-none text-right pr-3 border-r border-slate-800 leading-relaxed text-[11px] font-mono">
                                  {Array.from({ length: 12 }).map((_, i) => (
                                    <div key={i}>{i + 1}</div>
                                  ))}
                                </div>
                                <textarea 
                                  value={codeSubmission}
                                  onChange={e => setCodeSubmission(e.target.value)}
                                  placeholder="// Write solution code details here..."
                                  className="flex-1 bg-transparent text-slate-200 outline-none resize-none pl-3 leading-relaxed font-mono focus:ring-0 focus:outline-none"
                                />
                              </div>

                              {/* Console Output */}
                              {compilerOutput && (
                                <div className="bg-slate-950 border-t border-slate-800 p-3 font-mono text-[10px] text-slate-350 text-left space-y-1">
                                  <span className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest block">Console Output</span>
                                  <pre className="whitespace-pre-wrap leading-relaxed">{compilerOutput}</pre>
                                </div>
                              )}

                              {/* Editor buttons bar */}
                              <div className="bg-slate-950 border-t border-slate-800 p-3 flex justify-between gap-3">
                                <button 
                                  disabled={compilerRunning}
                                  onClick={runMockCompiler}
                                  className="h-8.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-[10.5px] font-bold tracking-wider transition-all"
                                >
                                  {compilerRunning ? "Running..." : "Run Test Cases"}
                                </button>
                                
                                <button 
                                  disabled={mockLoading || !codeSubmission.trim()}
                                  onClick={submitMockAnswer}
                                  className="h-8.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 text-white text-[10.5px] font-bold tracking-wider transition-all"
                                >
                                  {mockLoading ? "Submitting Solution..." : "Submit Code Solution"}
                                </button>
                              </div>

                            </div>

                            {/* Verbal Explanation */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9.5px] font-black text-slate-400 uppercase tracking-wider block">Explain Solution verbally</span>
                                <button 
                                  onClick={toggleMockListening}
                                  className={`h-7 px-2.5 rounded-lg border text-[9.5px] font-bold transition-all flex items-center gap-1.5 ${
                                    mockIsListening 
                                      ? "bg-orange-500 border-orange-600 text-white animate-pulse"
                                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-655"
                                  }`}
                                >
                                  {mockIsListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-violet-500" />} Speak Answer
                                </button>
                              </div>
                              <textarea 
                                placeholder="Speak or type your solution explanation details..."
                                value={mockAnswer}
                                onChange={e => setMockAnswer(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white p-3.5 text-xs text-slate-800 h-24 focus:outline-none"
                              />
                            </div>

                          </div>
                        ) : (
                          /* Standard Verbal prompt panel */
                          <div className="space-y-4">
                            {/* Current Question panel */}
                            <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl space-y-3">
                              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                <span className="px-2 py-0.5 rounded-md bg-violet-50 border border-violet-100 text-[9px] font-black text-violet-650">
                                  Question {mockCount}
                                </span>
                                <button 
                                  onClick={() => speakMockText(mockQuestion)}
                                  className="text-[9.5px] font-bold text-slate-400 hover:text-slate-700 flex items-center gap-1"
                                >
                                  <Volume2 className="h-4 w-4" /> Repeat Audio
                                </button>
                              </div>
                              <p className="text-xs font-bold text-slate-800 leading-relaxed font-sans">{mockQuestion}</p>
                            </div>

                            {/* Transcribed response textarea */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Your Verbal Response</span>
                                <button 
                                  onClick={toggleMockListening}
                                  className={`h-8 px-3 rounded-lg border text-[10px] font-black transition-all flex items-center gap-1.5 ${
                                    mockIsListening 
                                      ? "bg-orange-50 border-orange-600 text-white shadow-md animate-pulse"
                                      : "bg-white border-slate-200 hover:bg-slate-50 text-slate-600"
                                  }`}
                                >
                                  {mockIsListening ? (
                                    <>
                                      <MicOff className="h-3.5 w-3.5" /> Stop Voice Stream
                                    </>
                                  ) : (
                                    <>
                                      <Mic className="h-3.5 w-3.5 text-violet-500" /> Speak Answer
                                    </>
                                  )}
                                </button>
                              </div>

                              <textarea 
                                placeholder="Speak or type your technical response details here..."
                                value={mockAnswer}
                                onChange={e => setMockAnswer(e.target.value)}
                                className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-xs text-slate-800 h-36 focus:outline-none focus:border-slate-350"
                              />

                              {mockError && (
                                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-650 flex items-center gap-1.5">
                                  <AlertCircle className="h-4 w-4 shrink-0" /> {mockError}
                                </div>
                              )}

                              <button 
                                disabled={mockLoading || !mockAnswer.trim()}
                                onClick={submitMockAnswer}
                                className="w-full h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                              >
                                {mockLoading ? (
                                  <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Evaluating answer details...
                                  </>
                                ) : (
                                  <>
                                    <Send className="h-4 w-4" /> Submit Response
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab: Career Advisor Actionable Coach */}
            {activeTab === "career" && (
              <div className="space-y-6 text-left">
                <div className="space-y-1 border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-850 flex items-center gap-1">
                    <Compass className="h-5 w-5 text-violet-600" /> Actionable Placement Coach
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal">Your personalized daily roadmap calendar leading to your placement target at {targetCompany}.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  
                  {/* Left info column */}
                  <div className="md:col-span-1 space-y-4">
                    <div className="bg-white border border-slate-200/60 p-4.5 rounded-2xl space-y-2 shadow-xs">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase block">Strengths</span>
                      <ul className="text-xs text-slate-550 space-y-1 list-disc pl-4 leading-relaxed">
                        {strengths?.slice(0, 3).map((s, idx) => (
                          <li key={idx}>{s}</li>
                        )) || <li>Active project list & clean technical focus.</li>}
                      </ul>
                    </div>

                    <div className="bg-white border border-slate-200/60 p-4.5 rounded-2xl space-y-2 shadow-xs">
                      <span className="text-[9.5px] font-black text-slate-400 uppercase block">Action Items</span>
                      <ul className="text-xs text-slate-550 space-y-1 list-disc pl-4 leading-relaxed">
                        {improvements?.slice(0, 3).map((w, idx) => (
                          <li key={idx}>{w}</li>
                        )) || <li>Add unit testing libraries & Docker experience.</li>}
                      </ul>
                    </div>
                  </div>

                  {/* Right Calendar Roadmap planner */}
                  <div className="md:col-span-3 space-y-4">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Placement Preparation Schedule</h4>

                    <div className="grid grid-cols-1 gap-4">
                      {[
                        { day: "Today", task: "Start and complete semantic course gaps matching your profile requirements.", icon: Map, color: "text-violet-600 bg-violet-50 border-violet-100" },
                        { day: "Tomorrow", task: "Run the Resume Optimizer, rewrite experience description bullets to STAR format.", icon: FileText, color: "text-orange-655 text-orange-600 bg-orange-50 border-orange-100" },
                        { day: "Saturday", task: "Generate mock questions, simulate OA online rounds and practice system design.", icon: MessageSquare, color: "text-blue-600 bg-blue-50 border-blue-100" },
                        { day: "Sunday", task: "Review job recommendations overlap percentage, prepare applications, and submit.", icon: Briefcase, color: "text-green-600 bg-green-50 border-green-100" }
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div key={idx} className="bg-white border border-slate-200/60 p-5 rounded-2xl flex gap-4 items-start shadow-xs">
                            <div className={`h-10 w-10 rounded-xl border flex items-center justify-center shrink-0 ${item.color}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-800">{item.day}</span>
                              </div>
                              <p className="text-xs font-medium text-slate-500">{item.task}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Job Recommendations */}
            {activeTab === "jobs" && (
              <div className="space-y-6 text-left">
                <div className="space-y-1 border-b border-slate-200 pb-3">
                  <h3 className="text-base font-bold text-slate-800 flex items-center gap-1">
                    <Briefcase className="h-5 w-5 text-violet-600" /> Job Matching Recommendations
                  </h3>
                  <p className="text-xs text-slate-500 leading-normal">Matches from our company partner database based on your optimized resume skills overlap.</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {platformJobs.length > 0 ? (
                    platformJobs.map((job) => {
                      // Calculate match score
                      const matchingSkillsCount = matchedSkills.length;
                      const missingCount = missingSkills.length;
                      const calculatedMatch = Math.min(100, Math.round((matchingSkillsCount / (matchingSkillsCount + missingCount || 5)) * 100)) || 75;

                      return (
                        <div key={job.id} className="bg-white border border-slate-200/60 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xs hover:border-slate-300 transition-all duration-200">
                          <div className="text-left space-y-1.5 max-w-xl">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold text-orange-600 font-mono bg-orange-50 px-1.5 py-0.5 rounded-md border border-orange-100">Match: {calculatedMatch}%</span>
                              <span className="text-slate-400 text-[10px] font-mono">Location: {job.location || "Bengaluru, India"}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-800">{job.title}</h4>
                            <p className="text-xs text-slate-500 font-bold">{job.company || "Epitome Partner"}</p>
                            <p className="text-[10.5px] text-slate-450 leading-relaxed line-clamp-2">{job.description}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-600 font-mono bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-md">{job.type || "Full-Time"}</span>
                            <button 
                              onClick={() => alert(`Application submitted for ${job.title} at ${job.company || "Epitome Partner"}!`)}
                              className="h-9 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-xs transition-all shadow-xs"
                            >
                              Apply Now
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-10 text-slate-400 text-xs font-mono uppercase tracking-wider">
                      No matching jobs database configured yet.
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
