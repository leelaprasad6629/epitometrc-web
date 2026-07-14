"use client";

import { motion } from "framer-motion";
import { BookOpen, Award, ArrowRight, PlayCircle, CheckCircle, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";
import AIInterviewPrepWidget from "@/components/ai/AIInterviewPrepWidget";
import AICourseAssistantWidget from "@/components/ai/AICourseAssistantWidget";

export default function StudentCoursesPage() {
  const activeCourses = [
    {
      id: 1,
      title: "Strategic Business Analyst",
      instructor: "Sarah Jenkins",
      progress: 60,
      modulesCompleted: 6,
      totalModules: 10,
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      title: "Advanced Execution & Strategy",
      instructor: "Marcus Thorne",
      progress: 15,
      modulesCompleted: 1,
      totalModules: 6,
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
    },
  ];

  const completedCourses = [
    {
      id: 3,
      title: "Introduction to Corporate Ethics",
      instructor: "Sarah Jenkins",
      completedDate: "15 May 2026",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          My Courses
        </h1>
        <p className="text-slate-500 text-sm font-sans">
          Manage your active learning tracks and access course resources.
        </p>
      </div>

      {/* Active Courses */}
      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-[#0b172a] flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-orange-500" />
          Active Tracks ({activeCourses.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activeCourses.map((course) => (
            <div key={course.id} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-40 h-44 sm:h-auto shrink-0 overflow-hidden">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-orange-500 uppercase tracking-wider font-sans">
                    Led by {course.instructor}
                  </span>
                  <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug">
                    {course.title}
                  </h3>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 font-sans">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="primary" size="sm" className="h-8 rounded-lg text-xs font-bold px-4 flex-1">
                    Resume
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-3">
                    Resources
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Interview Prep Generator */}
      <AIInterviewPrepWidget courses={[...activeCourses, ...completedCourses]} />

      {/* AI Course Tutor Assistant */}
      <AICourseAssistantWidget courseTitle="Strategic Business Analyst" />

      {/* Completed Courses */}
      <div className="space-y-4 pt-4">
        <h2 className="font-display text-lg font-bold text-[#0b172a] flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Completed Courses ({completedCourses.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {completedCourses.map((course) => (
            <div key={course.id} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row">
              <div className="relative w-full sm:w-40 h-44 sm:h-auto shrink-0 overflow-hidden grayscale">
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 20vw"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                    Completed on {course.completedDate}
                  </span>
                  <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug">
                    {course.title}
                  </h3>
                </div>

                <div className="flex gap-2">
                  <Button href="/student/certificates" variant="outline" size="sm" className="h-8 rounded-lg text-xs font-bold px-4 flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                    <Award className="mr-1.5 h-3.5 w-3.5" />
                    View Certificate
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
