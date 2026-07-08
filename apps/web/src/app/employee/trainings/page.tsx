"use client";

import { motion } from "framer-motion";
import { BookOpen, Users, Calendar, Clock, Plus } from "lucide-react";
import Button from "@/components/common/Button";

export default function EmployeeTrainingsPage() {
  const corporateBatches = [
    {
      id: 1,
      title: "Agile & DevOps Leadership",
      client: "GlobalTech Solutions",
      startDate: "10 Oct 2026",
      endDate: "12 Dec 2026",
      studentsCount: 28,
      status: "In Progress",
    },
    {
      id: 2,
      title: "Cloud Infrastructure Architecture",
      client: "CapitalOne UK",
      startDate: "1 Nov 2026",
      endDate: "15 Jan 2027",
      studentsCount: 15,
      status: "In Progress",
    },
  ];

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
        <Button variant="primary" size="sm" className="h-9 px-4 rounded-xl font-bold shrink-0 self-start sm:self-auto">
          <Plus className="mr-1 h-4 w-4" /> Create Cohort
        </Button>
      </div>

      <div className="space-y-4">
        {corporateBatches.map((batch) => (
          <div key={batch.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
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
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-4">
                View Schedule
              </Button>
              <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-3">
                Materials
              </Button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
