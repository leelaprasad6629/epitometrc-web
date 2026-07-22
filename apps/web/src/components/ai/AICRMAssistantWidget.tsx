"use client";

import { useState } from "react";
import { Sparkles, Calendar, Heart, ShieldAlert, Award, ArrowRight, ClipboardList, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";

interface ClientAccount {
  name: string;
  history: string;
}

const CLIENT_ACCOUNTS: ClientAccount[] = [
  {
    name: "Acme Logistics Corp",
    history: `
2026-07-20: Meeting with Acme IT Director. Discussed React and Next.js developer upskilling training for 15 support professionals. Mentions database load lock challenges.
2026-07-15: Email received from Acme Sales coordinator requesting price sheets for IT recruiting services.
2026-07-10: Support Ticket resolved regarding API latency on their fleet tracking module.
`
  },
  {
    name: "MedTech Innovations",
    history: `
2026-06-12: Intro call regarding clinical portal development. Budget estimated at $120,000.
2026-06-05: Client email stating contract approval is delayed due to legal review.
2026-05-18: Phone check-in about developer team allocation limits.
`
  },
  {
    name: "Global Retail Systems",
    history: `
2026-07-18: Consultation session regarding database schema tuning. Discussed indexing.
2026-07-11: Email follow-up sharing technical case studies.
2026-07-02: Phone call mapping out security audit milestones.
`
  }
];

export default function AICRMAssistantWidget() {
  const [selectedClient, setSelectedClient] = useState(CLIENT_ACCOUNTS[0].name);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState("");

  const handleFetchInsights = async (clientName: string) => {
    setLoading(true);
    setError("");
    setResult(null);

    const client = CLIENT_ACCOUNTS.find((c) => c.name === clientName) || CLIENT_ACCOUNTS[0];

    try {
      const res = await fetch("/api/ai/crm-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: client.name,
          interactionHistory: client.history.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to analyze account relationship parameters.");
      }
    } catch {
      setError("CRM assistant telemetry offline. Check backend connectivity.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-5 font-sans text-xs">
      <div className="flex items-center justify-between border-b border-slate-50 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50">
            <ClipboardList className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              AI CRM Account Relationship Manager
            </h3>
            <p className="text-slate-400 text-[10px] font-sans">HubSpot & Zoho Zia Style Client Telemetry Dashboard</p>
          </div>
        </div>
      </div>

      <p className="text-slate-500 text-xs font-sans leading-relaxed">
        Select a corporate account client to index interaction logs, isolate inactive accounts, and identify pending actions or cross-selling triggers.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 items-end text-left">
        <div className="flex-1 w-full space-y-1.5">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
            Select B2B Client Account
          </label>
          <select
            value={selectedClient}
            onChange={(e) => {
              setSelectedClient(e.target.value);
              setResult(null);
            }}
            className="w-full h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-600 font-semibold"
          >
            {CLIENT_ACCOUNTS.map((c, idx) => (
              <option key={idx} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <Button
          onClick={() => handleFetchInsights(selectedClient)}
          disabled={loading}
          className="h-10 px-6 rounded-xl text-xs font-bold shrink-0 w-full sm:w-auto"
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Scanning History...
            </span>
          ) : (
            "Analyze Account History"
          )}
        </Button>
      </div>

      {error && (
        <p className="text-red-500 text-[10px] font-semibold text-center mt-2">{error}</p>
      )}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pt-4 border-t border-slate-50 space-y-4 text-left font-sans"
          >
            {/* Account Status KPI Hud */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex flex-col justify-center items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Account Health</span>
                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider mt-1.5 ${
                  result.clientHealth === "Active"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-rose-50 text-rose-600 border-rose-100"
                }`}>
                  {result.clientHealth}
                </span>
              </div>
              <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100 flex flex-col justify-center items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Inactive Alert</span>
                {result.clientHealth === "Active" ? (
                  <span className="text-slate-400 text-[10px] font-bold mt-1.5 flex items-center gap-1">
                    <Heart className="h-3.5 w-3.5 text-emerald-500 fill-emerald-500" /> Healthy Cadence
                  </span>
                ) : (
                  <span className="text-rose-500 text-[10.5px] font-bold mt-1.5 flex items-center gap-1 animate-pulse">
                    <ShieldAlert className="h-3.5 w-3.5" /> Contact Required
                  </span>
                )}
              </div>
            </div>

            {/* Account executive Summary */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-150 text-[11px] text-slate-655 leading-relaxed">
              <strong>Account Summary:</strong> {result.relationshipSummary}
            </div>

            {/* Interaction timeline summary */}
            <div className="space-y-2.5">
              <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Interaction History Timeline</span>
              <div className="space-y-3 relative border-l border-slate-200 pl-4.5 ml-2 font-sans pt-1">
                {result.timelineSummary?.map((t: any, idx: number) => (
                  <div key={idx} className="relative pb-1">
                    <span className="absolute -left-[24.5px] top-1 h-3.5 w-3.5 rounded-full bg-slate-100 border-2 border-indigo-500 flex items-center justify-center shrink-0"></span>
                    <div className="space-y-0.5 text-left text-xs">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider font-mono">{t.date} | {t.type}</span>
                      <h4 className="font-bold text-slate-700">{t.description}</h4>
                      <p className="text-[10px] text-slate-405 font-medium">Log agent: {t.participant}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pending Actions */}
              <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/10">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <AlertCircle className="h-4 w-4 text-amber-500" /> Pending Actions
                </span>
                <ul className="space-y-2 text-slate-600 font-sans text-[10.5px]">
                  {result.pendingActions?.map((a: any, idx: number) => (
                    <li key={idx} className="flex justify-between items-center bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span>{a.description}</span>
                      <span className={`px-1 py-0.2 rounded text-[8px] font-bold border ${
                        a.priority === "High" ? "bg-red-50 text-red-600 border-red-100" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>{a.priority}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Cross selling Opportunities */}
              <div className="space-y-2 border border-slate-100 rounded-xl p-3 bg-slate-50/10">
                <span className="flex items-center gap-1.5 font-bold text-slate-700">
                  <Award className="h-4 w-4 text-emerald-500" /> Upsell Suggestions
                </span>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-500 font-sans text-[10.5px]">
                  {result.upsellingOpportunities?.map((u: string, idx: number) => <li key={idx}>{u}</li>)}
                </ul>
              </div>
            </div>

            {/* reminders */}
            <div className="rounded-xl border border-dashed border-indigo-200 p-3 bg-indigo-50/10 flex flex-wrap items-center justify-between gap-2 text-left">
              <div className="space-y-0.5">
                <span className="text-[9px] text-slate-400 block uppercase font-bold tracking-wider">Suggested Follow-up Reminder</span>
                <span className="font-bold text-indigo-600 text-[11px] block">{result.reminders?.[0] || "Schedule check-in meeting."}</span>
              </div>
              <button className="flex items-center gap-1 text-[9.5px] font-bold text-indigo-500 hover:text-indigo-600 transition-colors uppercase tracking-wider">
                Create Task <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
