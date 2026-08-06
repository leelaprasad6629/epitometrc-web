"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  Search,
  Filter,
  Star,
  Users,
  Award,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Lock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { LMSCourse, LMSFilterState } from "@/types/lms";
import { lmsService } from "@/lib/services/lmsService";
import { cn } from "@/lib/utils";

export default function CoursesClient() {
  const [courses, setCourses] = useState<LMSCourse[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<LMSFilterState>({
    searchQuery: "",
    category: "All",
    level: "All",
    duration: "All",
    sortBy: "popular",
  });

  const categories = [
    "All",
    "Technical Courses",
    "Strategy & Analysis",
    "AI & Data Science",
    "Cloud & DevOps",
    "Workshops",
  ];

  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  const popularSkills = [
    "Software Architecture",
    "System Design",
    "Agile Execution",
    "Prisma & PostgreSQL",
    "Microservices",
    "React & Next.js",
    "Python & AI",
    "DevOps Pipelines",
  ];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    lmsService.fetchCourses(filters).then((data) => {
      if (isMounted) {
        setCourses(data);
        setLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [filters]);

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50 min-h-screen pb-20">
        {/* Enterprise LMS Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-r from-[#0b172a] via-[#112240] to-[#0b172a] text-white py-16 md:py-20">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <Container className="relative z-10 space-y-6">
            <div className="max-w-3xl space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                Enterprise Learning Management System
              </span>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
                Master Industry Competencies &amp; Build Production Engineering Skills
              </h1>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed max-w-2xl">
                Explore hands-on courses led by senior system architects. Acquire verifiable certificates, build production-grade portfolios, and advance your technical career.
              </p>
            </div>

            {/* Search Input in Hero */}
            <div className="max-w-2xl bg-white p-2 rounded-2xl shadow-xl border border-slate-200/80 flex items-center gap-2">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={filters.searchQuery}
                onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                placeholder="Search by course title, skill, technology, or topic..."
                className="w-full bg-transparent border-0 text-slate-900 placeholder:text-slate-400 text-sm font-sans focus:outline-none py-2"
              />
              {filters.searchQuery && (
                <button
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Quick Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs text-slate-400 font-semibold mr-1">Popular Categories:</span>
              {categories.slice(1).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters((prev) => ({ ...prev, category: prev.category === cat ? "All" : cat }))}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold transition-all border",
                    filters.category === cat
                      ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                      : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Container>
        </section>

        {/* Popular Skills Bar */}
        <section className="bg-white border-b border-slate-200/80 py-4 shadow-sm">
          <Container className="flex items-center gap-3 overflow-x-auto no-scrollbar text-xs">
            <span className="font-bold text-slate-900 shrink-0 flex items-center gap-1.5 font-display">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              Trending Skills:
            </span>
            <div className="flex items-center gap-2">
              {popularSkills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setFilters((prev) => ({ ...prev, searchQuery: skill }))}
                  className="px-3 py-1 rounded-xl bg-slate-100 hover:bg-orange-50 hover:text-orange-600 text-slate-600 font-semibold text-[11px] whitespace-nowrap transition-colors border border-slate-200/60"
                >
                  {skill}
                </button>
              ))}
            </div>
          </Container>
        </section>

        {/* Main Content Area */}
        <section className="py-12">
          <Container className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Filter Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-5 sticky top-24">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 font-display flex items-center gap-2 text-base">
                    <Filter className="w-4 h-4 text-orange-500" />
                    Filters
                  </h3>
                  {(filters.category !== "All" || filters.level !== "All" || filters.searchQuery !== "") && (
                    <button
                      onClick={() => setFilters({ searchQuery: "", category: "All", level: "All", duration: "All", sortBy: "popular" })}
                      className="text-xs font-semibold text-orange-600 hover:underline flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Reset
                    </button>
                  )}
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between",
                          filters.category === cat
                            ? "bg-orange-50 text-orange-700 font-bold border border-orange-200"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span>{cat}</span>
                        {filters.category === cat && <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Difficulty Level</label>
                  <div className="space-y-1">
                    {levels.map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => setFilters((prev) => ({ ...prev, level: lvl }))}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center justify-between",
                          filters.level === lvl
                            ? "bg-orange-50 text-orange-700 font-bold border border-orange-200"
                            : "text-slate-600 hover:bg-slate-50"
                        )}
                      >
                        <span>{lvl}</span>
                        {filters.level === lvl && <CheckCircle2 className="w-3.5 h-3.5 text-orange-500" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort By */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e: any) => setFilters((prev) => ({ ...prev, sortBy: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                    <option value="alphabetical">Alphabetical (A-Z)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right Course Grid */}
            <div className="lg:col-span-9 space-y-6">
              {/* Header Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">
                    Course Catalog
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5 font-sans">
                    Showing <span className="font-bold text-slate-900">{courses.length}</span> verified industry learning tracks
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                      <div className="h-40 bg-slate-200 rounded-xl" />
                      <div className="h-4 bg-slate-200 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : courses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <motion.div
                      key={course.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Thumbnail Container */}
                        <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                          <Image
                            src={course.image}
                            alt={course.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 30vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                          <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-[#0b172a]/90 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider border border-slate-700/50">
                            {course.category}
                          </span>
                          <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold bg-orange-500 text-white shadow-sm">
                            {course.level}
                          </span>
                        </div>

                        {/* Card Content */}
                        <div className="p-5 space-y-3">
                          <div className="flex items-center gap-3 text-xs text-slate-500 font-sans">
                            <span className="flex items-center gap-1 font-bold text-amber-500">
                              <Star className="w-3.5 h-3.5 fill-current" />
                              {course.rating}
                            </span>
                            <span>({course.reviewsCount} reviews)</span>
                            <span className="flex items-center gap-1 ml-auto">
                              <Users className="w-3.5 h-3.5 text-slate-400" />
                              {course.enrolledCount}
                            </span>
                          </div>

                          <h3 className="font-display text-base font-bold text-slate-900 leading-snug group-hover:text-orange-600 transition-colors line-clamp-2">
                            {course.title}
                          </h3>

                          <p className="text-slate-500 text-xs font-sans line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>

                          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-500 pt-2 border-t border-slate-100">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                              {course.modules} Modules
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Button */}
                      <div className="p-5 pt-0">
                        <Link
                          href={`/courses/${course.id}`}
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-orange-500 text-white transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                          <span>Explore Syllabus</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center space-y-3">
                  <Search className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-slate-900">No courses match your filter</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Try clearing your search query or selecting a different category from the sidebar.
                  </p>
                  <button
                    onClick={() => setFilters({ searchQuery: "", category: "All", level: "All", duration: "All", sortBy: "popular" })}
                    className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
