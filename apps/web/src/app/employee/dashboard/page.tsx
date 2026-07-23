"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, FileText, CheckCircle2, TrendingUp, ArrowUpRight, Plus, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Button from "@/components/common/Button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProgressBar from "@/components/dashboard/ProgressBar";
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
    { label: "Active Openings", value: data?.stats?.activeOpenings || "00", change: "+4%", status: "up", color: "text-blue-600 bg-blue-50" },
    { label: "Total Applicants", value: data?.stats?.totalApplicants || "00", change: "+12%", status: "up", color: "text-indigo-600 bg-indigo-50" },
    { label: "Ongoing Projects", value: data?.stats?.ongoingProjects || "00", change: "On Track", status: "stable", color: "text-emerald-600 bg-emerald-50" },
    { label: "New AI Matches", value: data?.stats?.newMatches || "00", change: "High Priority", status: "urgent", color: "text-orange-600 bg-orange-50" },
  ];

  const pipelinePhases = data?.pipeline || [
    { name: "Applied", count: 0, height: "h-40" },
    { name: "Interviews", count: 0, height: "h-28" },
    { name: "Offered", count: 0, height: "h-14" },
    { name: "Hired", count: 0, height: "h-8" },
  ];

  const activities = data?.activities || [];
  const deliverables = data?.deliverables || [];

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  const priorityItems: PriorityItem[] = [
    {
      id: "applicants-pending",
      title: "Screen applicants for Senior Dev opening",
      type: "attention",
      description: "5 new candidates matching > 90% in Torus algorithm fit.",
      actionLabel: "Screen Now",
      onAction: () => { window.location.href = "/employee/recruitment"; }
    },
    {
      id: "proposal-draft",
      title: "Draft GlobalTech pricing proposal",
      type: "today",
      description: "AI CRM qualified GlobalTech Solutions as a hot lead. Needs pricing layout.",
      actionLabel: "Generate Proposal",
      onAction: () => { window.location.href = "/employee/recruitment"; }
    },
    {
      id: "review-training",
      title: "Review Student Corporate Course enrollment",
      type: "next",
      description: "Check attendance verification reports for the latest cohorts.",
      actionLabel: "Go to Trainings",
      onAction: () => { window.location.href = "/employee/trainings"; }
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans text-xs"
    >
      {/* Top Banner */}
      <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-mesh-gradient opacity-10 pointer-events-none"></div>
        <div className="space-y-1 relative z-10">
          <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-[9px] uppercase tracking-wider">
            RECRUITER SUITE ACTIVE
          </span>
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            Strategic Overview
          </h1>
          <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
            Welcome back, {data?.userName || "Advisor"}. Here is your recruitment pipeline and active client deliverables for Q4.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-2xl border border-slate-100 shrink-0 relative z-10">
          <div className="h-9 w-9 rounded-xl bg-[#0b172a] text-white flex items-center justify-center font-bold text-sm shrink-0">
            GT
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 leading-none">GlobalTech Solutions</h4>
            <span className="text-[10px] text-slate-400 mt-1 block">Premium Partner</span>
          </div>
        </div>
      </div>

      {/* Action Center Grid */}
      <div className="w-full">
        <DashboardCard glowColor="purple">
          <PriorityAlert items={priorityItems} />
        </DashboardCard>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <DashboardCard key={idx} className="space-y-3" glowColor={idx === 0 ? "blue" : idx === 1 ? "indigo" : idx === 2 ? "purple" : "orange"}>
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                stat.status === "up" ? "text-emerald-600 bg-emerald-50" : stat.status === "urgent" ? "text-orange-600 bg-orange-50" : "text-slate-600 bg-slate-50"
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#0b172a] leading-none tracking-tight">
              {stat.value}
            </p>
          </DashboardCard>
        ))}
      </div>

      {/* Pipeline & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Pipeline */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h2 className="font-display text-base font-bold text-[#0b172a] uppercase tracking-wider">
              Recruitment Pipeline
            </h2>
            <select className="text-xs font-bold text-slate-655 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>

          <div className="flex items-end justify-between h-56 px-4 pt-4 font-sans">
            {pipelinePhases.map((phase: any) => (
              <div key={phase.name} className="flex flex-col items-center gap-3 w-1/4">
                <span className="text-xs font-bold text-[#0b172a]">{phase.count}</span>
                <div 
                  className={`w-full max-w-[40px] rounded-t-xl transition-all duration-500 shadow-md hover:opacity-95`}
                  style={{
                    height: phase.name === "Applied" ? "160px" : phase.name === "Interviews" ? "112px" : phase.name === "Offered" ? "56px" : "32px",
                    backgroundImage: phase.name === "Applied" 
                      ? "linear-gradient(to top, #3b82f6, #60a5fa)" 
                      : phase.name === "Interviews" 
                      ? "linear-gradient(to top, #6366f1, #818cf8)" 
                      : phase.name === "Offered" 
                      ? "linear-gradient(to top, #a855f7, #c084fc)" 
                      : "linear-gradient(to top, #f97316, #fb923c)"
                  }}
                ></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{phase.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <h2 className="font-display text-base font-bold text-[#0b172a] uppercase tracking-wider border-b border-slate-50 pb-3">
            Recent Activity
          </h2>
          <div className="space-y-4 divide-y divide-slate-100 pt-1">
            {activities.map((act: any, idx: number) => (
              <div key={idx} className="space-y-1.5 first:pt-0 pt-3.5">
                <p className="text-xs font-bold text-slate-800 leading-snug">{act.text}</p>
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold font-sans">
                  <span>By {act.author}</span>
                  <span>{act.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Deliverables section */}
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 relative">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-base font-bold text-[#0b172a] uppercase tracking-wider">
            Active Strategic Deliverables
          </h2>
          <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
            View All Projects
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliverables.map((item: any, idx: number) => (
            <div key={idx} className="rounded-2xl border border-slate-100 p-4 space-y-3 flex flex-col justify-between hover:border-slate-200 transition-all bg-slate-50/10">
              <div className="space-y-2">
                <span className={`inline-flex px-2 py-0.5 rounded text-[8.5px] font-bold border uppercase tracking-wider ${
                  item.status === "ACTIVE" 
                    ? "text-blue-700 bg-blue-50 border-blue-100" 
                    : item.status === "OVERDUE" 
                    ? "text-red-700 bg-red-50 border-red-100" 
                    : "text-emerald-700 bg-emerald-50 border-emerald-100"
                }`}>
                  {item.status}
                </span>
                <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.name}</h4>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 font-sans block">{item.due}</span>
            </div>
          ))}
        </div>

        {/* Add Project FAB */}
        <button 
          onClick={() => { window.location.href = "/employee/recruitment"; }}
          className="absolute right-6 bottom-6 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
