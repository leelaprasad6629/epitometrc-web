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

  // Add Schedule Form states
  const [scheduleTitle, setScheduleTitle] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [scheduleLink, setScheduleLink] = useState("");
  const [addingSchedule, setAddingSchedule] = useState(false);

  // Add Material Form states
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialType, setMaterialType] = useState("Document");
  const [materialUrl, setMaterialUrl] = useState("");
  const [addingMaterial, setAddingMaterial] = useState(false);

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

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScheduleBatch || !scheduleTitle.trim() || !scheduleDate.trim() || !scheduleTime.trim()) return;

    setAddingSchedule(true);
    try {
      const res = await fetch(`/api/employee/trainings/${selectedScheduleBatch.id}/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: scheduleTitle,
          date: scheduleDate,
          time: scheduleTime,
          link: scheduleLink,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBatches((prev) =>
          prev.map((b) =>
            b.id === selectedScheduleBatch.id
              ? { ...b, schedules: [...(b.schedules || []), data.schedule] }
              : b
          )
        );
        setSelectedScheduleBatch((prev: any) => ({
          ...prev,
          schedules: [...(prev.schedules || []), data.schedule],
        }));
        setScheduleTitle("");
        setScheduleDate("");
        setScheduleTime("");
        setScheduleLink("");
      } else {
        alert(data.error || "Failed to add schedule");
      }
    } catch {
      alert("Failed to add schedule due to a network error.");
    } finally {
      setAddingSchedule(false);
    }
  };

  const handleAddMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterialsBatch || !materialTitle.trim() || !materialUrl.trim()) return;

    setAddingMaterial(true);
    try {
      const res = await fetch(`/api/employee/trainings/${selectedMaterialsBatch.id}/material`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: materialTitle,
          type: materialType,
          url: materialUrl,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setBatches((prev) =>
          prev.map((b) =>
            b.id === selectedMaterialsBatch.id
              ? { ...b, materials: [...(b.materials || []), data.material] }
              : b
          )
        );
        setSelectedMaterialsBatch((prev: any) => ({
          ...prev,
          materials: [...(prev.materials || []), data.material],
        }));
        setMaterialTitle("");
        setMaterialType("Document");
        setMaterialUrl("");
      } else {
        alert(data.error || "Failed to add material");
      }
    } catch {
      alert("Failed to add material due to a network error.");
    } finally {
      setAddingMaterial(false);
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b172a]/40 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 my-8 animate-in zoom-in-95 duration-200">
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

            <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
              {(!selectedScheduleBatch.schedules || selectedScheduleBatch.schedules.length === 0) ? (
                <p className="text-slate-400 text-xs font-sans text-center py-4 font-medium">No schedules configured yet for this cohort.</p>
              ) : (
                selectedScheduleBatch.schedules.map((step: any, idx: number) => (
                  <div key={step.id || idx} className="flex gap-4 items-start text-xs font-sans">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-50 font-bold text-orange-600 text-[10.5px] border border-orange-100">
                      {idx + 1}
                    </div>
                    <div className="space-y-0.5 flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="font-bold text-slate-700">{step.title}</p>
                        <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">{step.date}</span>
                      </div>
                      <p className="text-slate-500 font-semibold text-[10px]">{step.time}</p>
                      {step.link && (
                        <a href={step.link} target="_blank" rel="noopener noreferrer" className="inline-block text-[10.5px] font-bold text-blue-600 hover:underline mt-0.5">
                          Join Meeting Link
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddSchedule} className="pt-4 border-t border-slate-100 space-y-3">
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Add Schedule Event</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  required
                  placeholder="Event Title (e.g. Intro Session)"
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  className="h-9 text-xs rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                />
                <Input
                  type="date"
                  required
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="h-9 text-xs rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  required
                  placeholder="Time Range (e.g. 14:00 - 15:30)"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="h-9 text-xs rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                />
                <Input
                  type="url"
                  placeholder="Meeting URL (optional)"
                  value={scheduleLink}
                  onChange={(e) => setScheduleLink(e.target.value)}
                  className="h-9 text-xs rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                />
              </div>
              <Button
                type="submit"
                disabled={addingSchedule}
                className="w-full h-9 rounded-xl text-xs font-bold font-sans"
              >
                {addingSchedule ? "Adding Event..." : "Add Event"}
              </Button>
            </form>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                onClick={() => setSelectedScheduleBatch(null)}
                variant="outline"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b172a]/40 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 my-8 animate-in zoom-in-95 duration-200">
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

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              <p className="text-[10.5px] text-slate-450 font-bold uppercase tracking-wider">Available Resources</p>
              
              {(!selectedMaterialsBatch.materials || selectedMaterialsBatch.materials.length === 0) ? (
                <p className="text-slate-400 text-xs font-sans text-center py-4 font-medium">No materials uploaded yet for this cohort.</p>
              ) : (
                selectedMaterialsBatch.materials.map((res: any, idx: number) => (
                  <div key={res.id || idx} className="flex justify-between items-center rounded-xl border border-slate-100 p-3 bg-slate-50/50 hover:bg-slate-100/30 transition-colors text-xs font-sans">
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-700">{res.title}</p>
                      <p className="text-slate-400 font-semibold text-[9.5px] uppercase tracking-wider">{res.type} Resource</p>
                    </div>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 px-3 inline-flex items-center rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-600 font-bold transition-all text-xs"
                    >
                      Open Link
                    </a>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddMaterial} className="pt-4 border-t border-slate-100 space-y-3">
              <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Add Training Material</p>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  required
                  placeholder="Material Title (e.g. Lecture Slides)"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="h-9 text-xs rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
                />
                <select
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  className="h-9 text-xs rounded-xl border border-slate-200 bg-white px-3 font-semibold text-slate-650 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/10 w-full animate-none"
                >
                  <option value="Document">Document</option>
                  <option value="PDF">PDF</option>
                  <option value="Video">Video</option>
                  <option value="Template">Template</option>
                  <option value="Specification">Specification</option>
                </select>
              </div>
              <Input
                type="url"
                required
                placeholder="Resource URL (e.g. https://drive.google.com/...)"
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
                className="h-9 text-xs rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10"
              />
              <Button
                type="submit"
                disabled={addingMaterial}
                className="w-full h-9 rounded-xl text-xs font-bold font-sans"
              >
                {addingMaterial ? "Adding Material..." : "Add Material"}
              </Button>
            </form>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button
                onClick={() => setSelectedMaterialsBatch(null)}
                variant="outline"
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
