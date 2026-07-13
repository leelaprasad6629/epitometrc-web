"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, Lightbulb, ListCollapse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { ResumeMatchResult } from "@/lib/ai/types";

export default function AIResumeMatchWidget() {
  const [selectedJob, setSelectedJob] = useState("Frontend Engineer Apprentice");
  const [resumeText, setResumeText] = useState("Alex Thompson. B.Sc. Computer Science. Verified skills: React.js, TypeScript, Tailwind CSS, Next.js, Zustand, Framer Motion. Project experience: Building clean microfrontends and premium UI panels.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeMatchResult | null>(null);
  const [error, setError] = useState("");

  const jobs = [
    { title: "Frontend Engineer Apprentice", desc: "Builds premium React layouts, tailwind configurations, and coordinates mock video modules." },
    { title: "Senior Cloud Architect", desc: "Manages AWS migration databases, designs Terraform configurations, CI/CD pipelines, and secure API gateways." },
  ];

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    const job = jobs.find((j) => j.title === selectedJob) || jobs[0];

    try {
      const res = await fetch("/api/ai/resume-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobTitle: job.title,
          jobDescription: job.desc,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to parse match.");
      }
    } catch {
      setError("Resume matcher failed. Network timeout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 font-sans text-xs">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
        <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
          AI Resume Match Analyzer
        </h2>
      </div>
      <p className="text-slate-400 text-xs font-sans leading-relaxed">
        Verify your resume ATS compatibility score and get roadmap suggestions for your target employment opening.
      </p>

      <form onSubmit={handleMatch} className="space-y-3.5 text-left">
        {/* Job selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Target Job Opening
          </label>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
          >
            {jobs.map((j) => (
              <option key={j.title} value={j.title}>{j.title}</option>
            ))}
          </select>
        </div>

        {/* Resume Text */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Resume Text (extracted details)
          </label>
          <textarea
            required
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-slate-600 font-sans leading-relaxed focus:border-orange-500 outline-none h-20 resize-none bg-slate-50/20"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-9 rounded-xl text-xs font-bold"
        >
          {loading ? "Calculating ATS Score..." : "Analyze Match"}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-[10px] font-semibold text-center">{error}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pt-4 border-t border-slate-50 space-y-4 text-left"
          >
            {/* ATS Match Gauge */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-orange-50/40 p-3 border border-orange-100/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ATS Score</span>
                <span className="text-lg font-black text-orange-600 font-mono">{result.atsScore}%</span>
              </div>
              <div className="rounded-xl bg-emerald-50/40 p-3 border border-emerald-100/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Job Match</span>
                <span className="text-lg font-black text-emerald-600 font-mono">{result.matchPercentage}%</span>
              </div>
            </div>

            {/* Gaps / Missing keywords */}
            <div className="space-y-1.5">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Missing Key Keywords / Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {result.missingSkills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 rounded bg-red-50 text-[10px] font-bold text-red-600 border border-red-100">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-1.5">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <Lightbulb className="h-3.5 w-3.5 text-orange-500" /> Resume Optimizations
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-500 font-sans leading-relaxed">
                {result.suggestions.map((s, idx) => <li key={idx}>{s}</li>)}
              </ul>
            </div>

            {/* Roadmap */}
            <div className="space-y-1.5">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <ListCollapse className="h-3.5 w-3.5 text-blue-500" /> Targeted Upskilling Roadmap
              </span>
              <ul className="list-decimal pl-4 space-y-1 text-slate-500 font-sans leading-relaxed">
                {result.roadmap.map((r, idx) => <li key={idx}>{r}</li>)}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
