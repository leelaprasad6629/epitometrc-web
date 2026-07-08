"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, Award, Users, ArrowRight, Calendar, ExternalLink, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";

export default function StudentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setData(payload);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { label: "Active Courses", value: data?.stats?.activeCourses !== undefined ? String(data.stats.activeCourses).padStart(2, '0') : "00", icon: BookOpen, color: "text-blue-600 bg-blue-50 border-blue-100" },
    { label: "Pending Assignments", value: data?.stats?.pendingAssignments !== undefined ? String(data.stats.pendingAssignments).padStart(2, '0') : "00", icon: Clock, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Certifications", value: data?.stats?.certifications !== undefined ? String(data.stats.certifications).padStart(2, '0') : "00", icon: Award, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Mentor Sessions", value: data?.stats?.mentorSessions !== undefined ? String(data.stats.mentorSessions).padStart(2, '0') : "00", icon: Users, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  ];

  const recommendedPrograms = data?.recommended?.length > 0
    ? data.recommended.map((r: any) => ({
        id: r.id,
        title: r.title,
        location: r.location,
        duration: r.duration,
        tags: ["Strategy", "Enterprise"],
        image: r.image,
      }))
    : [];

  const deadlines = [
    { title: "Market Research Draft", due: "Due Today, 11:59 PM", status: "URGENT" },
    { title: "Final Strategy Presentation", due: "Due in 3 days (10 Dec)", status: "NORMAL" },
    { title: "Internship Application: IT Dev", due: "Due in 5 days (12 Dec)", status: "NORMAL" },
  ];

  const recentActivity = [
    {
      type: "submission",
      title: "Assignment Submitted",
      details: "Advanced Strategy: Case Study 04 submitted for review.",
      time: "2 hours ago",
      color: "bg-blue-500",
    },
    {
      type: "grade",
      title: "Grade Published",
      details: "You received an 'A' for 'Introduction to Corporate Ethics'.",
      time: "Yesterday, 4:30 PM",
      color: "bg-emerald-500",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Top Banner section */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            Welcome back, {data?.userName || "Alex"}.
          </h1>
          <p className="text-slate-500 text-sm font-medium font-sans">
            Your progress this week is looking excellent. You have 2 assignments due soon.
          </p>
        </div>
        <Button href="/student/courses" variant="primary" className="h-10 rounded-xl px-5 font-bold shrink-0 self-start md:self-auto">
          Continue Learning
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                  {stat.label}
                </span>
                <span className={`p-1.5 rounded-lg border ${stat.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
              </div>
              <p className="text-3xl font-extrabold text-[#0b172a] leading-none tracking-tight">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Recommended Programs & Sidebar Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Programs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-display text-lg font-bold text-[#0b172a]">
              Recommended Programs
            </h2>
            <Link href="/courses" className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedPrograms.map((prog: any) => (
              <div key={prog.id} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={prog.image}
                    alt={prog.title}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {prog.tags.map((tag: string) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-[#0b172a]/80 backdrop-blur-sm text-[9px] font-bold text-white uppercase tracking-wider">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-display text-sm font-bold text-[#0b172a] leading-snug group-hover:text-orange-500 transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-[11px] font-medium text-slate-400 font-sans">{prog.location}</p>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <span className="text-[11px] font-semibold text-slate-600 font-sans">{prog.duration}</span>
                    <Button href="/student/courses" variant="outline" size="sm" className="h-7 text-xs px-3 rounded-lg font-bold">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="space-y-4 pt-2">
            <h2 className="font-display text-lg font-bold text-[#0b172a]">
              Recent Activity
            </h2>
            <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm divide-y divide-slate-100">
              {recentActivity.map((act, idx) => (
                <div key={idx} className="flex gap-4 py-3.5 first:pt-0 last:pb-0 items-start">
                  <span className={`h-2.5 w-2.5 rounded-full mt-1.5 shrink-0 ${act.color}`}></span>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">{act.title}</p>
                    <p className="text-xs text-slate-500 font-sans leading-relaxed">{act.details}</p>
                    <span className="text-[10px] text-slate-400 font-medium font-sans block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets (Deadlines & Mentor Session) */}
        <div className="space-y-6">
          {/* Deadlines Widget */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
                Deadlines
              </h2>
              <span className="rounded bg-red-50 px-1.5 py-0.5 text-[9px] font-bold text-red-600 uppercase tracking-wider">
                Urgent
              </span>
            </div>

            <div className="space-y-3.5">
              {deadlines.map((dl, idx) => (
                <div key={idx} className="flex justify-between items-start gap-4 pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-700 leading-snug">{dl.title}</h4>
                    <p className="text-[10px] text-slate-400 font-medium font-sans">{dl.due}</p>
                  </div>
                  {dl.status === "URGENT" && (
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 mt-1.5"></span>
                  )}
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full h-9 rounded-xl text-xs font-bold">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              View Calendar
            </Button>
          </div>

          {/* Next Mentor Session */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              Next Mentor Session
            </h2>

            <div className="flex items-center gap-3">
              <div className="relative h-11 w-11 overflow-hidden rounded-full border border-slate-100">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
                  alt="Sarah Jenkins"
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-[#0b172a]">Sarah Jenkins</p>
                <span className="text-[10px] text-slate-400 font-medium font-sans block mt-0.5">Senior Strategy Consultant</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 p-3.5 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Scheduled for</span>
                <span className="text-xs font-bold text-slate-700">Tomorrow, 10:00 AM</span>
              </div>
              <Clock className="h-5 w-5 text-slate-400" />
            </div>

            <Button variant="primary" className="w-full h-9 rounded-xl text-xs font-bold bg-[#0b172a] hover:bg-slate-800 shadow-none border-0">
              <Video className="mr-1.5 h-3.5 w-3.5" />
              Join Meeting
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
