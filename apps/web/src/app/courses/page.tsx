"use client";

import { motion } from "framer-motion";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export default function PublicCoursesPage() {
  const courses = [
    {
      id: 1,
      title: "Strategic Business Analyst",
      category: "Technical Courses",
      duration: "3 Months",
      modules: "10 Modules",
      desc: "Learn modern enterprise analysis models, UML diagrams, and fintech strategy formulation.",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=250&fit=crop",
    },
    {
      id: 2,
      title: "Advanced Execution & Strategy",
      category: "Workshops",
      duration: "6 Weeks",
      modules: "6 Modules",
      desc: "Assemble operational roadmaps, run agile sprint plans, and implement KPIs for scaling startups.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50 min-h-screen">
        <section className="py-16">
          <Container className="space-y-8">
            <div className="text-center space-y-2">
              <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Epitome Academy
              </span>
              <h1 className="font-display text-3xl font-bold text-[#0b172a] sm:text-4xl">
                Academy Courses & Workshops
              </h1>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                Acquire elite credentials led by industry experts. Learn agile systems, strategy, and production engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto pt-6">
              {courses.map((course) => (
                <div key={course.id} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={course.image}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform"
                      sizes="(max-width: 768px) 100vw, 30vw"
                    />
                    <span className="absolute top-4 left-4 rounded bg-[#0b172a]/95 backdrop-blur-sm px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider">
                      {course.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug group-hover:text-orange-500 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-slate-500 text-xs font-sans leading-relaxed">
                      {course.desc}
                    </p>
                    <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans border-t border-slate-50 pt-3">
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{course.modules}</span>
                    </div>
                    <Button href="/register" variant="outline" size="sm" className="w-full h-9 rounded-xl text-xs font-bold pt-2">
                      Enroll Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
