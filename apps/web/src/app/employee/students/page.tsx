"use client";

import { motion } from "framer-motion";
import { Users, Mail, Phone, Calendar, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import Button from "@/components/common/Button";

export default function EmployeeStudentsPage() {
  const mentoredStudents = [
    {
      id: 1,
      name: "Alex Thompson",
      course: "Strategic Business Analyst",
      progress: 60,
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=faces",
      email: "alex.t@epitome.com",
    },
    {
      id: 2,
      name: "Emma Watson",
      course: "Advanced Execution & Strategy",
      progress: 30,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
      email: "emma.w@epitome.com",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          Mentorship & Students
        </h1>
        <p className="text-slate-500 text-sm">
          Track course completions, review assignments, and manage student communications.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-[#0b172a] flex items-center gap-2">
          <Users className="h-5 w-5 text-orange-500" />
          Active Students ({mentoredStudents.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentoredStudents.map((student) => (
            <div key={student.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="flex gap-4 items-center">
                <div className="relative h-12 w-12 rounded-full border border-slate-100 overflow-hidden shrink-0">
                  <Image
                    src={student.avatar}
                    alt={student.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="text-left space-y-0.5">
                  <h3 className="font-display text-sm font-bold text-[#0b172a]">{student.name}</h3>
                  <p className="text-[11px] font-semibold text-slate-600 font-sans leading-none">{student.course}</p>
                  <p className="text-[10px] text-slate-400 font-medium font-sans mt-1">{student.email}</p>
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2 pt-2 border-t border-slate-50">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-600 font-sans">
                  <span>Progress</span>
                  <span>{student.progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-orange-500 transition-all"
                    style={{ width: `${student.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button variant="primary" size="sm" className="h-8 rounded-lg text-xs font-bold px-4 flex-1">
                  Grade Assignments
                </Button>
                <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-3">
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
