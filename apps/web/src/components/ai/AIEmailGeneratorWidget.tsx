"use client";

import { useState } from "react";
import { Sparkles, Mail, Clipboard, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

interface AIEmailGeneratorWidgetProps {
  candidates: { id: number; name: string; role: string }[];
}

export default function AIEmailGeneratorWidget({ candidates }: AIEmailGeneratorWidgetProps) {
  const [selectedCandidate, setSelectedCandidate] = useState(candidates[0]?.name || "");
  const [emailTone, setEmailTone] = useState("Invite for interview");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const tones = ["Invite for interview", "Offer pitch", "Follow-up"];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    const c = candidates.find((item) => item.name === selectedCandidate) || candidates[0];

    try {
      const res = await fetch("/api/ai/email-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateName: c.name,
          targetJob: c.role,
          emailTone,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to generate outreach email.");
      }
    } catch {
      setError("AI Email Generator is offline. Connection timed out.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.body) return;
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 font-sans text-xs">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
        <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
          AI Recruiter Email Generator
        </h3>
      </div>
      <p className="text-slate-400 text-xs font-sans leading-relaxed">
        Select a target applicant and specify the outreach category. The AI will draft high-impact interview invites and offer letters.
      </p>

      <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end text-left">
        {/* Candidate Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Target Candidate
          </label>
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
          >
            {candidates.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Tone Selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Email Tone / Type
          </label>
          <select
            value={emailTone}
            onChange={(e) => setEmailTone(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
          >
            {tones.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="h-10 rounded-xl text-xs font-bold w-full"
        >
          {loading ? "Drafting Pitch..." : "Generate Outreach Email"}
        </Button>
      </form>

      {error && (
        <p className="text-red-500 text-[10px] font-semibold text-center mt-2">{error}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pt-4 border-t border-slate-50 space-y-3.5 text-left"
          >
            {/* Email Layout */}
            <div className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 space-y-3 relative font-sans">
              <div className="border-b border-slate-200 pb-2.5 space-y-1.5">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Subject Line</span>
                <p className="font-bold text-slate-700 text-xs">{result.subject}</p>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Email Body</span>
                <p className="text-slate-600 text-[11px] font-sans leading-relaxed whitespace-pre-line pr-10">
                  {result.body}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-1.5">
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded hover:bg-slate-200/80 text-slate-500 hover:text-slate-700 transition-colors"
                  title="Copy subject & body"
                >
                  <Clipboard className="h-4 w-4" />
                </button>
              </div>
              {copied && (
                <span className="text-[9px] font-bold text-emerald-600 absolute right-4 top-11">Copied!</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
