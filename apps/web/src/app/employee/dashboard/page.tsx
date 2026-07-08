"use client";

import { motion } from "framer-motion";
import { Briefcase, Users, FileText, CheckCircle2, TrendingUp, ArrowUpRight, Plus, MapPin, Search } from "lucide-react";
import Image from "next/image";
import Button from "@/components/common/Button";

export default function EmployeeDashboard() {
  const stats = [
    { label: "Active Openings", value: "24", change: "+4%", status: "up", color: "text-blue-600 bg-blue-50" },
    { label: "Total Applicants", value: "1,842", change: "+12%", status: "up", color: "text-indigo-600 bg-indigo-50" },
    { label: "Ongoing Projects", value: "08", change: "On Track", status: "stable", color: "text-emerald-600 bg-emerald-50" },
    { label: "New AI Matches", value: "42", change: "High Priority", status: "urgent", color: "text-orange-600 bg-orange-50" },
  ];

  const pipelinePhases = [
    { name: "Applied", count: 840, height: "h-40" },
    { name: "Interviews", count: 480, height: "h-28" },
    { name: "Offered", count: 120, height: "h-14" },
    { name: "Hired", count: 64, height: "h-8" },
  ];

  const activities = [
    { text: "New application for Senior Cloud Architect", time: "2 hours ago", author: "Sarah Collins" },
    { text: "Milestone 2 Approved: Core Banking Modernization", time: "5 hours ago", author: "Epitome PMO" },
    { text: "Interview scheduled: Candidate ID #8283", time: "Yesterday, 3:30 PM", author: "Recruitment Lead" },
  ];

  const deliverables = [
    { name: "Cloud Infrastructure Migration", status: "IN PROGRESS", statusColor: "text-blue-600 bg-blue-50 border-blue-100", due: "Due Oct 24" },
    { name: "Cybersecurity Audit Q4", status: "AWAITING FEEDBACK", statusColor: "text-amber-600 bg-amber-50 border-amber-100", due: "Due Nov 12" },
    { name: "AI Talent Upskilling", status: "PLANNING", statusColor: "text-slate-500 bg-slate-50 border-slate-200", due: "Due Dec 01" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans"
    >
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            Strategic Overview
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Welcome back, GlobalTech. Here is your recruitment and project performance for Q4.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100 shrink-0">
          <div className="h-9 w-9 rounded-lg bg-[#0b172a] text-white flex items-center justify-center font-bold text-sm shrink-0">
            GT
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 leading-none">GlobalTech Solutions</h4>
            <span className="text-[10px] text-slate-400 mt-1 block">Premium Partner</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
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
          </div>
        ))}
      </div>

      {/* Pipeline & Deliverables grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recruitment Pipeline */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-50 pb-4">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              Recruitment Pipeline
            </h2>
            <select className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none">
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
            </select>
          </div>

          <div className="flex items-end justify-between h-56 px-4 pt-4 font-sans">
            {pipelinePhases.map((phase) => (
              <div key={phase.name} className="flex flex-col items-center gap-3 w-1/4">
                <span className="text-xs font-bold text-[#0b172a]">{phase.count}</span>
                <div className={`w-full max-w-[50px] ${phase.height} bg-gradient-to-t from-orange-500 to-orange-400 rounded-t-lg transition-all shadow-md shadow-orange-500/10 hover:opacity-90`}></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{phase.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
            Recent Activity
          </h2>
          <div className="space-y-4 divide-y divide-slate-100 pt-1">
            {activities.map((act, idx) => (
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
      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 relative">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
            Active Strategic Deliverables
          </h2>
          <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
            View All Projects
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {deliverables.map((item, idx) => (
            <div key={idx} className="rounded-xl border border-slate-100 p-4 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${item.statusColor}`}>
                  {item.status}
                </span>
                <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.name}</h4>
              </div>
              <span className="text-[10px] font-semibold text-slate-400 font-sans block">{item.due}</span>
            </div>
          ))}
        </div>

        {/* Add Project FAB */}
        <button className="absolute right-6 bottom-6 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600 transition-all hover:scale-105 active:scale-95">
          <Plus className="h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
}
