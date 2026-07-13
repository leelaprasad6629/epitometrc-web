"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, DollarSign, Award, CheckCircle2, TrendingUp, Download, Clock, Search, HelpCircle, ShieldCheck } from "lucide-react";
import Button from "@/components/common/Button";

import AICohortPlannerWidget from "@/components/ai/AICohortPlannerWidget";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setStats(payload.stats);
          setRecentEnquiries(payload.recentEnquiries);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const pendingTasks = [
    { title: "Review 5 new job postings", due: "Due Today, 5:00 PM" },
    { title: "Approve 12 internships", due: "Due in 2 days" },
    { title: "Verify Consultant Credentials", due: "Due in 3 days" },
  ];

  const verticalMix = [
    { name: "Consulting", percentage: 42, color: "bg-blue-500" },
    { name: "Recruitment", percentage: 25, color: "bg-indigo-500" },
    { name: "IT Services", percentage: 11, color: "bg-emerald-500" },
    { name: "Training", percentage: 22, color: "bg-orange-500" },
  ];

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
      {/* Top Header Row */}
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            Executive Overview
          </h1>
          <p className="text-slate-500 text-sm">
            Real-time performance tracking for EpitomeTRC verticals.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <select className="text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none">
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
          <Button variant="outline" size="sm" className="h-9 px-4 rounded-xl font-bold flex items-center gap-1.5 border-slate-200 hover:bg-slate-50 text-slate-600">
            <Download className="h-4 w-4" /> Export Report
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {stat.label}
              </span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                stat.status === "up" ? "text-emerald-600 bg-emerald-50" : stat.status === "down" ? "text-rose-600 bg-rose-50" : "text-slate-600 bg-slate-50"
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

      {/* AI Cohort Planner */}
      <AICohortPlannerWidget />

      {/* Charts & Tasks Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-6">
          <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
            Revenue Growth Overview
          </h2>

          {/* Simple CSS bar chart visualization */}
          <div className="flex items-end justify-between h-56 px-4 pt-4 font-sans border-b border-slate-100 pb-2">
            {[
              { m: "Jan", val: "$34k", h: "h-24" },
              { m: "Feb", val: "$40k", h: "h-28" },
              { m: "Mar", val: "$48k", h: "h-36" },
              { m: "Apr", val: "$38k", h: "h-26" },
              { m: "May", val: "$56k", h: "h-44" },
              { m: "Jun", val: "$64k", h: "h-48" },
            ].map((month) => (
              <div key={month.m} className="flex flex-col items-center gap-2 w-1/6">
                <span className="text-[10px] font-bold text-slate-400">{month.val}</span>
                <div className={`w-full max-w-[32px] ${month.h} bg-[#0b172a] rounded-t hover:bg-orange-500 transition-colors`}></div>
                <span className="text-[10px] font-bold text-slate-500">{month.m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Tasks */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
            Pending Tasks
          </h2>

          <div className="space-y-3.5 pt-1">
            {pendingTasks.map((t, idx) => (
              <div key={idx} className="flex justify-between items-start gap-4 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-700 leading-snug">{t.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium font-sans">{t.due}</p>
                </div>
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5"></span>
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full h-9 rounded-xl text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50">
            View All Tasks
          </Button>
        </div>
      </div>

      {/* Enquiries & Vertical Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Enquiries Table */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              Recent Enquiries
            </h2>
            <button className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
              View History
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                  <th className="py-2.5 font-bold">Service Type</th>
                  <th className="py-2.5 font-bold">Entity</th>
                  <th className="py-2.5 font-bold">Date Received</th>
                  <th className="py-2.5 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
                {recentEnquiries.map((e, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-[#0b172a]">{e.type}</td>
                    <td className="py-3">{e.entity}</td>
                    <td className="py-3 text-slate-400">{e.date}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                        e.color === "emerald"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : e.color === "amber"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-blue-50 text-blue-600 border-blue-100"
                      }`}>
                        {e.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Vertical Mix */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-5">
          <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
            Vertical Mix
          </h2>

          <div className="space-y-3.5">
            {verticalMix.map((v) => (
              <div key={v.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-slate-600">
                  <span>{v.name}</span>
                  <span>{v.percentage}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full rounded-full ${v.color}`} style={{ width: `${v.percentage}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600">
              <span>Growth Target</span>
              <span className="text-emerald-500">92%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: "92%" }}></div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">8% growth from matching systems.</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
