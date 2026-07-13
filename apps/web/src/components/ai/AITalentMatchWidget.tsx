"use client";

import { useState } from "react";
import { Sparkles, Trophy, AlertTriangle, CheckCircle, Info, Target, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { TalentMatchResult, SuitabilityResult } from "@/lib/ai/types";

interface AITalentMatchWidgetProps {
  candidates: { id: number; name: string; role: string; email: string; matchScore: string }[];
}

export default function AITalentMatchWidget({ candidates }: AITalentMatchWidgetProps) {
  const [requirements, setRequirements] = useState("");
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<TalentMatchResult | null>(null);
  const [matchError, setMatchError] = useState("");

  const [selectedCandidate, setSelectedCandidate] = useState<any | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryResult, setSummaryResult] = useState<SuitabilityResult | null>(null);
  const [summaryError, setSummaryError] = useState("");

  const handleTalentMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim() || matchLoading) return;

    setMatchLoading(true);
    setMatchError("");
    setMatchResult(null);

    // Format local candidate profiles for AI evaluation context
    const candidateProfiles = candidates.map((c) => ({
      name: c.name,
      currentRole: c.role,
      email: c.email,
    }));

    try {
      const res = await fetch("/api/ai/talent-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRequirements: requirements, candidates: candidateProfiles }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setMatchResult(data.result);
      } else {
        setMatchError(data.error || "Failed to match candidates.");
      }
    } catch {
      setMatchError("Talent matcher failed. Connection timed out.");
    } finally {
      setMatchLoading(false);
    }
  };

  const handleEvaluateCandidate = async (candidate: any) => {
    setSelectedCandidate(candidate);
    setSummaryLoading(true);
    setSummaryError("");
    setSummaryResult(null);

    try {
      const res = await fetch("/api/ai/candidate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidateData: candidate }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSummaryResult(data.result);
      } else {
        setSummaryError(data.error || "Failed to generate evaluation summary.");
      }
    } catch {
      setSummaryError("Failed to reach suitability server.");
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. AI Talent Matching Search Box */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
          <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
            AI Talent Matching Engine
          </h3>
        </div>
        <p className="text-slate-400 text-xs font-sans leading-relaxed">
          Type job specifications or required skills below to instantly evaluate and rank all incoming applicants.
        </p>

        <form onSubmit={handleTalentMatch} className="flex gap-2">
          <textarea
            required
            rows={1}
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            placeholder="e.g. Needs AWS architecture certificates, Terraform orchestration, Docker containers..."
            className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-600 font-sans focus:border-orange-500 outline-none resize-none bg-slate-50/20 h-10 align-middle leading-normal"
          />
          <button
            type="submit"
            disabled={matchLoading}
            className="h-10 px-5 rounded-xl bg-[#0b172a] text-white hover:bg-orange-500 transition-colors text-xs font-bold shrink-0 shadow-md shadow-blue-500/5 disabled:opacity-50"
          >
            {matchLoading ? "Matching..." : "Match Candidates"}
          </button>
        </form>

        {matchError && (
          <p className="text-red-500 text-[11px] font-semibold">{matchError}</p>
        )}

        {/* Talent Match Results */}
        <AnimatePresence>
          {matchResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="pt-4 border-t border-slate-50 space-y-3"
            >
              <h4 className="text-xs font-bold text-slate-700 font-display">AI Compatibility Rankings:</h4>
              <div className="grid grid-cols-1 gap-2.5">
                {matchResult.candidates.map((c, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 p-3 bg-slate-50/50 flex justify-between items-center text-xs">
                    <div className="space-y-1">
                      <span className="flex items-center gap-1.5 font-bold text-slate-700">
                        <Trophy className="h-3.5 w-3.5 text-orange-500" /> Rank #{c.rank} • {c.name}
                      </span>
                      <p className="text-[10px] text-slate-400 font-semibold font-sans">{c.recommendation}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-orange-600 font-mono">{c.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. Interactive Suitability Detail Overlay */}
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
        <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider flex items-center gap-2">
          <Target className="h-4.5 w-4.5 text-orange-500" />
          AI Candidate Suitability Evaluator
        </h3>
        <p className="text-slate-400 text-xs font-sans leading-relaxed">
          Select an applicant from the incoming list to run a detailed ATS key alignment check.
        </p>

        <div className="flex gap-2">
          {candidates.map((c) => (
            <button
              key={c.id}
              onClick={() => handleEvaluateCandidate(c)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors"
            >
              Analyze {c.name.split(" ")[0]}
            </button>
          ))}
        </div>

        {summaryError && (
          <p className="text-red-500 text-[11px] font-semibold">{summaryError}</p>
        )}

        <AnimatePresence>
          {selectedCandidate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-4 border-t border-slate-50 space-y-4"
            >
              {summaryLoading ? (
                <div className="h-32 rounded-xl bg-slate-50 border border-slate-100 border-dashed flex flex-col items-center justify-center text-center p-4">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent mb-2"></span>
                  <p className="text-slate-400 text-[10.5px] font-semibold font-sans">Generating candidate profile analysis report...</p>
                </div>
              ) : (
                summaryResult && (
                  <motion.div
                    initial={{ y: 15 }}
                    animate={{ y: 0 }}
                    className="space-y-4 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-slate-700">Evaluation: {selectedCandidate.name}</h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-[10px] font-black text-emerald-600 border border-emerald-100">
                        {summaryResult.suitability}
                      </span>
                    </div>

                    <p className="text-slate-500 font-sans leading-relaxed p-3 bg-slate-50 rounded-xl border border-slate-100/50">
                      {summaryResult.summary}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Strengths */}
                      <div className="space-y-1.5">
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Key Strengths
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-500 font-sans">
                          {summaryResult.strengths.map((s, idx) => <li key={idx}>{s}</li>)}
                        </ul>
                      </div>
                      {/* Weaknesses */}
                      <div className="space-y-1.5">
                        <span className="flex items-center gap-1 font-bold text-slate-700">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Gaps & Weaknesses
                        </span>
                        <ul className="list-disc pl-4 space-y-1 text-slate-500 font-sans">
                          {summaryResult.weaknesses.map((w, idx) => <li key={idx}>{w}</li>)}
                        </ul>
                      </div>
                    </div>

                    {/* Interview Focus */}
                    <div className="space-y-1.5">
                      <span className="flex items-center gap-1 font-bold text-slate-700">
                        <Info className="h-3.5 w-3.5 text-blue-500" /> Target Interview Focus Questions
                      </span>
                      <ul className="list-decimal pl-4 space-y-1 text-slate-500 font-sans">
                        {summaryResult.interviewFocus.map((q, idx) => <li key={idx}>{q}</li>)}
                      </ul>
                    </div>
                  </motion.div>
                )
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
