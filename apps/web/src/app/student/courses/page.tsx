"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Award, ArrowRight, PlayCircle, CheckCircle, PlusCircle, Compass, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/common/Button";
import AIInterviewPrepWidget from "@/components/ai/AIInterviewPrepWidget";
import AICourseAssistantWidget from "@/components/ai/AICourseAssistantWidget";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchCourses();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEnrollingId(null);
    }
  };

  const activeCourses = courses.filter((c) => c.enrolled && c.progress < 100);
  const completedCourses = courses.filter((c) => c.enrolled && c.progress === 100);
  const availableCourses = courses.filter((c) => !c.enrolled);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
        <p className="text-slate-500 text-sm font-medium animate-pulse">Syncing your learning tracks...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6"
    >
      {/* Header section */}
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-black text-[#0b172a] sm:text-3xl tracking-tight">
          My Learning Academy
        </h1>
        <p className="text-slate-500 text-sm font-sans">
          Manage your enrolled curriculum tracks, enroll in new paths, and build verified skills.
        </p>
      </div>

      {/* 1. Active Tracks */}
      <div className="space-y-4">
        <h2 className="font-display text-base font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <PlayCircle className="h-5 w-5 text-orange-500" />
          Active Tracks ({activeCourses.length})
        </h2>

        {activeCourses.length === 0 ? (
          <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-3xl p-8 text-center max-w-lg">
            <Compass className="h-10 w-10 text-slate-400 mx-auto mb-2 animate-bounce" />
            <h4 className="text-sm font-bold text-slate-700">No active tracks currently</h4>
            <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
              Start building your career roadmap by enrolling in one of our available skills paths below.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row"
              >
                <div className="relative w-full sm:w-40 h-44 sm:h-auto shrink-0 overflow-hidden bg-slate-100">
                  <Image
                    src={course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop"}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2 text-left">
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest font-sans">
                      {course.category || "Technology"} &bull; {course.duration || "Self-Paced"}
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
                        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
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
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Available Tracks to Join */}
      {availableCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="font-display text-base font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Compass className="h-5 w-5 text-violet-500" />
            Explore Available Paths ({availableCourses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="relative w-full h-40 overflow-hidden bg-slate-100">
                  <Image
                    src={course.image || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop"}
                    alt={course.title}
                    fill
                    className="object-cover group-hover:scale-103 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                    <span className="text-[10px] font-black text-white bg-violet-600 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 text-left">
                    <h3 className="font-display text-sm font-bold text-[#0b172a] leading-snug group-hover:text-violet-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-450 leading-relaxed line-clamp-2">
                      {course.description || "Build state of the art skills with guided expert curriculum paths."}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 font-sans">
                      Duration: {course.duration}
                    </span>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="h-8 px-3 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      {enrollingId === course.id ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" /> Enrolling
                        </>
                      ) : (
                        <>
                          <PlusCircle className="h-3.5 w-3.5" /> Join Track
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Interview Prep Generator */}
      {activeCourses.length > 0 && (
        <AIInterviewPrepWidget courses={[...activeCourses, ...completedCourses]} />
      )}

      {/* AI Course Tutor Assistant */}
      {activeCourses.length > 0 && (
        <AICourseAssistantWidget courseTitle={activeCourses[0].title} />
      )}

      {/* 3. Completed Courses */}
      {completedCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="font-display text-base font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Completed Courses ({completedCourses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row"
              >
                <div className="relative w-full sm:w-40 h-44 sm:h-auto shrink-0 overflow-hidden grayscale">
                  <Image
                    src={course.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=250&fit=crop"}
                    alt={course.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 20vw"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 text-left">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                      Verified Completion Track
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
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
