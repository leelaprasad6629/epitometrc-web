"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  CheckCircle2,
  Lock,
  PlayCircle,
  FileText,
  HelpCircle,
  Download,
  MessageSquare,
  Award,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Clock,
  Send,
  RotateCcw,
  Sparkles,
  Check,
  Eye,
  Video,
  ThumbsUp,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LMSCourse, LMSModule, LMSLesson, LMSQuiz, LMSAssignment, LMSResource, LMSDiscussionThread } from "@/types/lms";
import { lmsService } from "@/lib/services/lmsService";
import { cn } from "@/lib/utils";

export default function LMSCoursePlayerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: courseId } = use(params);
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<LMSCourse | null>(null);
  const [modules, setModules] = useState<LMSModule[]>([]);
  const [currentLesson, setCurrentLesson] = useState<LMSLesson | null>(null);
  
  // UI Tabs inside main stage
  const [activeStageTab, setActiveStageTab] = useState<"video" | "notes" | "quiz" | "assignment" | "resources" | "discussion" | "certificate">("video");

  // Sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Video player speed
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  // Interactive Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Assignment submission state
  const [assignmentText, setAssignmentText] = useState("");
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false);

  // Discussions state
  const [discussions, setDiscussions] = useState<LMSDiscussionThread[]>([]);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [postingThread, setPostingThread] = useState(false);

  // Certificate state
  const [certificateData, setCertificateData] = useState<any | null>(null);

  // Toast message
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    lmsService.fetchCurriculum(courseId).then((res) => {
      if (isMounted && res) {
        setCourse(res.course);
        setModules(res.modules);

        // Auto select first lesson
        const firstLesson = res.modules[0]?.lessons[0] || null;
        if (firstLesson) {
          setCurrentLesson(firstLesson);
          if (firstLesson.type === "quiz") setActiveStageTab("quiz");
          else if (firstLesson.type === "assignment") setActiveStageTab("assignment");
          else if (firstLesson.type === "notes") setActiveStageTab("notes");
          else setActiveStageTab("video");
        }
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [courseId]);

  // Fetch discussions when switching to discussion tab
  useEffect(() => {
    if (activeStageTab === "discussion" && courseId) {
      lmsService.fetchDiscussions(courseId).then(setDiscussions);
    }
  }, [activeStageTab, courseId]);

  // Fetch certificate when switching to certificate tab
  useEffect(() => {
    if (activeStageTab === "certificate" && courseId) {
      lmsService.getCertificate(courseId).then(setCertificateData);
    }
  }, [activeStageTab, courseId]);

  // Flatten lessons list for next/prev navigation
  const allLessons = modules.flatMap((m) => m.lessons);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);

  const handleLessonSelect = (les: LMSLesson) => {
    setCurrentLesson(les);
    if (les.type === "quiz") setActiveStageTab("quiz");
    else if (les.type === "assignment") setActiveStageTab("assignment");
    else if (les.type === "notes") setActiveStageTab("notes");
    else setActiveStageTab("video");
  };

  const handleNextLesson = () => {
    if (currentLessonIndex >= 0 && currentLessonIndex < allLessons.length - 1) {
      handleLessonSelect(allLessons[currentLessonIndex + 1]);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      handleLessonSelect(allLessons[currentLessonIndex - 1]);
    }
  };

  const handleToggleLessonCompletion = async () => {
    if (!currentLesson) return;
    const newStatus = !currentLesson.isCompleted;
    
    // Optimistic UI update
    setCurrentLesson((prev) => (prev ? { ...prev, isCompleted: newStatus } : null));
    setModules((prevModules) =>
      prevModules.map((m) => ({
        ...m,
        lessons: m.lessons.map((l) => (l.id === currentLesson.id ? { ...l, isCompleted: newStatus } : l)),
      }))
    );

    const ok = await lmsService.updateLessonProgress(currentLesson.id, newStatus);
    if (ok) {
      showToast(newStatus ? "Lesson marked as complete! 🎉" : "Lesson status updated");
    }
  };

  const handleQuizSubmit = async (quizId: string) => {
    setSubmittingQuiz(true);
    const res = await lmsService.submitQuiz(quizId, quizAnswers);
    setSubmittingQuiz(false);
    if (res) {
      setQuizResult(res);
      if (res.passed && currentLesson) {
        handleToggleLessonCompletion();
      }
    }
  };

  const handleAssignmentSubmit = async (assignmentId: string) => {
    if (!assignmentText) return;
    const ok = await lmsService.submitAssignment(assignmentId, assignmentText);
    if (ok) {
      setAssignmentSubmitted(true);
      showToast("Assignment submitted successfully!");
    }
  };

  const handlePostThread = async () => {
    if (!newThreadTitle || !newThreadContent) return;
    setPostingThread(true);
    const ok = await lmsService.postDiscussion(courseId, newThreadTitle, newThreadContent, currentLesson?.id);
    setPostingThread(false);
    if (ok) {
      setNewThreadTitle("");
      setNewThreadContent("");
      const updated = await lmsService.fetchDiscussions(courseId);
      setDiscussions(updated);
      showToast("Discussion thread posted!");
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
        <Sparkles className="w-10 h-10 text-orange-500 animate-spin" />
        <p className="text-slate-400 text-sm font-semibold animate-pulse font-sans">
          Loading Enterprise LMS Course Player...
        </p>
      </div>
    );
  }

  // Calculate overall progress %
  const completedLessonsCount = allLessons.filter((l) => l.isCompleted).length;
  const overallProgressPercent = Math.min(100, Math.round((completedLessonsCount / (allLessons.length || 1)) * 100));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans overflow-hidden">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 right-6 z-50 bg-slate-800 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LMS Top Header Bar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 md:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link
            href="/student/courses"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">My Courses</span>
          </Link>

          <div className="h-4 w-px bg-slate-800 hidden sm:block" />

          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white font-display truncate max-w-xs md:max-w-md">
              {course.title}
            </h1>
            <p className="text-[11px] text-slate-400 truncate">
              {currentLesson?.title || "Overview"}
            </p>
          </div>
        </div>

        {/* Progress & Next Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400">Progress:</span>
            <span className="text-xs font-bold text-orange-400 font-display">{overallProgressPercent}%</span>
            <div className="w-24 bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full transition-all duration-500" style={{ width: `${overallProgressPercent}%` }} />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevLesson}
              disabled={currentLessonIndex <= 0}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNextLesson}
              disabled={currentLessonIndex >= allLessons.length - 1}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* LMS Stage Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Curriculum Collapsible Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? (typeof window !== "undefined" && window.innerWidth < 768 ? "100%" : "340px") : "0px" }}
          className={cn(
            "bg-slate-950 border-r border-slate-800 flex flex-col shrink-0 overflow-hidden transition-all duration-300 z-20 absolute md:relative inset-y-0 left-0",
            sidebarOpen ? "w-full md:w-[340px]" : "w-0 border-r-0 pointer-events-none"
          )}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-display">Course Curriculum</h3>
              <p className="text-[11px] text-slate-500 font-sans">{allLessons.length} Total Lessons</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              {overallProgressPercent === 100 ? "Completed" : "In Progress"}
            </span>
          </div>

          {/* Curriculum Modules Accordion */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 font-sans">
            {modules.map((mod, mIdx) => (
              <div key={mod.id} className="bg-slate-900 rounded-2xl border border-slate-800/80 overflow-hidden">
                <div className="p-3 bg-slate-800/40 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 font-display">
                    Module {mIdx + 1}: {mod.title}
                  </h4>
                  {mod.description && <p className="text-[11px] text-slate-500 mt-0.5">{mod.description}</p>}
                </div>

                <div className="divide-y divide-slate-800/60">
                  {mod.lessons.map((les) => {
                    const isActive = currentLesson?.id === les.id;

                    return (
                      <button
                        key={les.id}
                        onClick={() => handleLessonSelect(les)}
                        className={cn(
                          "w-full p-3 text-left transition-all flex items-center justify-between gap-3 text-xs",
                          isActive
                            ? "bg-orange-500/10 text-orange-400 font-bold border-l-4 border-orange-500"
                            : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {les.isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : les.type === "quiz" ? (
                            <HelpCircle className="w-4 h-4 text-purple-400 shrink-0" />
                          ) : les.type === "assignment" ? (
                            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                          ) : (
                            <PlayCircle className={cn("w-4 h-4 shrink-0", isActive ? "text-orange-400" : "text-slate-500")} />
                          )}
                          <span className="truncate">{les.title}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 shrink-0">{les.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Navigation Tabs inside Sidebar Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 grid grid-cols-4 gap-1 text-[11px]">
            <button
              onClick={() => setActiveStageTab("video")}
              className={cn("p-2 rounded-xl text-center font-bold transition-all", activeStageTab === "video" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-900")}
            >
              Video
            </button>
            <button
              onClick={() => setActiveStageTab("notes")}
              className={cn("p-2 rounded-xl text-center font-bold transition-all", activeStageTab === "notes" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-900")}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveStageTab("discussion")}
              className={cn("p-2 rounded-xl text-center font-bold transition-all", activeStageTab === "discussion" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-900")}
            >
              Forum
            </button>
            <button
              onClick={() => setActiveStageTab("certificate")}
              className={cn("p-2 rounded-xl text-center font-bold transition-all", activeStageTab === "certificate" ? "bg-orange-500 text-white" : "text-slate-400 hover:bg-slate-900")}
            >
              Cert
            </button>
          </div>
        </motion.aside>

        {/* Main Stage Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-900 p-4 md:p-6 space-y-6">
          {/* Top Stage Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
            {[
              { key: "video", label: "Video Player", icon: Video },
              { key: "notes", label: "Lecture Notes", icon: FileText },
              { key: "quiz", label: "Module Quiz", icon: HelpCircle },
              { key: "assignment", label: "Assignment", icon: FileText },
              { key: "resources", label: "Resources & Downloads", icon: Download },
              { key: "discussion", label: "Discussion Forum", icon: MessageSquare },
              { key: "certificate", label: "Certificate", icon: Award },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveStageTab(tab.key as any)}
                  className={cn(
                    "px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap",
                    activeStageTab === tab.key
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  )}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 1. Video Player Stage */}
          {activeStageTab === "video" && (
            <div className="space-y-4">
              <div className="aspect-video w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-black shadow-2xl border border-slate-800 relative">
                <iframe
                  src={currentLesson?.videoUrl || "https://www.youtube.com/embed/NCwa_xi0Uuc"}
                  title={currentLesson?.title || "Lesson Video"}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Video Controls Bar */}
              <div className="max-w-5xl mx-auto bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 font-semibold">Playback Speed:</span>
                  {[0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors",
                        playbackSpeed === speed ? "bg-orange-500 text-white" : "bg-slate-800 text-slate-400 hover:text-white"
                      )}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleToggleLessonCompletion}
                    className={cn(
                      "px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 shadow-sm",
                      currentLesson?.isCompleted
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-orange-500 hover:bg-orange-600 text-white"
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{currentLesson?.isCompleted ? "Completed ✓" : "Mark as Complete"}</span>
                  </button>

                  <button
                    onClick={handleNextLesson}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Next Lesson</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lesson Metadata */}
              <div className="max-w-5xl mx-auto bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-2">
                <h3 className="text-lg font-bold text-white font-display">{currentLesson?.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{currentLesson?.description}</p>
              </div>
            </div>
          )}

          {/* 2. Rich Notes Viewer */}
          {activeStageTab === "notes" && (
            <div className="max-w-4xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-display text-white">{currentLesson?.title} - Revision Notes</h3>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {currentLesson?.duration}
                </span>
              </div>

              <div className="prose prose-invert max-w-none text-xs md:text-sm text-slate-300 leading-relaxed font-sans space-y-4">
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 whitespace-pre-line font-mono text-slate-200">
                  {currentLesson?.notesContent || "No specific markdown notes uploaded for this lesson."}
                </div>
              </div>
            </div>
          )}

          {/* 3. Interactive Quiz Player */}
          {activeStageTab === "quiz" && (
            <div className="max-w-3xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-display text-white">Module Assessment Quiz</h3>
                  <p className="text-xs text-slate-400">Answer all questions below and submit for instant grading</p>
                </div>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold">
                  Pass Mark: 70%
                </span>
              </div>

              {quizResult && (
                <div className={cn("p-5 rounded-2xl border text-center space-y-2", quizResult.passed ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-red-500/10 border-red-500/30 text-red-300")}>
                  <h4 className="text-lg font-bold font-display">{quizResult.passed ? "Quiz Passed! 🎉" : "Quiz Needs Review"}</h4>
                  <p className="text-2xl font-extrabold font-display">{quizResult.score}%</p>
                </div>
              )}

              {/* Sample Quiz Questions */}
              <div className="space-y-6 font-sans">
                {[
                  {
                    id: "q1",
                    question: "Which pattern enforces clean separation between enterprise domain entities and framework infrastructure?",
                    options: ["Clean / Hexagonal Architecture", "Monolithic Spaghetti Pattern", "Direct Global Injection", "Script Tag Import"],
                    correct: "Clean / Hexagonal Architecture",
                  },
                  {
                    id: "q2",
                    question: "What is the primary function of JWT in modern web authentication?",
                    options: ["Cryptographically signing stateless session claims", "Encrypting database hard drives", "Formatting CSS grids", "Compressing PNG images"],
                    correct: "Cryptographically signing stateless session claims",
                  },
                ].map((q, idx) => (
                  <div key={q.id} className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-sm font-bold text-white font-display">
                      Q{idx + 1}. {q.question}
                    </h4>
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                          className={cn(
                            "w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between",
                            quizAnswers[q.id] === opt
                              ? "bg-orange-500/20 text-orange-300 border-orange-500 font-bold"
                              : "bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700"
                          )}
                        >
                          <span>{opt}</span>
                          {quizAnswers[q.id] === opt && <Check className="w-4 h-4 text-orange-400" />}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => handleQuizSubmit("qz-demo")}
                  disabled={submittingQuiz}
                  className="w-full py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xs font-bold shadow-lg transition-all"
                >
                  {submittingQuiz ? "Evaluating Answers..." : "Submit Quiz for Grading"}
                </button>
              </div>
            </div>
          )}

          {/* 4. Assignment Submission */}
          {activeStageTab === "assignment" && (
            <div className="max-w-3xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-display text-white">Practical Module Assignment</h3>
                <p className="text-xs text-slate-400">Submit your text architecture proposal or GitHub repository URL below</p>
              </div>

              {assignmentSubmitted ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white font-display">Assignment Submitted!</h4>
                  <p className="text-xs text-slate-300">Your proposal is currently under review by Dr. Rajesh Verma.</p>
                </div>
              ) : (
                <div className="space-y-4 font-sans">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300">Architecture Response / Repository URL</label>
                    <textarea
                      rows={6}
                      value={assignmentText}
                      onChange={(e) => setAssignmentText(e.target.value)}
                      placeholder="Paste your architecture specification text or repository URL here..."
                      className="w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>

                  <button
                    onClick={() => handleAssignmentSubmit("asg-demo")}
                    className="w-full py-3.5 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xs font-bold transition-all shadow-lg"
                  >
                    Submit Assignment Response
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 5. Downloadable Resources */}
          {activeStageTab === "resources" && (
            <div className="max-w-3xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-display text-white">Downloadable Course Resources</h3>
                <p className="text-xs text-slate-400">Reference PDFs, starter source code repositories, and cheat sheets</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                {[
                  { title: "Architecture Blueprint Cheatsheet.pdf", type: "PDF", size: "2.4 MB" },
                  { title: "Starter Code Repository.zip", type: "ZIP", size: "14.8 MB" },
                  { title: "REST API Postman Collection.json", type: "Code", size: "350 KB" },
                ].map((res, i) => (
                  <div key={i} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white truncate max-w-[180px]">{res.title}</h4>
                      <span className="text-[10px] text-slate-400">{res.type} • {res.size}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Downloading ${res.title}...`)}
                      className="p-2.5 bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white rounded-xl transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Discussion Forum */}
          {activeStageTab === "discussion" && (
            <div className="max-w-3xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 space-y-6">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-xl font-bold font-display text-white">Course Q&amp;A Discussion Forum</h3>
                <p className="text-xs text-slate-400">Ask questions and discuss architecture challenges with instructors</p>
              </div>

              {/* New Thread Form */}
              <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3 font-sans">
                <h4 className="text-xs font-bold text-slate-200">Post a new question</h4>
                <input
                  type="text"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                  placeholder="Thread Question Title..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
                <textarea
                  rows={3}
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none"
                />
                <button
                  onClick={handlePostThread}
                  disabled={postingThread}
                  className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Question</span>
                </button>
              </div>

              {/* Discussion List */}
              <div className="space-y-4 font-sans">
                {discussions.map((th) => (
                  <div key={th.id} className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{th.authorName}</span>
                      <span className="text-[10px] text-slate-500">{th.createdAt}</span>
                    </div>
                    <h4 className="text-xs font-bold text-orange-400">{th.title}</h4>
                    <p className="text-xs text-slate-300">{th.content}</p>

                    {/* Replies */}
                    {th.replies.map((rp) => (
                      <div key={rp.id} className="ml-4 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-white">{rp.authorName}</span>
                          {rp.isInstructorReply && (
                            <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 text-[9px] font-bold">
                              Instructor
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-300">{rp.content}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. Certificate Generator */}
          {activeStageTab === "certificate" && (
            <div className="max-w-3xl mx-auto w-full bg-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 text-center space-y-6">
              <Award className="w-16 h-16 text-orange-500 mx-auto" />

              <div>
                <h3 className="text-2xl font-bold font-display text-white">Verified Certificate of Completion</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  {certificateData?.isUnlocked
                    ? "Congratulations! You have completed 100% of the course requirements."
                    : "Complete 100% of modules, quizzes, and assignments to unlock your official verified certificate."}
                </p>
              </div>

              {/* Certificate Template Card */}
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 rounded-3xl border-2 border-orange-500/40 text-white space-y-4 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-orange-500/10 font-display font-black text-6xl pointer-events-none">
                  EPITOME
                </div>

                <p className="text-xs font-bold uppercase tracking-widest text-orange-400">EpitomeTRC Verified Credential</p>
                <h4 className="text-xl font-bold font-display text-white">Certificate of Achievement</h4>
                <p className="text-xs text-slate-300 font-sans">This is to certify that</p>
                <p className="text-2xl font-extrabold text-white font-display underline decoration-orange-500">
                  {certificateData?.userName || "Enrolled Student"}
                </p>
                <p className="text-xs text-slate-300 font-sans">has successfully completed the course curriculum for</p>
                <p className="text-lg font-bold text-orange-400 font-display">{course.title}</p>

                <div className="flex items-center justify-between pt-6 border-t border-slate-700/60 text-xs text-slate-400">
                  <div>
                    <p className="font-bold text-white">{certificateData?.instructorName || course.instructorName}</p>
                    <p className="text-[10px]">Lead Instructor</p>
                  </div>
                  <div>
                    <p className="font-bold text-white">{certificateData?.certificateId || "EPT-2026-MOCK"}</p>
                    <p className="text-[10px]">Certificate ID</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => showToast("Downloading Certificate PDF...")}
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xs font-bold transition-all shadow-lg flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Certificate</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
