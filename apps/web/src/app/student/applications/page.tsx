"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, CheckCircle2, ChevronRight, Clock, MapPin } from "lucide-react";
import Button from "@/components/common/Button";
import Badge from "@/components/common/Badge";

export default function StudentApplicationsPage() {
  const applications = [
    {
      id: 1,
      role: "Strategic Business Consultant",
      company: "EpitomeTRC Group",
      location: "HQ • Remote Friendly",
      appliedDate: "1 Dec 2026",
      status: "Reviewing",
      statusColor: "blue",
      steps: [
        { name: "Application Submitted", date: "1 Dec 2026", completed: true },
        { name: "Resume Screening", date: "3 Dec 2026", completed: true },
        { name: "Technical Assessment", date: "Pending", completed: false },
        { name: "Panel Interview", date: "Pending", completed: false },
      ],
    },
    {
      id: 2,
      role: "IT Developer Internship",
      company: "EpitomeTRC Technology Solutions",
      location: "Virtual Office",
      appliedDate: "20 Nov 2026",
      status: "Interviewing",
      statusColor: "amber",
      steps: [
        { name: "Application Submitted", date: "20 Nov 2026", completed: true },
        { name: "Resume Screening", date: "23 Nov 2026", completed: true },
        { name: "Technical Test", date: "26 Nov 2026", completed: true },
        { name: "Interview Scheduled", date: "9 Dec 2026, 2:00 PM", completed: true },
      ],
    },
  ];

  const getStatusBadge = (status: string, color: string) => {
    return (
      <span
        className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm ${
          color === "blue"
            ? "bg-blue-50 text-blue-600 border border-blue-100"
            : color === "amber"
            ? "bg-amber-50 text-amber-600 border border-amber-100"
            : "bg-emerald-50 text-emerald-600 border border-emerald-100"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          My Applications
        </h1>
        <p className="text-slate-500 text-sm font-sans">
          Track the recruitment progress of your job and internship applications.
        </p>
      </div>

      <div className="space-y-6">
        {applications.map((app) => (
          <div key={app.id} className="rounded-2xl border border-slate-100 bg-white p-5 md:p-6 shadow-sm space-y-6">
            {/* Top Row: Job details & Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-slate-100">
              <div className="flex gap-3.5 items-start">
                <span className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-slate-500 shrink-0">
                  <Briefcase className="h-5.5 w-5.5" />
                </span>
                <div className="space-y-1">
                  <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug">
                    {app.role}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500 font-sans">
                    <span>{app.company}</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {app.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      Applied on {app.appliedDate}
                    </span>
                  </div>
                </div>
              </div>
              <div className="self-end sm:self-auto">
                {getStatusBadge(app.status, app.statusColor)}
              </div>
            </div>

            {/* Application Pipeline Timeline */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                Application Timeline
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {app.steps.map((step, idx) => (
                  <div key={idx} className="relative flex gap-3 sm:flex-col sm:gap-2">
                    <div className="flex flex-col items-center">
                      <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        step.completed
                          ? "bg-emerald-500 text-white"
                          : "border-2 border-slate-200 bg-white text-slate-400"
                      }`}>
                        {idx + 1}
                      </span>
                    </div>
                    <div className="space-y-0.5 pt-0.5 sm:pt-0">
                      <p className="text-xs font-bold text-slate-700">{step.name}</p>
                      <p className="text-[10px] text-slate-400 font-medium font-sans">{step.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
