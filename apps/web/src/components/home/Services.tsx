"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Globe,
  Award,
  Users,
  Code2,
  UserCheck,
  TrendingUp,
  GraduationCap,
  Cloud,
  ArrowRight,
  ExternalLink
} from "lucide-react";

interface ServicesProps {
  persona: "student" | "corporate";
}

export default function Services({ persona }: ServicesProps) {
  const studentStats = [
    { value: "12k+", label: "Resumes Audited", icon: Globe },
    { value: "94.8%", label: "First-Attempt Pass Rate", icon: Award },
    { value: "450+", label: "Active Tech Partners", icon: Users },
  ];

  const corporateStats = [
    { value: "25+", label: "Global Client Countries", icon: Globe },
    { value: "1,200+", label: "Projects Completed", icon: Award },
    { value: "150+", label: "Lead Consultants", icon: Users },
  ];

  const stats = persona === "student" ? studentStats : corporateStats;

  return (
    <div id="services-parent-container">
      {/* 1. Statistics Bar Section */}
      <section className="bg-[#050e1e] py-12 md:py-16 text-white relative z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-center text-center p-4 first:pt-0 last:pb-0 md:py-4"
                >
                  <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-orange-500 mb-4 shadow-inner">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight leading-none">
                    {stat.value}
                  </h3>
                  <p className="text-slate-400 text-sm font-semibold tracking-wider uppercase mt-2 font-sans">
                    {stat.label}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Specialized Services Bento Grid Section */}
      <section id="services" className="py-20 md:py-28 bg-[#f8fafd] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
            <div className="max-w-xl">
              <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider block mb-2 font-sans">
                OUR CORE CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0b172a] tracking-tight leading-tight">
                Specialized Expertise for Complex Challenges.
              </h2>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group self-start md:self-auto"
            >
              View all services
              <ArrowRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            
            {/* IT Development (Featured 2/3 width on large) */}
            <motion.div
              whileHover={{ y: -6 }}
              className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/10 rounded-full translate-x-8 -translate-y-8" />
              <div>
                <div className="p-3 bg-orange-50 rounded-xl text-orange-500 inline-block mb-6 shadow-sm">
                  <Code2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0b172a] mb-3">
                  IT Development
                </h3>
                <p className="text-slate-600 max-w-lg font-sans leading-relaxed">
                  Professional React, TypeScript, and Node.js cloud solutions designed to maximize scalability. We architect and implement high-performance web applications, robust APIs, and custom integrations tailored precisely to your operational workflow.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-sans">
                  Cloud Native • Full Stack
                </span>
                <span className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </motion.div>

            {/* Strategic Recruitment (1/3 width, Dark Accent) */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-[#0b172a] text-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
              <div>
                <div className="p-3 bg-slate-800/80 border border-slate-700/50 rounded-xl text-blue-400 inline-block mb-6 shadow-md">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-bold text-white mb-3">
                  Strategic Recruitment
                </h3>
                <p className="text-slate-300 text-sm font-sans leading-relaxed">
                  Connecting visionary companies with world-class tech leaders, senior engineers, and elite consultants. We accelerate team construction through smart talent mapping.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-sans">
                  Executive Search
                </span>
                <span className="p-1.5 bg-slate-800 rounded-lg text-slate-300 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </motion.div>

            {/* Business Consulting */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="p-3 bg-orange-50 rounded-xl text-orange-500 inline-block mb-6">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-[#0b172a] mb-3">
                  Business Consulting
                </h3>
                <p className="text-slate-600 text-sm font-sans leading-relaxed">
                  Operational streamlining and digital transformation planning. We build strategy maps that drive margin improvements and long-term business resilience.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link href="/consulting" className="text-xs font-bold text-[#0b172a] hover:text-orange-500 flex items-center tracking-wider uppercase font-sans">
                  More
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Academic Synergy */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="p-3 bg-orange-50 rounded-xl text-orange-500 inline-block mb-6">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-[#0b172a] mb-3">
                  Academic Synergy
                </h3>
                <p className="text-slate-600 text-sm font-sans leading-relaxed">
                  Uniting university research labs and private tech R&D teams. Creating deep technology partnerships to translate theoretical excellence into real products.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link href="/college-collaboration" className="text-xs font-bold text-[#0b172a] hover:text-orange-500 flex items-center tracking-wider uppercase font-sans">
                  Explore
                  <ArrowRight className="ml-1 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Cloud Management (High Contrast Orange Accent) */}
            <motion.div
              whileHover={{ y: -6 }}
              className="bg-orange-500 text-white rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="p-3 bg-white/20 rounded-xl text-white inline-block mb-6">
                  <Cloud className="h-6 w-6" />
                </div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-3">
                  Cloud Management
                </h3>
                <p className="text-orange-55 text-sm font-sans leading-relaxed">
                  Safe, modern virtualization and secure, automated cloud operations. We design resilient databases, low-latency API proxy routes, and autoscaling infrastructure.
                </p>
              </div>
              <div className="mt-8 pt-4 border-t border-white/20 flex items-center justify-between">
                <span className="text-xs font-semibold text-orange-100 uppercase tracking-widest font-sans">
                  Virtualization
                </span>
                <span className="p-1.5 bg-white/20 rounded-lg text-white group-hover:bg-white group-hover:text-orange-500 transition-colors duration-300">
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </motion.div>

          </div>

        </div>
      </section>
    </div>
  );
}