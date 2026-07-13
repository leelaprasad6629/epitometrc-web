"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, User, Check, X, Search, FileText, Mail } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

import AITalentMatchWidget from "@/components/ai/AITalentMatchWidget";

export default function EmployeeRecruitmentPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchApplicants = () => {
    fetch("/api/employee/recruitment")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setApplicants(payload.applicants);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleUpdateStatus = (appId: string, newStatus: string) => {
    fetch("/api/employee/recruitment", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ applicationId: appId, status: newStatus }),
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          // Refetch applicants list
          fetchApplicants();
        }
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  const filteredApplicants = applicants.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.role.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.status.toLowerCase().includes(q)
    );
  });

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
            Recruitment Portal
          </h1>
          <p className="text-slate-500 text-sm">
            Screen applications, review match scores, and schedule candidate interviews.
          </p>
        </div>
        <Button href="/admin/jobs" variant="primary" size="sm" className="h-9 px-4 rounded-xl font-bold shrink-0 self-start sm:self-auto">
          Add New Job
        </Button>
      </div>

      {/* AI Recruitment Match Tools */}
      <AITalentMatchWidget candidates={applicants} />

      {/* Applicants List */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-[#0b172a]">
          Incoming Candidates ({filteredApplicants.length})
        </h2>

        <div className="space-y-4">
          {filteredApplicants.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-400 font-sans">
              No matching applications found.
            </div>
          ) : (
            filteredApplicants.map((c) => (
              <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4 items-start">
                  <span className="p-2.5 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 shrink-0">
                    <User className="h-5.5 w-5.5" />
                  </span>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h3 className="font-display text-sm font-bold text-[#0b172a] leading-none">{c.name}</h3>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-[9px] font-bold text-emerald-600 border border-emerald-100 leading-none">
                        AI MATCH: {c.matchScore}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                        c.status === "Approved" || c.status === "Hired"
                          ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                          : c.status === "Rejected"
                          ? "text-rose-600 bg-rose-50 border-rose-100"
                          : "text-blue-600 bg-blue-50 border-blue-100"
                      }`}>
                        {c.status}
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
                  {c.status !== "Approved" && c.status !== "Hired" && (
                    <Button
                      onClick={() => handleUpdateStatus(c.id, "Approved")}
                      variant="primary"
                      size="sm"
                      className="h-8 rounded-lg text-xs font-bold px-4 flex-1 md:flex-none"
                    >
                      Approve
                    </Button>
                  )}
                  {c.status !== "Rejected" && (
                    <button
                      onClick={() => handleUpdateStatus(c.id, "Rejected")}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-100 hover:bg-red-50 hover:text-red-500 text-slate-400 transition-colors shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
