"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Search,
  Filter,
  Download,
  Eye,
  Award,
  CheckCircle2,
  Clock,
  RefreshCw,
  Edit3,
  Archive,
  ShieldCheck,
  Building2,
  ChevronDown,
  UserCheck,
  AlertCircle
} from "lucide-react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import Button from "@/components/common/Button";
import { ALLOWED_CATEGORIES } from "@/app/api/suggestions/route";

interface AdminSuggestion {
  id: string;
  submissionId: string;
  userId?: string;
  userName: string;
  userEmail: string;
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
  priority: "Low" | "Medium" | "High" | "Urgent";
  loaEligible: boolean;
  loaStatus?: string;
  loaMarkedBy?: string;
  loaMarkedAt?: string;
  internalRemarks?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  statusHistory?: {
    id: string;
    status: string;
    changedBy: string;
    remarks?: string;
    timestamp: string;
  }[];
}

export default function AdminSuggestionsClient() {
  const [collapsed, setCollapsed] = useState(false);
  const [suggestions, setSuggestions] = useState<AdminSuggestion[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [loaFilter, setLoaFilter] = useState("all");

  // Selected for View / Edit Modal
  const [selectedSuggestion, setSelectedSuggestion] = useState<AdminSuggestion | null>(null);
  const [editStatus, setEditStatus] = useState<string>("Pending");
  const [editPriority, setEditPriority] = useState<string>("Medium");
  const [editLoaEligible, setEditLoaEligible] = useState<boolean>(false);
  const [editInternalRemarks, setEditInternalRemarks] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fetchSuggestions = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryFilter !== "all") params.set("category", categoryFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (priorityFilter !== "all") params.set("priority", priorityFilter);
    if (loaFilter === "eligible") params.set("loaEligible", "true");
    if (loaFilter === "ineligible") params.set("loaEligible", "false");

    fetch(`/api/suggestions?${params.toString()}`)
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
    fetchSuggestions();
  }, [search, categoryFilter, statusFilter, priorityFilter, loaFilter]);

  const openEditModal = (s: AdminSuggestion) => {
    setSelectedSuggestion(s);
    setEditStatus(s.status);
    setEditPriority(s.priority);
    setEditLoaEligible(s.loaEligible);
    setEditInternalRemarks(s.internalRemarks || "");
    setSaveSuccess(false);
  };

  const handleUpdate = async () => {
    if (!selectedSuggestion) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/suggestions/${selectedSuggestion.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          priority: editPriority,
          loaEligible: editLoaEligible,
          internalRemarks: editInternalRemarks
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update suggestion");

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setSelectedSuggestion(null);
        fetchSuggestions();
      }, 900);
    } catch (err: any) {
      alert(err.message || "Failed to save updates.");
    } finally {
      setSaving(false);
    }
  };

  const handleArchiveToggle = async (s: AdminSuggestion) => {
    if (!confirm(`Are you sure you want to ${s.isArchived ? "unarchive" : "archive"} ${s.submissionId}?`)) return;
    try {
      await fetch(`/api/suggestions/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived: !s.isArchived })
      });
      fetchSuggestions();
    } catch (e) {}
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Pending":
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-extrabold text-[10.5px]">⏱️ Pending</span>;
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

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case "Urgent":
        return <span className="text-rose-600 font-extrabold text-[10.5px]">🔥 Urgent</span>;
      case "High":
        return <span className="text-orange-600 font-bold text-[10.5px]">⚡ High</span>;
      case "Medium":
        return <span className="text-slate-600 font-bold text-[10.5px]">Medium</span>;
      case "Low":
        return <span className="text-slate-400 font-medium text-[10.5px]">Low</span>;
      default:
        return <span className="text-slate-600 text-[10.5px]">{p}</span>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <DashboardSidebar role="admin" collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "lg:ml-16" : "lg:ml-64"} overflow-y-auto`}>
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-50 text-orange-500 border border-orange-100">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-[#0b172a]">Ideas &amp; Suggestions Management</h1>
              <p className="text-slate-400 text-[11px] font-semibold">Review submissions, execute status workflows, and manage LOA awards</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSuggestions}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs flex items-center gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>

            <a
              href="/api/suggestions/export"
              target="_blank"
              rel="noopener noreferrer"
              className="h-9 px-4 rounded-xl bg-[#0b172a] hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="h-4 w-4" /> Export CSV
            </a>
          </div>
        </header>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 max-w-7xl">
          
          {/* Controls & Search Toolbar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              
              {/* Search Bar */}
              <div className="sm:col-span-4 relative">
                <Search className="h-4 w-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by Title, ID, Name, Email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 pl-9 pr-3 text-xs focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none font-semibold text-slate-700"
                />
              </div>

              {/* Category Filter */}
              <div className="sm:col-span-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none font-semibold text-slate-700 bg-white"
                >
                  <option value="all">All Categories</option>
                  {ALLOWED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="sm:col-span-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none font-semibold text-slate-700 bg-white"
                >
                  <option value="all">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Implemented">Implemented</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className="sm:col-span-2">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none font-semibold text-slate-700 bg-white"
                >
                  <option value="all">All Priorities</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* LOA Filter */}
              <div className="sm:col-span-2">
                <select
                  value={loaFilter}
                  onChange={(e) => setLoaFilter(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 px-3 text-xs outline-none font-semibold text-slate-700 bg-white"
                >
                  <option value="all">All LOA Status</option>
                  <option value="eligible">LOA Eligible Only</option>
                  <option value="ineligible">Ineligible Only</option>
                </select>
              </div>

            </div>

          </div>

          {/* Submissions Data Table */}
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
              <span className="font-display text-xs font-bold text-[#0b172a]">
                Showing {suggestions.length} Ideas
              </span>
              <span className="text-[10.5px] font-bold text-slate-400">
                Data Table • One-way Audit History
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center space-y-3">
                <div className="h-8 w-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin mx-auto" />
                <p className="text-slate-400 text-xs font-semibold">Loading submissions table...</p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <p className="text-slate-500 text-xs font-bold">No idea suggestions match current filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Submission ID</th>
                      <th className="p-4">Submitter</th>
                      <th className="p-4">Idea Title</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4 text-center">LOA Eligible</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {suggestions.map((s) => (
                      <tr key={s.id} className={`hover:bg-slate-50/80 transition-colors ${s.isArchived ? "opacity-60 bg-slate-50/40" : ""}`}>
                        <td className="p-4 font-mono font-extrabold text-orange-600 whitespace-nowrap">
                          {s.submissionId}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <p className="font-bold text-[#0b172a]">{s.userName}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{s.userEmail}</p>
                        </td>
                        <td className="p-4 max-w-xs">
                          <p className="font-bold text-[#0b172a] truncate">{s.title}</p>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10.5px]">
                            {s.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500 text-[11px] whitespace-nowrap">
                          {new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {getStatusBadge(s.status)}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          {getPriorityBadge(s.priority)}
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          {s.loaEligible ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-bold text-[10.5px]">
                              <Award className="h-3.5 w-3.5 text-emerald-500" /> Yes
                            </span>
                          ) : (
                            <span className="text-slate-400 font-bold text-[11px]">No</span>
                          )}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(s)}
                              className="p-2 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/50 text-slate-700 font-bold text-xs inline-flex items-center gap-1 shadow-sm"
                            >
                              <Edit3 className="h-3.5 w-3.5 text-orange-500" /> Manage
                            </button>
                            <button
                              onClick={() => handleArchiveToggle(s)}
                              title={s.isArchived ? "Unarchive" : "Archive"}
                              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-400 hover:text-slate-700"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                          </div>
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

      {/* Admin Action & Workflow Modal */}
      <AnimatePresence>
        {selectedSuggestion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-3xl w-full text-slate-800 space-y-6 relative shadow-2xl overflow-hidden max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-extrabold text-orange-600 text-xs bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded-lg">
                      {selectedSuggestion.submissionId}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Submitter: {selectedSuggestion.userName} ({selectedSuggestion.userEmail})
                    </span>
                  </div>
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

              {saveSuccess && (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Changes saved successfully! Updating record...</span>
                </div>
              )}

              {/* Admin Workflow Controls */}
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 font-sans text-xs">
                <h4 className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px]">
                  Workflow &amp; Status Controls
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Status Dropdown */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider text-[9.5px] block">
                      Status Workflow *
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-300 px-3 text-xs font-bold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="Pending">⏱️ Pending Review</option>
                      <option value="Under Review">🔍 Under Review</option>
                      <option value="Accepted">✅ Accepted</option>
                      <option value="Implemented">🚀 Implemented</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                  </div>

                  {/* Priority Dropdown */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider text-[9.5px] block">
                      Priority Level *
                    </label>
                    <select
                      value={editPriority}
                      onChange={(e) => setEditPriority(e.target.value)}
                      className="w-full h-10 rounded-xl border border-slate-300 px-3 text-xs font-bold text-slate-800 bg-white outline-none focus:ring-2 focus:ring-orange-500/20"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                      <option value="Urgent">🔥 Urgent</option>
                    </select>
                  </div>

                  {/* LOA Toggle */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-500 uppercase tracking-wider text-[9.5px] block">
                      LOA Eligibility *
                    </label>
                    <button
                      type="button"
                      onClick={() => setEditLoaEligible(!editLoaEligible)}
                      className={`w-full h-10 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
                        editLoaEligible
                          ? "bg-emerald-500 text-white border-emerald-600 shadow-sm"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      <Award className="h-4 w-4" />
                      <span>{editLoaEligible ? "LOA Eligible (YES)" : "Ineligible (NO)"}</span>
                    </button>
                  </div>
                </div>

                {/* Internal Remarks */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 uppercase tracking-wider text-[9.5px] block">
                    Internal Admin Remarks
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Enter private team notes, evaluation rationale, or implementation target date..."
                    value={editInternalRemarks}
                    onChange={(e) => setEditInternalRemarks(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-sans text-slate-800 bg-white outline-none focus:ring-2 focus:ring-orange-500/20 resize-none"
                  />
                </div>
              </div>

              {/* Submission Content Detail */}
              <div className="space-y-4 font-sans text-xs leading-relaxed text-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Category</p>
                    <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-bold">{selectedSuggestion.category}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Submitted On</p>
                    <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-semibold">
                      {new Date(selectedSuggestion.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Idea Description</p>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">{selectedSuggestion.description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Current Problem</p>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">{selectedSuggestion.currentProblem}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Proposed Solution</p>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">{selectedSuggestion.proposedSolution}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Expected Outcome</p>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">{selectedSuggestion.expectedOutcome}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Key Benefits</p>
                    <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">{selectedSuggestion.benefits}</p>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px] mb-1">Why Implement?</p>
                  <p className="bg-slate-50 p-3 rounded-xl border border-slate-200 whitespace-pre-wrap">{selectedSuggestion.whyImplement}</p>
                </div>

                {/* Status History Trail */}
                {selectedSuggestion.statusHistory && selectedSuggestion.statusHistory.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 space-y-2">
                    <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px]">Status History Trail</p>
                    <div className="space-y-1.5">
                      {selectedSuggestion.statusHistory.map((h) => (
                        <div key={h.id} className="flex justify-between items-center text-[10.5px] p-2 bg-slate-50 rounded-lg border border-slate-200/60">
                          <span className="font-bold text-slate-800">{h.status} — {h.remarks || "No remarks"}</span>
                          <span className="text-slate-400 font-semibold">{h.changedBy} ({new Date(h.timestamp).toLocaleDateString()})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <Button onClick={() => setSelectedSuggestion(null)} variant="outline" className="h-10 px-5 rounded-xl text-xs font-bold border-slate-300">
                  Cancel
                </Button>
                <Button onClick={handleUpdate} disabled={saving} variant="primary" className="h-10 px-6 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 shadow-md">
                  {saving ? "Saving Changes..." : "Save Workflow Changes"}
                </Button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
