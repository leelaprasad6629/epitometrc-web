"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, UserCheck, ShieldCheck, AlertOctagon, RefreshCw } from "lucide-react";
import Button from "@/components/common/Button";

export default function EmployeeAttendancePage() {
  const [records, setRecords] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = () => {
    setLoading(true);
    fetch(`/api/employee/attendance?date=${selectedDate}`)
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setRecords(payload.records);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "Present" ? "Absent" : "Present";
    
    // Optimistically update local state status & set verified = false temporarily during network request
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: nextStatus, verified: false } : r))
    );

    fetch("/api/employee/attendance", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ enrollmentId: id, status: nextStatus, date: selectedDate }),
    })
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          // Re-fetch to load signed status and signatures correctly from backend
          fetchAttendance();
        } else {
          // Revert if API failed
          setRecords((prev) =>
            prev.map((r) => (r.id === id ? { ...r, status: currentStatus, verified: true } : r))
          );
        }
      })
      .catch(() => {
        // Revert on network error
        setRecords((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status: currentStatus, verified: true } : r))
        );
      });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans text-xs max-w-4xl mx-auto px-4"
    >
      {/* Header Panel */}
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            Attendance Tracker
          </h1>
          <p className="text-slate-500 text-sm">
            Log daily student attendance, verify security signatures, and inspect historical logs.
          </p>
        </div>
        
        {/* Date Selector input */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-slate-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 px-3 py-1.5 outline-none bg-white text-slate-700 font-semibold focus:border-orange-500 transition-colors cursor-pointer"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left">
        <div className="flex items-center justify-between border-b border-slate-50 pb-2">
          <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider flex items-center gap-2">
            <UserCheck className="h-4.5 w-4.5 text-orange-500" />
            Attendance Roster ({records.length})
          </h2>
          <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
            Registry Key: Active
          </span>
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-6 w-6 text-orange-500 animate-spin" />
            <p className="text-slate-500 font-medium">Querying cryptographically signed attendance records...</p>
          </div>
        ) : (
          <div className="space-y-3.5 pt-1">
            {records.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-400 font-sans">
                No active students enrolled to track attendance for {selectedDate}.
              </div>
            ) : (
              records.map((r) => (
                <div key={r.id} className="flex justify-between items-center gap-4 p-3.5 border border-slate-50 rounded-xl hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 leading-none">{r.name}</p>
                    <span className="text-[10px] font-semibold text-slate-400 font-sans block">{r.course}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Dynamic Verification & Tamper alerts */}
                    {r.tampered ? (
                      <span className="px-2 py-0.5 rounded text-[8.5px] font-bold border border-rose-200 bg-rose-50 text-rose-600 uppercase tracking-wider flex items-center gap-1">
                        <AlertOctagon className="h-3 w-3" /> TAMPER DETECTED / LOCKED
                      </span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider flex items-center gap-1 ${
                        r.status === "Present"
                          ? "bg-green-50 text-green-600 border-green-100"
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        {r.verified && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                        {r.status}
                      </span>
                    )}

                    <Button
                      onClick={() => handleToggleStatus(r.id, r.status)}
                      disabled={r.tampered}
                      variant="outline"
                      size="sm"
                      className="h-7 text-[10px] rounded-lg px-2.5 font-bold disabled:opacity-30"
                    >
                      Toggle
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
