"use client";

import { motion } from "framer-motion";
import { Briefcase, User, Check, X, Search, FileText, Mail } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

import AITalentMatchWidget from "@/components/ai/AITalentMatchWidget";
import AIEmailGeneratorWidget from "@/components/ai/AIEmailGeneratorWidget";

export default function EmployeeRecruitmentPage() {
  const applicants = [
    {
      id: 1,
      name: "Alice Cooper",
      role: "Senior Cloud Architect",
      matchScore: "96%",
      status: "Applied",
      appliedDate: "Yesterday",
      email: "alice.c@gmail.com",
    },
    {
      id: 2,
      name: "David Miller",
      role: "Frontend Engineer Apprentice",
      matchScore: "88%",
      status: "Reviewing",
      appliedDate: "2 days ago",
      email: "david.m@yahoo.com",
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
            Recruitment Portal
          </h1>
          <p className="text-slate-500 text-sm">
            Screen applications, review match scores, and schedule candidate interviews.
          </p>
        </div>
        <Button variant="primary" size="sm" className="h-9 px-4 rounded-xl font-bold shrink-0 self-start sm:self-auto">
          Add New Job
        </Button>
      </div>

      {/* AI Recruitment Match Tools */}
      <AITalentMatchWidget candidates={applicants} />

      {/* Applicants List */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-[#0b172a]">
          Incoming Candidates ({applicants.length})
        </h2>

        <div className="space-y-4">
          {applicants.map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-start">
                <span className="p-2.5 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 shrink-0">
                  <User className="h-5.5 w-5.5" />
                </span>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-display text-sm font-bold text-[#0b172a] leading-none">{c.name}</h3>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-600 border border-emerald-100">
                      AI MATCH: {c.matchScore}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 font-sans leading-none">{c.role}</p>
                  <p className="text-[10px] text-slate-400 font-medium font-sans">
                    {c.email} • Applied {c.appliedDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 md:pt-0 w-full md:w-auto">
                <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-3">
                  <FileText className="mr-1 h-3.5 w-3.5" /> Resume
                </Button>
                <Button variant="primary" size="sm" className="h-8 rounded-lg text-xs font-bold px-4 flex-1 md:flex-none">
                  Approve
                </Button>
                <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors shrink-0">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recruiter Email Generator */}
      <AIEmailGeneratorWidget candidates={applicants} />
    </motion.div>
  );
}
