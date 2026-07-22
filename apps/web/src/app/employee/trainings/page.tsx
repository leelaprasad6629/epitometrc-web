"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Calendar, Clock, Plus, X } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

export default function EmployeeTrainingsPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Cohort Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [creating, setCreating] = useState(false);
  const [selectedScheduleBatch, setSelectedScheduleBatch] = useState<any | null>(null);
  const [selectedMaterialsBatch, setSelectedMaterialsBatch] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/employee/trainings")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setBatches(payload.batches);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCreateCohort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/employee/trainings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBatches((prev) => [data.batch, ...prev]);
        setNewTitle("");
        setShowCreateModal(false);
      } else {
        alert(data.error || "Failed to create cohort");
      }
    } catch {
      alert("Failed to create cohort due to a network error.");
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            Corporate Trainings
          </h1>
          <p className="text-slate-500 text-sm">
            Manage your corporate learning cohorts, training materials, and schedules.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          size="sm"
          className="h-9 px-4 rounded-xl font-bold shrink-0 self-start sm:self-auto"
        >
          <Plus className="mr-1 h-4 w-4" /> Create Cohort
        </Button>
      </div>

      <div className="space-y-4">
        {batches.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-400 font-sans">
            No active corporate training cohorts found.
          </div>
        ) : (
          batches.map((batch) => (
            <div key={batch.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start gap-4 pb-3 border-b border-slate-50">
                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug">
                    {batch.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 font-sans leading-none">Client: {batch.client}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 uppercase tracking-wider">
                  {batch.status}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-sans text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  {batch.startDate} - {batch.endDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  {batch.studentsCount} Professionals
                </span>
              </div>

              <div className="flex gap-2 pt-1.5">
                <Button
                  onClick={() => setSelectedScheduleBatch(batch)}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg text-xs font-bold px-4"
                >
                  View Schedule
                </Button>
                <Button
                  onClick={() => setSelectedMaterialsBatch(batch)}
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-lg text-xs font-bold px-3"
                >
                  Materials
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Cohort Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-display text-base font-bold text-[#0b172a]">
                Create Corporate Cohort
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCohort} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider block">
                  Cohort / Course Title
                </label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Executive Strategy & Business Intelligence"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-11 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10 w-full"
                />
              </div>

              <div className="flex gap-2 pt-2 justify-end">
                <Button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  variant="outline"
                  className="h-10 rounded-xl px-4 font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="h-10 rounded-xl px-5 font-bold text-xs shadow-md shadow-orange-500/15"
                >
                  {creating ? "Creating..." : "Create Cohort"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* View Schedule Modal */}
      {selectedScheduleBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-display text-base font-bold text-[#0b172a]">
                  Training Schedule
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedScheduleBatch.title}</p>
              </div>
              <button
                onClick={() => setSelectedScheduleBatch(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
              {[
                { title: "Week 1-2: Foundation & Alignment", desc: "Introduction to business requirements, tech stack setup, and client spec scoping." },
                { title: "Week 3-4: System Blueprint Design", desc: "Database schema modeling, API structures configuration, and architectural mapping." },
                { title: "Week 5-6: Sprint Execution", desc: "Core business logic programming, UI layouts validation, and state hook integration." },
                { title: "Week 7-8: Testing & Staging Deployment", desc: "Rigorous quality check tests, type safety audits, and production staging releases." }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-4 items-start text-xs font-sans">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-600 text-[10.5px] border border-orange-100">
                    {idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-700">{step.title}</p>
                    <p className="text-slate-500 font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                onClick={() => setSelectedScheduleBatch(null)}
                className="h-9 rounded-xl px-4 font-bold text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Materials Modal */}
      {selectedMaterialsBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div>
                <h3 className="font-display text-base font-bold text-[#0b172a]">
                  Training Materials
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{selectedMaterialsBatch.title}</p>
              </div>
              <button
                onClick={() => setSelectedMaterialsBatch(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="text-[10.5px] text-slate-400 font-bold uppercase tracking-wider">Available Resources</p>
              
              {[
                { name: "Syllabus_Overview.pdf", size: "2.4 MB", type: "Document" },
                { name: "Tech_Architecture_Spec.docx", size: "1.8 MB", type: "Specification" },
                { name: "Weekly_Feedback_Template.xlsx", size: "850 KB", type: "Template" }
              ].map((res, idx) => (
                <div key={idx} className="flex justify-between items-center rounded-xl border border-slate-100 p-3 bg-slate-50/50 hover:bg-slate-100/30 transition-colors text-xs font-sans">
                  <div className="space-y-0.5">
                    <p className="font-bold text-slate-700">{res.name}</p>
                    <p className="text-slate-400 font-semibold text-[9.5px] uppercase tracking-wider">{res.type} • {res.size}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading ${res.name}...`)}
                    className="h-8 px-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-600 font-bold transition-all"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                onClick={() => setSelectedMaterialsBatch(null)}
                className="h-9 rounded-xl px-4 font-bold text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
