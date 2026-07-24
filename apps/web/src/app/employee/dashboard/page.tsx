"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Award,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Compass,
  Zap,
  Activity,
  Calendar,
  Layers,
} from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
import PriorityAlert, { PriorityItem } from "@/components/dashboard/PriorityAlert";

export default function EmployeeDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employee/dashboard")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setData(payload);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    {
      label: "Active Openings",
      value: data?.stats?.activeOpenings || "0",
      icon: Briefcase,
      color: "from-blue-500/10 to-indigo-500/10 text-blue-600 border-blue-100",
      description: "Live jobs active in matching",
    },
    {
      label: "Total Candidates",
      value: data?.stats?.totalStudents || "0",
      icon: Users,
      color: "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-100",
      description: "Candidates enrolled in system",
    },
    {
      label: "Average ATS Fit",
      value: data?.stats?.averageAtsScore || "0%",
      icon: Award,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-100",
      description: "Average match optimization",
    },
    {
      label: "Placement Readiness",
      value: data?.stats?.placementReadiness || "0%",
      icon: TrendingUp,
      color: "from-orange-500/10 to-amber-500/10 text-orange-600 border-orange-100",
      description: "Candidate cohort course completion",
    },
  ];

  const pipelinePhases = data?.pipeline || [
    { name: "Applied", count: 0 },
    { name: "Interviews", count: 0 },
    { name: "Offered", count: 0 },
    { name: "Hired", count: 0 },
  ];

  const activities = data?.activities || [];
  const deliverables = data?.deliverables || [];

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center bg-slate-50/10">
        <div className="relative flex items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <Zap className="absolute h-5 w-5 text-orange-500 animate-pulse" />
        </div>
      </div>
    );
  }

  const priorityItems: PriorityItem[] = [
    {
      id: "applicants-pending",
      title: "Evaluate incoming resume matches",
      type: "attention",
      description: `There are ${data?.stats?.newMatches || "0"} reviewable applications waiting for screening fit assessment.`,
      actionLabel: "Open Candidate Hub",
      onAction: () => {
        window.location.href = "/employee/recruitment";
      },
    },
    {
      id: "proposal-draft",
      title: "Review active placement interviews",
      type: "today",
      description: `Currently coordinating ${data?.stats?.activeInterviews || "0"} student interview schedules.`,
      actionLabel: "Manage Interviews",
      onAction: () => {
        window.location.href = "/employee/recruitment?tab=interviews";
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 font-sans pb-12"
    >
      {/* Top Welcome Panel */}
      <div className="relative rounded-3xl border border-slate-200/50 bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 p-8 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-100/50 text-orange-600 font-bold text-[10px] uppercase tracking-wider">
              <Zap className="h-3 w-3 fill-orange-500 animate-pulse" />
              Recruiter Hub Active
            </div>
            <h1 className="font-display text-3xl font-extrabold text-[#0b172a] tracking-tight">
              Talent Analytics Overview
            </h1>
            <p className="text-slate-500 text-sm max-w-xl leading-relaxed">
              Welcome back, <span className="font-bold text-slate-800">{data?.userName || "Advisor"}</span>. Monitoring live candidate placements, corporate learning courses, and student credentials.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                window.location.href = "/employee/recruitment";
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#0b172a] text-white hover:bg-slate-800 text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
            >
              Candidate Console
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Action Center - Urgent Tasks */}
      <div className="w-full">
        <DashboardCard glowColor="purple" className="p-1">
          <PriorityAlert items={priorityItems} />
        </DashboardCard>
      </div>

      {/* Database-driven Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              whileHover={{ y: -4 }}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block font-sans">
                  {stat.label}
                </span>
                <div className={`p-2.5 rounded-2xl bg-gradient-to-br border shrink-0 ${stat.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#0b172a] tracking-tight leading-none mb-1">
                  {stat.value}
                </p>
                <span className="text-[10px] font-semibold text-slate-400 block font-sans">
                  {stat.description}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Custom Pipeline Visualization & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Placement Pipeline Chart Card */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-500">
                <Layers className="h-4 w-4" />
              </div>
              <h2 className="font-display text-base font-extrabold text-[#0b172a] uppercase tracking-wider">
                Recruitment Funnel
              </h2>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-xl">
              Live Database Feed
            </span>
          </div>

          {/* Pure-CSS/Tailwind Animated Bar Chart representation */}
          <div className="flex items-end justify-around h-60 px-4 pt-6">
            {pipelinePhases.map((phase: any, index: number) => {
              // Calculate relative heights safely based on count
              const maxCount = Math.max(...pipelinePhases.map((p: any) => p.count), 1);
              const percentage = Math.max(10, Math.round((phase.count / maxCount) * 100));

              return (
                <div key={phase.name} className="flex flex-col items-center gap-3 w-1/4 group">
                  <span className="text-sm font-extrabold text-[#0b172a] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {phase.count}
                  </span>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${percentage}%` }}
                    transition={{ duration: 0.8, delay: index * 0.15 }}
                    className={`w-full max-w-[44px] rounded-t-2xl transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer`}
                    style={{
                      backgroundImage:
                        phase.name === "Applied"
                          ? "linear-gradient(to top, #3b82f6, #60a5fa)"
                          : phase.name === "Interviews"
                          ? "linear-gradient(to top, #6366f1, #818cf8)"
                          : phase.name === "Offered"
                          ? "linear-gradient(to top, #a855f7, #c084fc)"
                          : "linear-gradient(to top, #f97316, #fb923c)",
                    }}
                  />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {phase.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Activity Log */}
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-orange-50 text-orange-500">
                <Activity className="h-4 w-4" />
              </div>
              <h2 className="font-display text-base font-extrabold text-[#0b172a] uppercase tracking-wider">
                System Log
              </h2>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-60 pr-1 divide-y divide-slate-100">
            {activities.map((act: any, idx: number) => (
              <div key={idx} className="space-y-1 pt-3 first:pt-0">
                <p className="text-xs font-bold text-slate-800 leading-snug">{act.text}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-450 font-semibold font-sans">
                  <span>Candidate: {act.author}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {act.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Deliverables Section */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 relative">
        <div className="flex justify-between items-center border-b border-slate-50 pb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-500">
              <Compass className="h-4 w-4" />
            </div>
            <h2 className="font-display text-base font-extrabold text-[#0b172a] uppercase tracking-wider">
              Student Cohorts & Placements
            </h2>
          </div>
          <button
            onClick={() => {
              window.location.href = "/employee/trainings";
            }}
            className="text-xs font-bold text-orange-500 hover:text-orange-655 transition-colors"
          >
            Manage Courses
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {deliverables.map((item: any, idx: number) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-100 p-4 space-y-3 flex flex-col justify-between hover:border-slate-200 transition-all bg-slate-50/10"
            >
              <div className="space-y-2">
                <span
                  className={`inline-flex px-2 py-0.5 rounded text-[8.5px] font-bold border uppercase tracking-wider ${
                    item.status === "IN PROGRESS"
                      ? "text-blue-700 bg-blue-50 border-blue-100"
                      : "text-emerald-700 bg-emerald-50 border-emerald-100"
                  }`}
                >
                  {item.status}
                </span>
                <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.name}</h4>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 font-sans block">
                {item.due}
              </span>
            </div>
          ))}
        </div>

        {/* Floating Add Project Action */}
        <button
          onClick={() => {
            window.location.href = "/employee/recruitment";
          }}
          className="absolute right-6 bottom-6 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-655 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
