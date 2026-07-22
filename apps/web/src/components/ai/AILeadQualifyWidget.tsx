"use client";

import { useState, useEffect } from "react";
import { Sparkles, AlertTriangle, CheckCircle, Building, TrendingUp, UserCheck, AlertCircle, Edit2, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

interface AILeadQualifyWidgetProps {
  enquiries: { type: string; entity: string; date: string; status: string; color: string }[];
}

export default function AILeadQualifyWidget({ enquiries }: AILeadQualifyWidgetProps) {
  const activeEnquiries = enquiries && enquiries.length > 0 ? enquiries : [
    { type: "React Web Dashboard Development", entity: "Acme Corp", date: "2026-07-22", status: "Pending", color: "blue" },
    { type: "AWS Cloud Infrastructure Migration", entity: "Global Health Solutions", date: "2026-07-21", status: "In Progress", color: "amber" },
    { type: "Next.js Consulting & Developer Upskilling", entity: "TechStart Inc", date: "2026-07-19", status: "Completed", color: "emerald" }
  ];

  const [selectedLead, setSelectedLead] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");

  // Override Mode States
  const [isOverrideMode, setIsOverrideMode] = useState(false);
  const [overriddenScore, setOverriddenScore] = useState(85);
  const [overriddenPriority, setOverriddenPriority] = useState("Hot");

  // Sync selectedLead state when activeEnquiries updates
  useEffect(() => {
    if (activeEnquiries.length > 0 && (!selectedLead || !activeEnquiries.some(ae => ae.entity === selectedLead))) {
      setSelectedLead(activeEnquiries[0].entity);
    }
  }, [activeEnquiries]);

  const handleQualify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || loading) return;

    setLoading(true);
    setError("");
    setResult(null);
    setIsOverrideMode(false);

    const lead = activeEnquiries.find((item) => item.entity === selectedLead) || activeEnquiries[0];
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
        setOverriddenScore(data.result.leadScore);
        setOverriddenPriority(data.result.priority);
      } else {
        setError(data.error || "Failed to analyze lead parameters.");
      }
    } catch {
      setError("Lead Qualification is offline. Connection timed out.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyOverride = () => {
    if (!result) return;
    setResult({
      ...result,
      leadScore: overriddenScore,
      priority: overriddenPriority,
      explanation: `[Manager Override Applied] Score adjusted to ${overriddenScore} and Priority changed to ${overriddenPriority}. Initial AI verdict: ${result.explanation}`
    });
    setIsOverrideMode(false);
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-orange-50">
            <Sparkles className="h-4.5 w-4.5 text-orange-500 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              AI Lead Qualification & Analysis Suite
            </h3>
            <p className="text-slate-400 text-[10px] font-sans">Salesforce Einstein & Copilot Powered Pipeline Screening</p>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-xs font-sans leading-relaxed">
        Select an active B2B lead to compute conversion probability, extract business needs, classify firmographics, and identify risk metrics.
      </p>

      <form onSubmit={handleQualify} className="flex flex-col sm:flex-row gap-3 items-end text-left">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Select Active B2B Lead
          </label>
          <select
            value={selectedLead}
            onChange={(e) => setSelectedLead(e.target.value)}
            className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
          >
            {activeEnquiries.map((e, idx) => (
              <option key={idx} value={e.entity}>{e.entity} ({e.type})</option>
            ))}
          </select>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-10 px-6 rounded-xl text-xs font-bold shrink-0 w-full sm:w-auto"
        >
          {loading ? "Analyzing Firmographics..." : "Qualify Lead"}
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="rounded-xl bg-orange-50/40 p-3 border border-orange-100/50">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Lead Score</span>
                <span className="text-lg font-black text-orange-600 font-mono">{result.leadScore}/100</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex flex-col justify-center items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Priority</span>
                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider mt-1 ${
                  result.priority === "Hot"
                    ? "bg-red-50 text-red-600 border-red-100"
                    : result.priority === "Warm"
                    ? "bg-amber-50 text-amber-600 border-amber-100"
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  {result.priority}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex flex-col justify-center items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Conversion Prob</span>
                <span className="text-sm font-black text-emerald-600 font-sans mt-1">{result.conversionProbability}%</span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex flex-col justify-center items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Company Size</span>
                <span className="text-[10px] font-bold text-slate-600 mt-1 uppercase tracking-wider">{result.companySize}</span>
              </div>
            </div>

            {/* Firmographics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-100 p-3 flex items-center gap-2 bg-slate-50/20">
                <Building className="h-4 w-4 text-slate-400" />
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Industry Sector</span>
                  <span className="font-bold text-slate-700">{result.industry}</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-100 p-3 flex items-center gap-2 bg-slate-50/20">
                <TrendingUp className="h-4 w-4 text-slate-400" />
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Primary Business Need</span>
                  <span className="font-bold text-slate-700 truncate block max-w-[200px]">{result.businessNeed}</span>
                </div>
              </div>
            </div>

            {/* Verdict Explanation Box */}
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-[11px] text-slate-655 leading-relaxed font-sans relative">
              <strong>Assessment Verdict:</strong> {result.explanation}
              
              {/* Override controls */}
              <div className="mt-3 flex justify-end">
                {!isOverrideMode ? (
                  <button
                    onClick={() => setIsOverrideMode(true)}
                    className="flex items-center gap-1.5 text-[9.5px] font-bold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    <Edit2 className="h-3 w-3" /> Override AI Recommendations
                  </button>
                ) : (
                  <div className="flex flex-wrap items-center gap-2 border border-orange-100 rounded-lg p-2 bg-orange-50/20 w-full justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="space-y-0.5">
                        <label className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Adjust Score</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={overriddenScore}
                          onChange={(e) => setOverriddenScore(Number(e.target.value))}
                          className="w-14 h-7 border border-slate-200 rounded px-1.5 text-center text-slate-700 font-bold"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <label className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">Adjust Priority</label>
                        <select
                          value={overriddenPriority}
                          onChange={(e) => setOverriddenPriority(e.target.value)}
                          className="h-7 border border-slate-200 rounded px-1.5 text-slate-700 font-bold bg-white"
                        >
                          <option value="Hot">Hot</option>
                          <option value="Warm">Warm</option>
                          <option value="Cold">Cold</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={handleApplyOverride}
                        className="px-2.5 py-1 text-[9px] font-bold bg-orange-500 hover:bg-orange-600 text-white rounded flex items-center gap-1 transition-colors"
                      >
                        <Save className="h-3 w-3" /> Save
                      </button>
                      <button
                        onClick={() => setIsOverrideMode(false)}
                        className="px-2.5 py-1 text-[9px] font-bold bg-slate-200 hover:bg-slate-350 text-slate-600 rounded transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Opportunities & Risks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/10">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500" /> Opportunities Identified
                </span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-500 font-sans text-[10.5px]">
                  {result.opportunities?.map((o: string, idx: number) => <li key={idx}>{o}</li>)}
                </ul>
              </div>
              <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/10">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <AlertTriangle className="h-4 w-4 text-rose-500" /> Pipeline Risk Factors
                </span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-500 font-sans text-[10.5px]">
                  {result.risks?.map((r: string, idx: number) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
            </div>

            {/* Next Best Action Card */}
            <div className="rounded-xl border border-dashed border-blue-200 p-3.5 bg-blue-50/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-blue-500" />
                <div>
                  <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Recommended Next Action</span>
                  <span className="font-bold text-blue-600 text-xs">{result.recommendedNextAction}</span>
                </div>
              </div>
              <Button size="sm" className="h-8 rounded-lg text-[10px] font-bold">
                Execute Action
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
