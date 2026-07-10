"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, UserCheck, Search, ShieldCheck } from "lucide-react";
import Button from "@/components/common/Button";

export default function EmployeeAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/employee/attendance")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setRecords(payload.records);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Present" ? "Absent" : "Present";
    
    // Optimistically update state
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus } : r))
    );

    fetch("/api/employee/attendance", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enrollmentId: id, status: nextStatus }),
    })
      .then((res) => res.json())
      .then((payload) => {
        if (!payload.success) {
          // Revert if API failed
          setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: currentStatus } : r))
          );
        }
      })
      .catch(() => {
        // Revert on network error
        setRecords((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: currentStatus } : r))
        );
      });
  };

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
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          Attendance Tracker
        </h1>
        <p className="text-slate-500 text-sm">
          Log daily student attendance and verify participation across training batches.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
        <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-orange-500" />
          Today's Roster ({records.length})
        </h2>

        <div className="space-y-3.5 pt-1">
          {records.length === 0 ? (
            <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-slate-400 font-sans">
              No students enrolled to track attendance for today.
            </div>
          ) : (
            records.map((r) => (
              <div key={r.id} className="flex justify-between items-center gap-4 p-3.5 border border-slate-50 rounded-xl hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-800 leading-none">{r.name}</p>
                  <span className="text-[10px] font-semibold text-slate-400 font-sans block">{r.course}</span>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                    r.status === "Present"
                      ? "bg-green-50 text-green-600 border-green-100"
                      : "bg-red-50 text-red-600 border-red-100"
                  }`}>
                    {r.status}
                  </span>
                  <Button
                    onClick={() => handleToggleStatus(r.id, r.status)}
                    variant="outline"
                    size="sm"
                    className="h-7 text-[10px] rounded-lg px-2.5 font-bold"
                  >
                    Toggle
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}
