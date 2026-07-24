"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  User,
  Check,
  X,
  Search,
  FileText,
  Mail,
  Phone,
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Calendar,
  MessageSquare,
  CheckCircle2,
  ListFilter,
  ArrowRight,
  Send,
} from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

export default function EmployeeStudentsPage() {
  // Pre-select students tab for this route
  const [tab, setTab] = useState<"applicants" | "students" | "interviews">("students");
  const [applicants, setApplicants] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Selected candidate state
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [candidateDetail, setCandidateDetail] = useState<any | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Recruiter notes
  const [notes, setNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState<string[]>([]);

  // Email generator state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const fetchApplicants = () => {
    fetch("/api/employee/recruitment")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setApplicants(payload.applicants);
        }
      })
      .catch((err) => console.error("Error fetching applicants:", err));
  };

  const fetchStudents = () => {
    fetch("/api/employee/students")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setStudents(payload.students);
        }
      })
      .catch((err) => console.error("Error fetching students:", err));
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/employee/recruitment").then((res) => res.json()),
      fetch("/api/employee/students").then((res) => res.json()),
    ])
      .then(([recData, studData]) => {
        if (recData.success) setApplicants(recData.applicants);
        if (studData.success) setStudents(studData.students);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch individual candidate details
  useEffect(() => {
    if (!selectedUserId) {
      setCandidateDetail(null);
      return;
    }

    setDetailLoading(true);
    fetch(`/api/employee/candidates/${selectedUserId}`)
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setCandidateDetail(payload.candidate);
          // Auto generate email draft
          setEmailSubject(`Update regarding your application - EpitomeTRC`);
          setEmailBody(
            `Hello ${payload.candidate.name},\n\nWe have reviewed your profile and resume matching scores. We are impressed by your qualifications and would like to discuss next steps.\n\nBest regards,\nEpitomeTRC Recruiter Team`
          );
          // Set initial notes
          setSavedNotes([`Candidate profile loaded securely from database.`]);
        }
        setDetailLoading(false);
      })
      .catch(() => setDetailLoading(false));
  }, [selectedUserId]);

  const handleUpdateStatus = (appId: string, newStatus: string) => {
    fetch("/api/employee/recruitment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId: appId, status: newStatus }),
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          fetchApplicants();
          // Update selected detail view if active
          if (candidateDetail) {
            setCandidateDetail((prev: any) => {
              if (!prev) return null;
              return {
                ...prev,
                applications: prev.applications.map((app: any) =>
                  app.id === appId ? { ...app, status: newStatus } : app
                ),
              };
            });
          }
        }
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailBody.trim()) return;

    setSendingEmail(true);
    // Simulate API email dispatch
    setTimeout(() => {
      setSendingEmail(false);
      setEmailStatus("Email sent successfully!");
      setSavedNotes((prev) => [...prev, `Sent email update: "${emailSubject}"`]);
      setTimeout(() => setEmailStatus(null), 3000);
    }, 1200);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setSavedNotes((prev) => [...prev, notes]);
    setNotes("");
  };

  // Filter list based on query, tab, and status filter
  const getFilteredList = () => {
    const query = searchQuery.toLowerCase();
    if (tab === "applicants") {
      return applicants.filter((c) => {
        const matchesQuery =
          c.name.toLowerCase().includes(query) ||
          c.role.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query);
        const matchesStatus = statusFilter === "All" || c.status === statusFilter;
        return matchesQuery && matchesStatus;
      });
    } else if (tab === "students") {
      return students.filter((s) => {
        return (
          s.name.toLowerCase().includes(query) ||
          s.course.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query)
        );
      });
    } else {
      // Interviews tab (applicants in Interviewing state)
      return applicants.filter((c) => {
        const matchesQuery =
          c.name.toLowerCase().includes(query) ||
          c.role.toLowerCase().includes(query) ||
          c.email.toLowerCase().includes(query);
        return matchesQuery && c.status === "Interviewing";
      });
    }
  };

  const filteredList = getFilteredList();

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center bg-slate-50/10">
        <div className="relative flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <Zap className="absolute h-4.5 w-4.5 text-orange-500 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans pb-12"
    >
      {/* Top Banner */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-[#0b172a] sm:text-3xl">
            Candidate & Placement Center
          </h1>
          <p className="text-slate-500 text-sm">
            Unified database matching console for job applicants, cohort students, and live technical interviews.
          </p>
        </div>
      </div>

      {/* Main Console Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: List and Filters */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tabs Menu */}
          <div className="flex rounded-2xl bg-slate-100 p-1">
            <button
              onClick={() => {
                setTab("applicants");
                setSelectedUserId(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === "applicants" ? "bg-white text-[#0b172a] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Applicants ({applicants.length})
            </button>
            <button
              onClick={() => {
                setTab("students");
                setSelectedUserId(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === "students" ? "bg-white text-[#0b172a] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Students ({students.length})
            </button>
            <button
              onClick={() => {
                setTab("interviews");
                setSelectedUserId(null);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                tab === "interviews" ? "bg-white text-[#0b172a] shadow-sm" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Interviews ({applicants.filter((a) => a.status === "Interviewing").length})
            </button>
          </div>

          {/* Search and Filters panel */}
          <div className="bg-white rounded-3xl p-4 border border-slate-150 shadow-sm space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder={`Search ${tab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl w-full text-xs font-semibold"
              />
            </div>

            {tab === "applicants" && (
              <div className="flex items-center gap-2">
                <ListFilter className="h-3.5 w-3.5 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-[11px] font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none flex-1"
                >
                  <option value="All">All Application Statuses</option>
                  <option value="Reviewing">Reviewing</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
            )}
          </div>

          {/* Candidates Scroll List */}
          <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
            {filteredList.length === 0 ? (
              <div className="rounded-3xl border border-slate-150 bg-white p-8 text-center text-slate-400 text-xs font-semibold">
                No matching profiles found.
              </div>
            ) : (
              filteredList.map((c) => {
                const isSelected = selectedUserId === c.userId;
                return (
                  <motion.div
                    key={c.id}
                    onClick={() => setSelectedUserId(c.userId)}
                    whileHover={{ scale: 1.01 }}
                    className={`rounded-2xl border p-4 shadow-sm transition-all duration-200 flex justify-between items-center cursor-pointer ${
                      isSelected
                        ? "bg-orange-50/50 border-orange-200 ring-1 ring-orange-200/50"
                        : "bg-white border-slate-150 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex gap-3 items-center min-w-0">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <User className="h-4.5 w-4.5" />
                      </div>
                      <div className="text-left min-w-0 space-y-0.5">
                        <h3 className="font-display text-xs font-bold text-[#0b172a] truncate">
                          {c.name}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-500 font-sans truncate leading-none">
                          {tab === "students" ? c.course : c.role}
                        </p>
                        <p className="text-[9px] text-slate-400 font-medium font-sans truncate">
                          {c.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0 ml-2">
                      {tab === "students" ? (
                        <span className="text-[10px] font-extrabold text-orange-500 font-sans">
                          {c.progress}% Progress
                        </span>
                      ) : (
                        <>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[8.5px] font-bold text-emerald-600 leading-none">
                            Match: {c.matchScore}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${
                              c.status === "Approved" || c.status === "Hired"
                                ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                                : c.status === "Rejected"
                                ? "text-rose-600 bg-rose-50 border-rose-100"
                                : "text-blue-600 bg-blue-50 border-blue-100"
                            }`}
                          >
                            {c.status}
                          </span>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Candidate Details Console */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!selectedUserId ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="rounded-3xl border border-dashed border-slate-300 p-12 text-center text-slate-400 bg-slate-50/10 min-h-[500px] flex flex-col justify-center items-center gap-3"
              >
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-full text-slate-350 shadow-sm animate-pulse">
                  <User className="h-10 w-10" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-[#0b172a]">
                    No Candidate Selected
                  </h3>
                  <p className="text-[10px] font-medium text-slate-400 max-w-xs mt-1">
                    Select a profile from the incoming pipeline list to view their resume details, AI matched scores, placement tracks, and communication logs.
                  </p>
                </div>
              </motion.div>
            ) : detailLoading ? (
              <motion.div
                key="loading-details"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center min-h-[500px] rounded-3xl bg-white border border-slate-150 shadow-sm"
              >
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
              </motion.div>
            ) : candidateDetail ? (
              <motion.div
                key="candidate-details"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-3xl border border-slate-150 shadow-sm p-6 space-y-6 min-h-[500px]"
              >
                {/* Header Profile Details */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-100">
                  <div className="flex gap-4 items-center">
                    <div className="h-14 w-14 rounded-2xl bg-orange-50 text-orange-500 border border-orange-100 flex items-center justify-center font-bold text-xl shrink-0 shadow-sm">
                      {candidateDetail.name.charAt(0)}
                    </div>
                    <div className="text-left space-y-1">
                      <h2 className="font-display text-lg font-bold text-[#0b172a] leading-none">
                        {candidateDetail.name}
                      </h2>
                      <p className="text-xs text-slate-500 font-medium font-sans">
                        Candidate ID: {candidateDetail.id.slice(0, 8)}... • Joined {candidateDetail.joinedDate}
                      </p>
                      <div className="flex gap-3 text-[10px] font-bold text-slate-450 font-sans flex-wrap pt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-slate-400" />
                          {candidateDetail.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {candidateDetail.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Move/Status Actions */}
                  {candidateDetail.applications.length > 0 && (
                    <div className="flex gap-2">
                      {candidateDetail.applications[0].status !== "Approved" &&
                        candidateDetail.applications[0].status !== "Hired" && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(candidateDetail.applications[0].id, "Approved")
                            }
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                          >
                            <Check className="h-3.5 w-3.5" /> Approve
                          </button>
                        )}
                      {candidateDetail.applications[0].status !== "Interviewing" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(candidateDetail.applications[0].id, "Interviewing")
                          }
                          className="px-3.5 py-1.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 text-xs font-bold shadow-sm transition-all flex items-center gap-1"
                        >
                          <Calendar className="h-3.5 w-3.5" /> Interview
                        </button>
                      )}
                      {candidateDetail.applications[0].status !== "Rejected" && (
                        <button
                          onClick={() =>
                            handleUpdateStatus(candidateDetail.applications[0].id, "Rejected")
                          }
                          className="px-2.5 py-1.5 rounded-xl border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Score Widgets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* ATS Scoring Box */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/20 p-4 space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                      ATS Keyword Score
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border-2 border-emerald-500 flex items-center justify-center font-display font-bold text-xs text-emerald-600">
                        {candidateDetail.resumeDetails?.overallCompleteness || 85}%
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className="text-xs font-bold text-[#0b172a]">Excellent Keyword Fit</span>
                        <span className="text-[10px] text-slate-455 block font-semibold">
                          Matching skills: {candidateDetail.resumeDetails?.verifiedSkills?.slice(0, 3).join(", ") || "Python, Go, JS"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Placement Readiness Gauge */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/20 p-4 space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                      Placement Readiness
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full border-2 border-indigo-500 flex items-center justify-center font-display font-bold text-xs text-indigo-600">
                        {candidateDetail.enrollments[0]?.progress || 75}%
                      </div>
                      <div className="text-left space-y-0.5">
                        <span className="text-xs font-bold text-[#0b172a]">
                          {candidateDetail.enrollments[0]?.progress >= 90 ? "Fully Ready" : "Learning Phase"}
                        </span>
                        <span className="text-[10px] text-slate-455 block font-semibold truncate max-w-[150px]">
                          Cohort: {candidateDetail.enrollments[0]?.courseName || "DevOps Engineering"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Summary Card */}
                <div className="rounded-2xl border border-orange-100 bg-orange-50/15 p-4 space-y-2">
                  <h4 className="text-xs font-bold text-orange-600 uppercase tracking-widest flex items-center gap-1.5 font-sans">
                    <Zap className="h-3.5 w-3.5 fill-orange-500" />
                    AI Profile Summary
                  </h4>
                  <p className="text-xs text-slate-600 font-sans leading-relaxed">
                    {candidateDetail.resumeDetails?.candidateProfile ||
                      `${candidateDetail.name} is showing a high readiness score of ${
                        candidateDetail.enrollments[0]?.progress || 75
                      }% with skills in programming languages. Recommended for engineering and cloud infrastructure placements.`}
                  </p>
                </div>

                {/* Tabbed view for Notes vs Emails */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 flex gap-4">
                    <span className="text-xs font-bold text-[#0b172a] uppercase border-b-2 border-orange-500 pb-2">
                      Recruiter Log & Notes
                    </span>
                  </div>

                  {/* Notes input */}
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Add private evaluation notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="h-9 text-xs font-semibold rounded-xl border-slate-200 focus:border-orange-500 flex-1"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition-all shrink-0"
                    >
                      Save Note
                    </button>
                  </form>

                  {/* Notes logs list */}
                  <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                    {savedNotes.map((n, i) => (
                      <div key={i} className="flex gap-2.5 items-start p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <MessageSquare className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-semibold text-slate-600 font-sans leading-normal">
                          {n}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Recruiter Email Generator */}
                <div className="border-t border-slate-100 pt-5 space-y-4">
                  <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-orange-500" />
                    AI Recruiter Email Generator
                  </h3>

                  <form onSubmit={handleSendEmail} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                        Subject Line
                      </label>
                      <Input
                        type="text"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="h-9 text-xs font-semibold rounded-xl border-slate-200 focus:border-orange-500 w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-sans">
                        Email Body (Editable Draft)
                      </label>
                      <textarea
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        rows={4}
                        className="w-full text-xs font-semibold p-3.5 border border-slate-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl outline-none leading-relaxed font-sans"
                      />
                    </div>

                    <div className="flex justify-between items-center">
                      {emailStatus ? (
                        <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="h-4 w-4" /> {emailStatus}
                        </span>
                      ) : (
                        <div />
                      )}
                      <button
                        type="submit"
                        disabled={sendingEmail}
                        className="px-5 py-2.5 bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60 text-xs font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                      >
                        {sendingEmail ? (
                          "Sending..."
                        ) : (
                          <>
                            Send Email
                            <Send className="h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
