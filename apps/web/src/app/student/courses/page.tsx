"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Award, ArrowRight, PlayCircle, CheckCircle, Compass, Loader2, Sparkles, BookMarked, Layers } from "lucide-react";
import Image from "next/image";
import Button from "@/components/common/Button";
import AICourseAssistantWidget from "@/components/ai/AICourseAssistantWidget";

export default function StudentCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  
  // Dynamic tutor state
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string | null>(null);
  const tutorSectionRef = useRef<HTMLDivElement | null>(null);

  // Resources state
  const [activeResourcesCourse, setActiveResourcesCourse] = useState<any | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      if (data.success) {
        setCourses(data.courses);
        
        // Auto select first active course as default for AI Tutor if not set yet
        const active = data.courses.filter((c: any) => c.enrolled && c.progress < 100);
        if (active.length > 0 && !selectedCourseTitle) {
          setSelectedCourseTitle(active[0].title);
        }
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

  const handleUpdateProgress = async (courseId: string, newProgress: number) => {
    try {
      const res = await fetch("/api/courses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, progress: newProgress }),
      });
      if (res.ok) {
        await fetchCourses();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleResumeCourse = (courseTitle: string) => {
    setSelectedCourseTitle(courseTitle);
    setTimeout(() => {
      tutorSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
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
      className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 pb-12"
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
      <div className="space-y-4 text-left">
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
                className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row text-left"
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
                    
                    {/* Course Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-500 font-sans">
                        <span>Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: `${course.progress}%` }}></div>
                      </div>
                    </div>

                    {/* Progress Update Dropdown selector */}
                    <div className="flex items-center gap-1.5 pt-1.5 justify-between flex-wrap">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Set Progress:</span>
                        <select
                          value={course.progress}
                          onChange={(e) => handleUpdateProgress(course.id, Number(e.target.value))}
                          className="text-[9.5px] font-extrabold text-slate-600 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 outline-none font-sans"
                        >
                          <option value={0}>0% Initial</option>
                          <option value={25}>25% Basics</option>
                          <option value={50}>50% Midterm</option>
                          <option value={75}>75% Capstone</option>
                          <option value={100}>100% Complete</option>
                        </select>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Attendance:</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8.5px] font-extrabold border uppercase tracking-wider font-sans ${
                          course.attendanceRate >= 90
                            ? "bg-green-50 text-green-600 border-green-150"
                            : course.attendanceRate >= 75
                            ? "bg-amber-50 text-amber-600 border-amber-150"
                            : "bg-rose-50 text-rose-600 border-rose-150"
                        }`}>
                          {course.attendanceRate}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleResumeCourse(course.title)}
                      variant="primary"
                      size="sm"
                      className="h-8 rounded-lg text-xs font-bold px-4 flex-1"
                    >
                      Resume
                    </Button>
                    <Button
                      onClick={() => setActiveResourcesCourse(course)}
                      variant="outline"
                      size="sm"
                      className="h-8 rounded-lg text-xs font-bold px-3"
                    >
                      Resources
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* AI Course Tutor Assistant (Dynamic anchor block) */}
      {selectedCourseTitle && (
        <div ref={tutorSectionRef} className="space-y-4 pt-4 border-t border-slate-100 text-left">
          <AICourseAssistantWidget courseTitle={selectedCourseTitle} />
        </div>
      )}

      {/* Active Resources Sidebar Modal Overlay */}
      <AnimatePresence>
        {activeResourcesCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl max-w-lg w-full p-6 space-y-4 text-left"
            >
              <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                <div className="flex items-center gap-2">
                  <BookMarked className="h-5 w-5 text-orange-500" />
                  <h3 className="font-display text-sm font-extrabold text-[#0b172a] uppercase tracking-wider">
                    Course Resources
                  </h3>
                </div>
                <button
                  onClick={() => setActiveResourcesCourse(null)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <Compass className="h-4.5 w-4.5 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800">{activeResourcesCourse.title}</h4>
                  <p className="text-[11px] text-slate-400 font-medium font-sans mt-0.5 leading-relaxed">
                    {activeResourcesCourse.description || "Comprehensive dynamic training track with hands-on capstones."}
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                    Syllabus Modules
                  </span>
                  <div className="space-y-1.5">
                    {["Module 1: Architecture Overview & Toolchains", "Module 2: Database Mappings and ORM Persistence", "Module 3: Hands-on Capstone System Integration"].map((mod, idx) => (
                      <div key={idx} className="flex gap-2.5 items-center p-2.5 bg-slate-50 border border-slate-100 rounded-xl">
                        <Layers className="h-4 w-4 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-700 font-sans">{mod}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-50">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
                    Recommended Reading
                  </span>
                  <div className="flex gap-2">
                    <a
                      href="https://react.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-violet-50 text-violet-600 text-[10px] font-extrabold rounded-lg border border-violet-100 hover:bg-violet-100 transition-colors"
                    >
                      Developer Documentation &rarr;
                    </a>
                    <a
                      href="https://nextjs.org/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-extrabold rounded-lg border border-blue-100 hover:bg-blue-100 transition-colors"
                    >
                      Next.js Handbooks &rarr;
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setActiveResourcesCourse(null)}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Available Tracks to Join */}
      {availableCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
          <h2 className="font-display text-base font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Compass className="h-5 w-5 text-violet-500" />
            Explore Available Paths ({availableCourses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between text-left"
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
                  <div className="space-y-2 text-left">
                    <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug group-hover:text-orange-500 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium font-sans leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center gap-4 pt-2">
                    <span className="text-[10px] font-bold text-slate-500 font-sans">
                      Duration: {course.duration || "Self-paced"}
                    </span>
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="h-8.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 text-[11px] font-bold shadow-sm flex items-center justify-center transition-all"
                    >
                      {enrollingId === course.id ? "Joining..." : "Enroll Now"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Completed Courses */}
      {completedCourses.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-100 text-left">
          <h2 className="font-display text-base font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Completed Courses ({completedCourses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completedCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ y: -4 }}
                className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row text-left"
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
