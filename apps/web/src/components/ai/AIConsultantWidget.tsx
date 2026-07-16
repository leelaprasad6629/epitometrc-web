"use client";

import { useState } from "react";
import { Sparkles, ArrowRight, CheckCircle2, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { BusinessConsultantResult } from "@/lib/ai/types";

export default function AIConsultantWidget() {
  const [requirements, setRequirements] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BusinessConsultantResult | null>(null);
  const [error, setError] = useState("");

  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!requirements.trim() || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/business-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requirements }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to analyze requirements.");
      }
    } catch {
      setError("AI Consultant is temporarily offline. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-slate-50/50 border-t border-b border-slate-100 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center space-y-2 mb-8">
          <span className="rounded bg-blue-50 px-2.5 py-0.5 text-[10px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1 w-max mx-auto border border-blue-100">
            <Sparkles className="h-3 w-3" /> AI Powered
          </span>
          <h2 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            AI Strategic Solution Matcher
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
            Describe your business goals or technological challenges, and our AI consultant will outline recommended IT solutions and services.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
          <form onSubmit={handleConsult} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                Enter Business Goals & Requirements
              </label>
              <textarea
                required
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="e.g. We are a logistics firm looking to automate our fleet management dashboard, securely migrate data to AWS, and upskill 15 support professionals in React/API models..."
                className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-600 font-sans leading-relaxed focus:border-orange-500 outline-none h-28 resize-none bg-slate-50/20"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 rounded-xl text-xs font-bold shadow-md shadow-blue-500/10"
            >
              {loading ? "Analyzing Telemetry..." : "Generate AI Strategic Proposal"}
            </Button>
          </form>

          {error && (
            <p className="text-red-500 text-xs font-semibold text-center mt-2">{error}</p>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="pt-6 border-t border-slate-100 space-y-6 text-left"
              >
                {/* Industry Sector */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-slate-400 text-xs font-semibold font-sans">Detected Sector:</span>
                  <span className="px-2.5 py-0.5 rounded bg-orange-50 text-[10.5px] font-bold text-orange-600 border border-orange-100 uppercase tracking-wider">
                    {result.industry}
                  </span>
                </div>

                {/* Recommended Services */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-[#0b172a] uppercase tracking-wider block">
                    Recommended Epitome Services
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.recommendedServices.map((service, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Roadmap Timeline */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-[#0b172a] uppercase tracking-wider block">
                    Suggested Implementation Roadmap
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {result.roadmap.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-100 p-4 bg-slate-50/50 space-y-1 text-xs">
                        <span className="flex items-center gap-1 font-bold text-blue-600">
                          <Calendar className="h-3.5 w-3.5" /> {item.week}
                        </span>
                        <h5 className="font-bold text-slate-700">{item.title}</h5>
                        <p className="text-slate-400 text-[10.5px] font-semibold font-sans">{item.focus}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Summary Explanation */}
                <div className="rounded-xl bg-orange-50/40 p-4 border border-orange-100/50 text-xs leading-relaxed text-slate-600 space-y-2">
                  <p>{result.explanation}</p>
                  <Button href="/contact" variant="outline" size="sm" className="h-8 text-[10.5px] font-bold rounded-lg border-orange-200 text-orange-600 hover:bg-orange-50 mt-1">
                    Book Consultation Session <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
