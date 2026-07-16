"use client";

import { useState } from "react";
import { Sparkles, Trophy, AlertTriangle, CheckCircle, Mail, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

interface AILeadQualifyWidgetProps {
  enquiries: { type: string; entity: string; date: string; status: string; color: string }[];
}

export default function AILeadQualifyWidget({ enquiries }: AILeadQualifyWidgetProps) {
  const [selectedLead, setSelectedLead] = useState(enquiries[0]?.entity || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");

  const handleQualify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    const lead = enquiries.find((item) => item.entity === selectedLead) || enquiries[0];
    const requirements = `Inquiry received for ${lead.type} from ${lead.entity} dated ${lead.date}. Current status: ${lead.status}.`;

    try {
      const res = await fetch("/api/ai/lead-qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadName: lead.entity,
          email: `${lead.entity.toLowerCase().replace(/\s+/g, "")}@epitometrc.com`,
          requirements,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to analyze lead parameters.");
      }
    } catch {
      setError("Lead Qualification is offline. Connection timed out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 font-sans text-xs">
      <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
        <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
        <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
          AI Lead Qualification Assistant
        </h3>
      </div>
      <p className="text-slate-400 text-xs font-sans leading-relaxed">
        Select a B2B project submission lead to qualify their budget temperature, pinpoint pain points, and match Epitome consulting plans.
      </p>

      <form onSubmit={handleQualify} className="flex gap-2.5 items-end text-left">
        <div className="flex-1 space-y-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Select B2B Lead Entity
          </label>
          <select
            value={selectedLead}
            onChange={(e) => setSelectedLead(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
          >
            {enquiries.map((e, idx) => (
              <option key={idx} value={e.entity}>{e.entity}</option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-10 px-5 rounded-xl text-xs font-bold shrink-0"
        >
          {loading ? "Screening..." : "Qualify Lead"}
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
            className="pt-4 border-t border-slate-50 space-y-4 text-left"
          >
            {/* Qualification HUD Card */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-orange-50/40 p-3 border border-orange-100/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Lead Score</span>
                <span className="text-lg font-black text-orange-600 font-mono">{result.leadScore}/100</span>
              </div>
              <div className="rounded-xl bg-blue-50/40 p-3 border border-blue-100/50 flex flex-col justify-center items-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Tier</span>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wide mt-1">Enterprise B2B</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100/50 text-[11px] text-slate-600 leading-relaxed font-sans">
              <strong>Verdict:</strong> {result.verdict}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pain Points */}
              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Client Pain Points
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-500 font-sans">
                  {result.painPoints.map((p: string, idx: number) => <li key={idx}>{p}</li>)}
                </ul>
              </div>
              {/* Recommended Services */}
              <div className="space-y-1.5">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Recommended Services
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-500 font-sans">
                  {result.recommendedServices.map((s: string, idx: number) => <li key={idx}>{s}</li>)}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
