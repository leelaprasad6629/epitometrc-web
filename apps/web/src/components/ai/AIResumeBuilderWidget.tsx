"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2, Clipboard, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

export default function AIResumeBuilderWidget() {
  const [jobRole, setJobRole] = useState("Frontend Engineer Apprentice");
  const [rawExperience, setRawExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleBuild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawExperience.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch("/api/ai/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobRole, rawExperience }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to structure resume summary.");
      }
    } catch {
      setError("AI Resume Builder is offline. Connection timed out.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.polishedBio) return;
    navigator.clipboard.writeText(result.polishedBio);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 font-sans text-xs">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
        <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
          AI Professional Resume Builder
        </h3>
      </div>
      <p className="text-slate-400 text-xs font-sans leading-relaxed">
        Input target job roles and rough descriptions of your past projects or roles to construct high-impact professional biographies and resume points.
      </p>

      <form onSubmit={handleBuild} className="space-y-3.5 text-left">
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Target Job Opening
          </label>
          <input
            type="text"
            required
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Full-Stack Developer Apprentice"
            className="w-full h-10 rounded-xl border border-slate-200 px-3.5 text-xs text-slate-600 focus:border-orange-500 outline-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Describe Past Project Experience (Rough notes)
          </label>
          <textarea
            required
            value={rawExperience}
            onChange={(e) => setRawExperience(e.target.value)}
            placeholder="e.g. designed student dashboard pages using tailwind, optimized postgres database tables, set up secure session cookies"
            className="w-full rounded-xl border border-slate-200 p-3 text-slate-600 font-sans leading-relaxed focus:border-orange-500 outline-none h-20 resize-none bg-slate-50/20"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-9 rounded-xl text-xs font-bold"
        >
          {loading ? "Polishing Bullet Points..." : "Optimize Resume Descriptions"}
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
            {/* Biography */}
            <div className="space-y-1.5 p-3.5 rounded-xl bg-orange-50/40 border border-orange-100/50 relative">
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-wider block">
                Polished Professional Bio
              </span>
              <p className="text-slate-600 text-[11px] font-sans leading-relaxed pr-8">
                {result.polishedBio}
              </p>
              <button
                onClick={handleCopy}
                className="absolute top-3.5 right-3.5 p-1 rounded hover:bg-orange-100 text-orange-500 transition-colors"
                title="Copy to Clipboard"
              >
                <Clipboard className="h-4 w-4" />
              </button>
              {copied && (
                <span className="text-[9px] font-bold text-emerald-600 absolute right-3.5 top-9">Copied!</span>
              )}
            </div>

            {/* Bullets */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                Polished Resume Bullet Points
              </span>
              <ul className="space-y-2 pl-1 font-sans">
                {result.bullets.map((b: string, idx: number) => (
                  <li key={idx} className="flex gap-2 items-start text-slate-500 leading-relaxed text-[11px]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
