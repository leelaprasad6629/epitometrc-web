"use client";

import { motion } from "framer-motion";
import { BarChart3, TrendingUp, ShieldCheck, Download } from "lucide-react";
import Button from "@/components/common/Button";

export default function AdminAnalyticsPage() {
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
            Analytics & Reports
          </h1>
          <p className="text-slate-500 text-sm">
            Review detailed operational reports, user metrics, and placement analytics.
          </p>
        </div>
        <Button variant="primary" size="sm" className="h-9 px-4 rounded-xl font-bold shrink-0 self-start sm:self-auto">
          <Download className="mr-1 h-4 w-4" /> Download Full Spec
        </Button>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 max-w-xl">
        <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider flex items-center gap-2">
          <BarChart3 className="h-4.5 w-4.5 text-orange-500" /> System Growth KPI
        </h2>
        <div className="h-40 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-semibold text-slate-400 font-sans">
          Operational telemetry and performance analytics charts loading...
        </div>
      </div>
    </motion.div>
  );
}
