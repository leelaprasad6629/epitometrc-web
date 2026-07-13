"use client";

import { useState } from "react";
import { Sparkles, Calendar, BookOpen, AlertTriangle, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/common/Button";
import { TrainingPlannerResult } from "@/lib/ai/types";
import { Input } from "@/components/ui/input";

export default function AICohortPlannerWidget() {
  const [objectives, setObjectives] = useState("Train engineers in cloud databases and automated testing pipelines");
  const [departments, setDepartments] = useState("Engineering & DevOps");
  const [skills, setSkills] = useState("Prisma, PostgreSQL, AWS RDS, CI/CD");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrainingPlannerResult | null>(null);
  const [error, setError] = useState("");

  const handlePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/cohort-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objectives, departments, skills }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setResult(data.result);
      } else {
        setError(data.error || "Failed to generate program outline.");
      }
    } catch {
      setError("Training planner is offline. Request timed out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 font-sans text-xs">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4.5 w-4.5 text-blue-500 animate-pulse" />
        <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
          AI Corporate Training Planner
        </h2>
      </div>
      <p className="text-slate-400 text-xs font-sans leading-relaxed">
        Establish optimized corporate learning groups, structure syllabus timelines, and identify skill gaps automatically.
      </p>

      <form onSubmit={handlePlan} className="space-y-3.5 text-left">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Departments</label>
            <Input
              type="text"
              required
              value={departments}
              onChange={(e) => setDepartments(e.target.value)}
              className="h-10 text-xs rounded-xl border-slate-200 focus:border-orange-500"
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Target Skills</label>
            <Input
              type="text"
              required
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="h-10 text-xs rounded-xl border-slate-200 focus:border-orange-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Learning Objectives</label>
          <textarea
            required
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-slate-600 font-sans leading-relaxed focus:border-orange-500 outline-none h-16 resize-none bg-slate-50/20"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-xl text-xs font-bold"
        >
          {loading ? "Structuring Curriculum..." : "Plan Corporate Training"}
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
            {/* Planner Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-xl bg-orange-50/40 p-3 border border-orange-100/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Training Duration</span>
                <span className="text-base font-black text-orange-600 font-mono">{result.duration}</span>
              </div>
              <div className="rounded-xl bg-blue-50/40 p-3 border border-blue-100/50">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Departments</span>
                <span className="text-base font-black text-blue-600 font-mono">{departments.split(",").length}</span>
              </div>
            </div>

            {/* Target Cohort Groups */}
            <div className="space-y-1.5">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <Users className="h-3.5 w-3.5 text-blue-500" /> Suggested Training Cohort Groups
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.groups.map((group, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-100 p-3 bg-slate-50/50 space-y-1">
                    <h4 className="font-bold text-slate-700">{group.name}</h4>
                    <p className="text-[9.5px] text-slate-400 font-semibold font-sans">Members: {group.members.join(", ")}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Gap Analysis */}
            <div className="space-y-1.5">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" /> Skill Gaps & Dependencies Identified
              </span>
              <ul className="list-disc pl-4 space-y-1 text-slate-500 font-sans leading-relaxed">
                {result.gapAnalysis.map((gap, idx) => <li key={idx}>{gap}</li>)}
              </ul>
            </div>

            {/* Curriculum Roadmap */}
            <div className="space-y-1.5">
              <span className="flex items-center gap-1 font-bold text-slate-700">
                <Calendar className="h-3.5 w-3.5 text-orange-500" /> Weekly Syllabus Curriculum
              </span>
              <ul className="list-decimal pl-4 space-y-1 text-slate-500 font-sans leading-relaxed">
                {result.roadmap.map((r, idx) => <li key={idx}>{r}</li>)}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
