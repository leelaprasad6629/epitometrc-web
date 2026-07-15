"use client";

import { useState, useEffect } from "react";
import { Sparkles, FileText, CheckCircle2, XCircle, Lightbulb, Download, ArrowRight, Save, User, FileCheck, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Button from "@/components/common/Button";
import { useResumeStore } from "@/lib/ai/store/resumeStore";

interface CoachSuggestion {
  id: string;
  category: "Summary" | "Project" | "Skills" | "GitHub" | "Formatting";
  title: string;
  original: string;
  suggested: string;
  explanation: string;
  status: "pending" | "accepted" | "rejected";
}

export default function AIResumeCoachPage() {
  const { fileName, parsedResumeDetails, selectedJobRole, updateParsedDetails } = useResumeStore();
  const [suggestions, setSuggestions] = useState<CoachSuggestion[]>([]);
  const [optimizedSummary, setOptimizedSummary] = useState("");
  const [optimizedProjects, setOptimizedProjects] = useState("");
  const [optimizedSkills, setOptimizedSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Initialize coach suggestions dynamically based on parsed resume details
  useEffect(() => {
    if (!parsedResumeDetails) return;

    const roleName = selectedJobRole || "Software Developer";
    const userSkills = parsedResumeDetails.technicalSkills || [];
    const summary = parsedResumeDetails.bio || "Dedicated software engineering student.";
    const projectsString = parsedResumeDetails.projects?.map(p => `${p.name}: ${p.description}`).join("\n\n") || "Worked on IT services dashboard configurations.";

    // Set initial optimized values
    setOptimizedSummary(summary);
    setOptimizedProjects(projectsString);
    setOptimizedSkills(userSkills);

    const initialSuggestions: CoachSuggestion[] = [
      {
        id: "summary_01",
        category: "Summary",
        title: "Enhance Professional Summary with Action Verbs",
        original: summary,
        suggested: `Highly motivated and results-oriented ${roleName} with hands-on experience designing full-stack modular platforms. Proven track record of configuring schema-bound Supabase database layers, optimizing layout rendering, and resolving complex API integration blocks.`,
        explanation: "Replaces generic statements with active impact verbs like 'designing', 'configuring', and 'optimizing' to engage recruiter screens.",
        status: "pending"
      },
      {
        id: "proj_01",
        category: "Project",
        title: "Quantify Accomplishments inside Projects",
        original: projectsString,
        suggested: "Architected a responsive data dashboard using Next.js and Tailwind CSS, reducing layout load latencies by 35% and streamlining candidate lead processing pipelines.",
        explanation: "Quantifying your impact ('reducing load latencies by 35%') makes the project description much more convincing to engineering managers.",
        status: "pending"
      },
      {
        id: "skills_01",
        category: "Skills",
        title: "Incorporate Key High-Value Technical Skills",
        original: userSkills.join(", "),
        suggested: [...userSkills, "AWS Cloud Provisioning", "Terraform Infrastructure", "Docker Security Security"].join(", "),
        explanation: "Adds specialized deployment and cloud infrastructure keywords matching standard developer screens.",
        status: "pending"
      },
      {
        id: "github_01",
        category: "GitHub",
        title: "Add GitHub Repository Metrics",
        original: "GitHub Portfolio link.",
        suggested: "Engineered and maintained a public GitHub portfolio showcasing 4 production-grade full-stack repositories with active CI/CD pipeline actions and test coverage.",
        explanation: "Providing repository metrics shows active contribution and familiarity with modern engineering setups.",
        status: "pending"
      }
    ];

    setSuggestions(initialSuggestions);
  }, [parsedResumeDetails, selectedJobRole]);

  // Handle accepting a coach suggestion
  const handleAcceptSuggestion = (id: string) => {
    setSuggestions(prev =>
      prev.map(s => {
        if (s.id === id) {
          // Update corresponding optimized state in real-time
          if (s.category === "Summary") {
            setOptimizedSummary(s.suggested);
          } else if (s.category === "Project") {
            setOptimizedProjects(s.suggested);
          } else if (s.category === "Skills") {
            setOptimizedSkills(s.suggested.split(",").map(x => x.trim()));
          }
          return { ...s, status: "accepted" };
        }
        return s;
      })
    );
  };

  // Handle rejecting a coach suggestion
  const handleRejectSuggestion = (id: string) => {
    setSuggestions(prev =>
      prev.map(s => {
        if (s.id === id) {
          // Revert back to original state
          if (s.category === "Summary" && parsedResumeDetails) {
            setOptimizedSummary(parsedResumeDetails.bio || "");
          } else if (s.category === "Project" && parsedResumeDetails) {
            const formatted = parsedResumeDetails.projects?.map(p => `${p.name}: ${p.description}`).join("\n\n") || "";
            setOptimizedProjects(formatted);
          } else if (s.category === "Skills" && parsedResumeDetails) {
            setOptimizedSkills(parsedResumeDetails.technicalSkills);
          }
          return { ...s, status: "rejected" };
        }
        return s;
      })
    );
  };

  // Save the optimized details back into the student's profile (Zustand store)
  const handleSaveOptimized = () => {
    if (!parsedResumeDetails) return;
    setSaving(true);

    const lines = optimizedProjects.split("\n\n").filter(Boolean);
    const parsedProjectsList = lines.map(line => {
      const parts = line.split(":");
      const name = parts[0]?.trim() || "Project";
      const description = parts.slice(1).join(":")?.trim() || "";
      return { name, description, technologies: [] };
    });

    setTimeout(() => {
      updateParsedDetails({
        bio: optimizedSummary,
        projects: parsedProjectsList,
        technicalSkills: optimizedSkills
      });
      setSaving(false);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }, 800);
  };

  // Download optimized resume as a clean text file
  const handleDownloadTxt = () => {
    if (!parsedResumeDetails) return;

    const resumeContent = `
========================================
OPTIMIZED RESUME - ${parsedResumeDetails.fullName.toUpperCase()}
========================================
Email: ${parsedResumeDetails.email}
Phone: ${parsedResumeDetails.phone}
Education: ${parsedResumeDetails.education}

----------------------------------------
PROFESSIONAL SUMMARY
----------------------------------------
${optimizedSummary}

----------------------------------------
PROJECTS & ACCOMPLISHMENTS
----------------------------------------
${optimizedProjects}

----------------------------------------
TECHNICAL SKILLS
----------------------------------------
${optimizedSkills.join(", ")}
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([resumeContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${parsedResumeDetails.fullName.replace(/\s+/g, "_")}_Optimized_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (!fileName || !parsedResumeDetails) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm space-y-5 text-center min-h-[400px]">
        <FileText className="h-14 w-14 text-slate-300 animate-pulse" />
        <div className="space-y-1.5 max-w-md">
          <h2 className="text-sm font-bold text-[#0b172a] uppercase tracking-wider">No Resume Uploaded</h2>
          <p className="text-slate-500 text-xs leading-relaxed">
            The AI Resume Coach requires an active resume upload to suggest improvements. Please go to your student profile first to upload your CV source.
          </p>
        </div>
        <Button href="/student/profile" variant="primary" className="h-9 rounded-xl px-4 font-bold bg-[#0b172a] hover:bg-slate-800">
          Upload Resume Profile
          <ArrowRight className="ml-2 h-3.5 w-3.5" />
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans text-xs text-left"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            AI Resume Coach & Optimizer
          </h1>
          <p className="text-slate-500 text-sm">
            Review live suggestions from the AI Resume Coach and accept recommendations in real-time.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSaveOptimized}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold transition-colors disabled:opacity-60 shadow-sm shadow-orange-100"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving Changes..." : "Save to Profile"}
          </button>
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold transition-colors shadow-sm"
          >
            <Download className="h-4 w-4" />
            Download TXT
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4.5 w-4.5" />
          Optimized resume details saved successfully to your student profile!
        </div>
      )}

      {/* Split-Screen layout workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Pane: Interactive Coach suggestions list */}
        <div className="space-y-5">
          <h2 className="font-display text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
            AI Suggestions & Coaching Logs
          </h2>

          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className={`rounded-2xl border p-5 shadow-sm space-y-4 bg-white transition-all ${
                  suggestion.status === "accepted"
                    ? "border-emerald-200 bg-emerald-50/5"
                    : suggestion.status === "rejected"
                    ? "border-slate-200 opacity-60"
                    : "border-slate-100 hover:border-slate-200"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 rounded-lg bg-orange-50 border border-orange-100 text-[9px] font-black text-orange-600 uppercase tracking-widest">
                      {suggestion.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 pt-1">{suggestion.title}</h3>
                  </div>
                  <div className="flex gap-1.5">
                    {suggestion.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleAcceptSuggestion(suggestion.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded-lg border border-emerald-100 transition-colors"
                          title="Accept suggestion"
                        >
                          <CheckCircle2 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleRejectSuggestion(suggestion.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded-lg border border-red-100 transition-colors"
                          title="Reject suggestion"
                        >
                          <XCircle className="h-4.5 w-4.5" />
                        </button>
                      </>
                    ) : suggestion.status === "accepted" ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Accepted
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" /> Rejected
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  {/* Original */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Current Text:</span>
                    <p className="text-slate-500 bg-slate-50 p-2.5 rounded-xl font-sans italic line-clamp-2">
                      {suggestion.original}
                    </p>
                  </div>
                  {/* Suggestion */}
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">AI Suggested:</span>
                    <p className="text-slate-800 bg-orange-50/20 p-2.5 rounded-xl font-sans font-medium">
                      {suggestion.suggested}
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400 leading-normal flex items-start gap-1 font-sans font-medium pt-1">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  {suggestion.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Pane: Live Optimized Resume Preview */}
        <div className="space-y-5">
          <h2 className="font-display text-xs font-black text-slate-400 uppercase tracking-wider border-b border-slate-50 pb-2">
            Optimized Resume Preview
          </h2>

          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 text-left relative overflow-hidden">
            {/* Watermark badge */}
            <div className="absolute top-0 right-0 bg-emerald-50 border-b border-l border-emerald-100 text-[9px] font-bold text-emerald-600 px-3 py-1 rounded-bl-xl flex items-center gap-1">
              <FileCheck className="h-3.5 w-3.5 animate-pulse" /> Live Optimized View
            </div>

            {/* Header section */}
            <div className="space-y-1 text-center pt-2">
              <h3 className="font-display text-base font-bold text-[#0b172a] uppercase tracking-wide">
                {parsedResumeDetails.fullName}
              </h3>
              <p className="text-[10.5px] text-slate-500 font-sans">
                {parsedResumeDetails.email} • {parsedResumeDetails.phone} • {parsedResumeDetails.education?.map(e => `${e.degree} (${e.institution})`).join(", ") || parsedResumeDetails.location}
              </p>
            </div>

            {/* Professional Summary */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Professional Biography
              </h4>
              <p className="text-slate-600 font-sans leading-relaxed text-xs font-medium bg-slate-50/45 p-3 rounded-xl border border-slate-100/50">
                {optimizedSummary}
              </p>
            </div>

            {/* Projects */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Projects & Experience
              </h4>
              <p className="text-slate-600 font-sans leading-relaxed text-xs font-medium bg-slate-50/45 p-3 rounded-xl border border-slate-100/50">
                {optimizedProjects}
              </p>
            </div>

            {/* Skills */}
            <div className="space-y-2 border-t border-slate-100 pt-4">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Technical Stack & Skills
              </h4>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {optimizedSkills.map((s, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-[10px] font-bold text-emerald-700 border border-emerald-100"
                  >
                    {s.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
