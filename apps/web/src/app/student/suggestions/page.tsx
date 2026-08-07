"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Plus,
  RefreshCw,
  Eye,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import Button from "@/components/common/Button";
import Link from "next/link";

interface StudentSuggestion {
  id: string;
  submissionId: string;
  title: string;
  category: string;
  description: string;
  currentProblem: string;
  proposedSolution: string;
  expectedOutcome: string;
  benefits: string;
  whyImplement: string;
  additionalNotes?: string;
  status: "Pending" | "Under Review" | "Accepted" | "Implemented" | "Rejected";
  loaEligible: boolean;
  loaStatus?: string;
  createdAt: string;
  statusHistory?: {
    id: string;
    status: string;
    remarks?: string;
    timestamp: string;
  }[];
}

export default function StudentSuggestionsPage() {
  const [collapsed, setCollapsed] = useState(false);
  const [suggestions, setSuggestions] = useState<StudentSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSuggestion, setSelectedSuggestion] = useState<StudentSuggestion | null>(null);

  const fetchUserSuggestions = () => {
    setLoading(true);
    fetch("/api/suggestions")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.suggestions) {
          setSuggestions(data.suggestions);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUserSuggestions();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-[10.5px]">⏱️ Pending Review</span>;
      case "Under Review":
        return <span className="px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-extrabold text-[10.5px]">🔍 Under Review</span>;
      case "Accepted":
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-extrabold text-[10.5px]">✅ Accepted</span>;
      case "Implemented":
        return <span className="px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-extrabold text-[10.5px]">🚀 Implemented</span>;
      case "Rejected":
        return <span className="px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-extrabold text-[10.5px]">❌ Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-[10.5px]">{status}</span>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <DashboardSidebar role="student" collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-64"} overflow-y-auto`}>
        
        {/* Top Bar */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-500 border border-orange-100">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-[#0b172a]">My Ideas &amp; Proposals</h1>
              <p className="text-slate-400 text-[11px] font-semibold">Track submission statuses and Letter of Appreciation (LOA) eligibility</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchUserSuggestions}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <Link
              href="/suggestions"
              className="h-9 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20"
            >
              <Plus className="h-4 w-4" /> Submit New Idea
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 max-w-7xl">
          
          {/* Information Notice */}
          <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-indigo-500/10 border border-orange-200/80 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-display font-bold text-[#0b172a] text-sm">
                <Award className="h-5 w-5 text-orange-500 shrink-0" />
                <span>Letter of Appreciation (LOA) Award System</span>
              </div>
              <p className="text-slate-600 text-xs font-sans leading-relaxed">
                Submissions that produce high strategic value upon implementation earn a formal Letter of Appreciation (LOA). One-way communication platform (edits and replies disabled post-submission).
              </p>
            </div>
            <Link
              href="/suggestions"
              className="h-9 px-4 rounded-xl bg-white border border-slate-200 hover:border-orange-300 text-slate-700 font-bold text-xs shrink-0 shadow-sm flex items-center gap-1"
            >
              Submit Idea <ChevronRight className="h-4 w-4 text-orange-500" />
            </Link>
          </div>

          {/* Submissions Table / Cards */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-[#0b172a]">
                Submitted Ideas ({suggestions.length})
              </h2>
              <span className="text-[11px] font-bold text-slate-400">
                Sorted by latest submission
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center space-y-3">
                <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-slate-400 text-xs font-semibold">Loading your submitted proposals...</p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <div className="h-16 w-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-400">
                  <Lightbulb className="h-8 w-8" />
                </div>
                <div className="space-y-1 max-w-sm mx-auto">
                  <h3 className="font-display font-bold text-slate-800 text-base">No Submissions Found</h3>
                  <p className="text-slate-500 text-xs font-sans leading-relaxed">
                    You haven&apos;t submitted any ideas yet. Share your proposal with the Innovation Team today!
                  </p>
                </div>
                <Button href="/suggestions" variant="primary" className="h-10 px-6 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 text-xs">
                  Submit Your First Idea
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Submission ID</th>
                      <th className="p-4">Idea Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Submitted Date</th>
                      <th className="p-4">Current Status</th>
                      <th className="p-4 text-center">LOA Eligible</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {suggestions.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4 font-mono font-extrabold text-orange-600">
                          {s.submissionId}
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="font-bold text-[#0b172a] truncate">{s.title}</p>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]">
                            {s.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-[11px]">
                          {new Date(s.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(s.status)}
                        </td>
                        <td className="p-4 text-center">
                          {s.loaEligible ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-bold text-[10.5px]">
                              <Award className="h-3.5 w-3.5 text-emerald-500" /> Yes
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold text-[11px]">No</span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => setSelectedSuggestion(s)}
                            className="p-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500" /> View Proposal
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Read-Only Modal Drawer */}
      <AnimatePresence>
        {selectedSuggestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-2xl w-full text-slate-800 space-y-6 relative shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <span className="font-mono font-extrabold text-orange-600 text-xs bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                    {selectedSuggestion.submissionId}
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#0b172a] mt-2">
                    {selectedSuggestion.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedSuggestion(null)}
                  className="p-1.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-600 font-bold text-xs"
                >
                  ✕
                </button>
              </div>

              {/* Status Header */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</p>
                  <p className="font-bold text-slate-800 mt-0.5">{selectedSuggestion.category}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Status</p>
                  <div className="mt-0.5">{getStatusBadge(selectedSuggestion.status)}</div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LOA Eligibility</p>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {selectedSuggestion.loaEligible ? "🏆 Eligible" : "In Review / Pending Value"}
                  </p>
                </div>
              </div>

              {/* Content Fields */}
              <div className="space-y-4 font-sans text-xs leading-relaxed text-slate-700">
                <div>
                  <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">
                    Idea Description
                  </p>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">
                    {selectedSuggestion.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Current Problem</p>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">{selectedSuggestion.currentProblem}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Proposed Solution</p>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">{selectedSuggestion.proposedSolution}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Expected Outcome</p>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">{selectedSuggestion.expectedOutcome}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Key Benefits</p>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">{selectedSuggestion.benefits}</p>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Why Implement?</p>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">{selectedSuggestion.whyImplement}</p>
                </div>

                {selectedSuggestion.additionalNotes && (
                  <div>
                    <p className="font-bold text-slate-500 uppercase tracking-wider text-[10px] mb-1">Additional Notes</p>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 whitespace-pre-wrap">{selectedSuggestion.additionalNotes}</p>
                  </div>
                )}
              </div>

              {/* Read Only Notice Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10.5px] font-semibold text-slate-400">
                <span className="flex items-center gap-1 text-slate-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> One-way platform record (read-only)
                </span>
                <Button onClick={() => setSelectedSuggestion(null)} variant="outline" className="h-9 px-4 rounded-xl text-xs font-bold border-slate-200">
                  Close Detail
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
