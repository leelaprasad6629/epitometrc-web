"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Award,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Compass,
  Loader2,
  Sparkles,
  Flame,
  Clock,
  HelpCircle,
  FileText,
  Search,
  BookMarked,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LMSCourse } from "@/types/lms";
import { lmsService } from "@/lib/services/lmsService";
import { cn } from "@/lib/utils";

export default function StudentCoursesPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<LMSCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"in_progress" | "completed" | "available">("in_progress");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    const data = await lmsService.fetchCourses();
    setCourses(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const enrolledCourses = courses.filter((c) => c.enrolled);
  const inProgressCourses = enrolledCourses.filter((c) => (c.progress || 0) < 100);
  const completedCourses = enrolledCourses.filter((c) => (c.progress || 0) === 100);
  const availableCourses = courses.filter((c) => !c.enrolled);

  const lastActiveCourse = inProgressCourses[0] || enrolledCourses[0] || courses[0];

  const filteredList = (
    activeTab === "in_progress"
      ? inProgressCourses
      : activeTab === "completed"
      ? completedCourses
      : availableCourses
  ).filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.category.toLowerCase().includes(searchQuery.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
        <p className="text-slate-500 text-sm font-semibold animate-pulse font-sans">
          Syncing your learning tracks...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#0b172a] via-[#112240] to-[#0b172a] p-8 rounded-3xl text-white shadow-xl border border-orange-500/20">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Student Learning Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white">
            My Courses &amp; Learning Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-300 font-sans">
            Track your progress across enrolled courses, complete interactive quizzes, submit assignments, and earn verified certificates.
          </p>
        </div>

        {/* Learning Analytics Widget */}
        <div className="flex items-center gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 shrink-0 backdrop-blur-sm">
          <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-semibold">Active Streak</p>
            <p className="text-xl font-bold font-display text-white">5 Days</p>
            <p className="text-[10px] text-emerald-400 font-bold">{completedCourses.length} Certificates Issued</p>
          </div>
        </div>
      </div>

      {/* Continue Learning Resume Banner */}
      {lastActiveCourse && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-slate-900 shrink-0">
              <Image
                src={lastActiveCourse.image}
                alt={lastActiveCourse.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded bg-orange-100 text-orange-800 text-[10px] font-bold">
                Continue Learning
              </span>
              <h3 className="text-base font-bold text-slate-900 font-display">{lastActiveCourse.title}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-sans">
                <span>Progress: <strong className="text-orange-600 font-bold">{lastActiveCourse.progress || 0}%</strong></span>
                <span>•</span>
                <span>{lastActiveCourse.modules} Modules</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push(`/student/courses/${lastActiveCourse.id}/learn`)}
            className="w-full md:w-auto px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 shrink-0"
          >
            <PlayCircle className="w-4 h-4 fill-current" />
            <span>Resume LMS Course Player</span>
          </button>
        </div>
      )}

      {/* Main Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {[
            { key: "in_progress", label: `In Progress (${inProgressCourses.length})` },
            { key: "completed", label: `Completed (${completedCourses.length})` },
            { key: "available", label: `Browse All (${availableCourses.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeTab === tab.key
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search enrolled courses..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
      </div>

      {/* Course Cards Grid */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((course) => (
            <motion.div
              key={course.id}
              whileHover={{ y: -3 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-900">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded bg-[#0b172a]/90 text-[10px] font-bold text-white uppercase tracking-wider">
                    {course.category}
                  </span>
                  {course.enrolled && (
                    <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-white shadow-sm">
                      Enrolled
                    </span>
                  )}
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-slate-500 text-xs font-sans line-clamp-2 leading-relaxed">
                    {course.description}
                  </p>

                  {/* Progress Bar for Enrolled Users */}
                  {course.enrolled && (
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                        <span>Course Progress</span>
                        <span className="text-orange-600 font-bold">{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-orange-500 h-full transition-all duration-500 rounded-full"
                          style={{ width: `${course.progress || 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-5 pt-0">
                {course.enrolled ? (
                  <button
                    onClick={() => router.push(`/student/courses/${course.id}/learn`)}
                    className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20"
                  >
                    <PlayCircle className="w-3.5 h-3.5 fill-current" />
                    <span>{course.progress === 100 ? "Review Course" : "Launch Course Player"}</span>
                  </button>
                ) : (
                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>View Course Syllabus</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
          <BookMarked className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-900">No courses in this view</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Browse our course catalog to discover and enroll in enterprise software tracks.
          </p>
          <button
            onClick={() => setActiveTab("available")}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors"
          >
            Browse Available Courses
          </button>
        </div>
      )}
    </div>
  );
}
