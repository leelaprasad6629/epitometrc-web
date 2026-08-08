"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ShieldCheck, Star, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

interface HeroProps {
  persona: "student" | "corporate";
  setPersona: (persona: "student" | "corporate") => void;
}

export default function Hero({ persona, setPersona }: HeroProps) {
  const categories = [
    { 
      name: "PEOPLE AND ORGANISATION CONSULTING", 
      href: "/consulting",
      color: "bg-[#3b82f6]",
      hoverBg: "hover:bg-[#ebf5ff]",
      accentColor: "group-hover:text-[#3b82f6]",
      arrowColor: "group-hover:text-[#3b82f6]"
    },
    { 
      name: "LEADERSHIP ACADEMY", 
      href: "/training",
      color: "bg-[#ea580c]",
      hoverBg: "hover:bg-[#fff7ed]",
      accentColor: "group-hover:text-[#ea580c]",
      arrowColor: "group-hover:text-[#ea580c]"
    },
    { 
      name: "GREAT MANAGER AWARDS", 
      href: "/careers",
      color: "bg-[#10b981]",
      hoverBg: "hover:bg-[#f0fdf4]",
      accentColor: "group-hover:text-[#10b981]",
      arrowColor: "group-hover:text-[#10b981]"
    },
    { 
      name: "GREAT MANAGER ACADEMY", 
      href: "/courses",
      color: "bg-[#6366f1]",
      hoverBg: "hover:bg-[#eef2ff]",
      accentColor: "group-hover:text-[#6366f1]",
      arrowColor: "group-hover:text-[#6366f1]"
    },
  ];

  return (
    <section className="relative min-h-[90vh] lg:min-h-screen w-full bg-[#f8fafd] flex flex-col justify-between overflow-hidden font-sans border-b border-slate-100">
      
      {/* Top Left Peach Soft Blurred Gradient Background Overlay */}
      <div className="absolute top-0 left-0 w-full sm:w-[65%] h-full sm:h-[65%] bg-[radial-gradient(ellipse_at_top_left,rgba(255,176,122,0.22),rgba(255,142,91,0.18),rgba(255,168,199,0.12),rgba(255,214,231,0.08),rgba(255,242,245,0.03),transparent_75%)] pointer-events-none z-0 filter blur-xs" />
      
      {/* Top Right / Behind Girl Gradient Background Overlay */}
      <div className="absolute top-0 right-0 w-full sm:w-[70%] h-full sm:h-[70%] bg-[radial-gradient(circle_at_top_right,rgba(255,154,0,0.15),rgba(255,122,122,0.15),rgba(255,110,199,0.12),rgba(181,110,255,0.10),rgba(233,213,255,0.06),transparent_75%)] pointer-events-none z-0" />

      {/* Main Content Layout Wrapper */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 relative z-10 pt-28 md:pt-32 lg:pt-20 pb-8">
        
        {/* Left Side Content Column */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left space-y-4 max-w-2xl md:max-w-xl lg:max-w-2xl mx-auto md:mx-0">
          
          {/* Top Trust Ribbon */}
          <div className="inline-flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-4 px-4 py-2 rounded-full bg-white border border-orange-200/80 shadow-md backdrop-blur-md text-[10.5px] sm:text-xs font-bold text-slate-800 z-20">
            <span className="flex items-center gap-1.5 text-orange-600 font-extrabold">
              <GraduationCap className="h-4 w-4 text-orange-500" />
              🚀 7000+ Internships Facilitated
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-amber-600 font-extrabold">
              <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
              4.9/5 Student &amp; Corporate Score
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1.5 text-emerald-600 font-extrabold">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              ISO 9001:2015 Certified
            </span>
          </div>

          {/* Persona Switcher Toggle Buttons */}
          <div className="flex bg-white/90 p-1.5 rounded-2xl border border-slate-200/80 shadow-sm z-10 w-fit backdrop-blur-sm">
            <button
              onClick={() => setPersona("student")}
              className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                persona === "student"
                  ? "bg-[#0b172a] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              For Students
            </button>
            <button
              onClick={() => setPersona("corporate")}
              className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all duration-300 ${
                persona === "corporate"
                  ? "bg-[#0b172a] text-white shadow-md"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              For Corporates & Recruiters
            </button>
          </div>

          <motion.div
            key={`header-${persona}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-4"
          >
            <span className="rounded-full bg-orange-50 border border-orange-100 px-3.5 py-0.5 text-[9px] font-black text-orange-500 uppercase tracking-widest inline-block shadow-sm">
              {persona === "student" ? "EpitomeTRC Career Portal" : "EpitomeTRC B2B Suite"}
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight leading-tight select-none">
              {persona === "student" ? (
                <>
                  <span className="bg-gradient-to-r from-[#0f172a] via-[#0d9488] to-[#3b82f6] bg-clip-text text-transparent">
                    Engineer Your Future,
                  </span> <br />
                  <span className="bg-gradient-to-r from-[#0d9488] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                    Build Your Dream Career.
                  </span>
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-[#0f172a] via-[#0d9488] to-[#3b82f6] bg-clip-text text-transparent">
                    Align People Strategy,
                  </span> <br />
                  <span className="bg-gradient-to-r from-[#0d9488] via-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
                    Drive Enterprise Velocity.
                  </span>
                </>
              )}
            </h1>
          </motion.div>

          <motion.p
            key={`desc-${persona}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-slate-500 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed"
          >
            {persona === "student"
              ? "Refine and optimize your resume with AI score insights, conduct verbal speech mock interviews, and match directly with verified top-tier tech vacancy channels."
              : "Qualify high-value project leads automatically, generate client-facing proposals with audit logs, and configure workforce training bootcamps."}
          </motion.p>

          <motion.div
            key={`buttons-${persona}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="pt-4 flex flex-col sm:flex-row gap-4 items-center justify-center md:justify-start w-full sm:w-auto z-10"
          >
            <Link
              href={persona === "student" ? "/student/resume-builder" : "/admin/dashboard"}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-orange-500 hover:to-orange-600 hover:shadow-lg hover:shadow-orange-500/20 transition-all uppercase tracking-wider px-5 py-2.5 rounded-xl w-full sm:w-auto justify-center"
            >
              {persona === "student" ? "Build AI Resume" : "Access Recruiter Workspace"} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 bg-white/60 hover:bg-[#fff9f4] hover:text-orange-600 hover:border-orange-200/80 transition-all uppercase tracking-wider px-5 py-2.5 rounded-xl border border-slate-200/80 shadow-sm w-full sm:w-auto justify-center"
            >
              Login to Dashboard
            </Link>
          </motion.div>
        </div>

        {/* Right Side Image Column (Circular Mask Graphic Layout) */}
        <div className="hidden md:flex md:w-[46%] xl:w-[48%] relative flex-shrink-0 z-10 items-center justify-center">
          
          {/* Concentric subtle rings around the gradient for depth */}
          <div className="absolute w-[114%] h-[114%] border border-orange-300/20 rounded-full pointer-events-none animate-[spin_40s_linear_infinite]" />
          <div className="absolute w-[126%] h-[126%] border border-purple-300/15 rounded-full pointer-events-none animate-[spin_55s_linear_infinite_reverse]" />
          <div className="absolute w-[138%] h-[138%] border border-pink-300/10 rounded-full pointer-events-none border-dashed" />

          {/* Large circular background gradient matching references */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FF9A00] via-[#FF7A7A] via-[#FF6EC7] via-[#B56EFF] to-[#E9D5FF] rounded-full shadow-lg opacity-[0.95] pointer-events-none aspect-square" />
          
          {/* The Girl image inside the circular mask */}
          <div className="relative w-[96%] h-[96%] rounded-full overflow-hidden border-[6px] border-white bg-white/20 z-10 aspect-square shadow-xl">
            <Image
              src="/images/professional_woman_laptop.jpg"
              alt="Young professional working on a laptop"
              fill
              className="object-cover object-center scale-[1.02] -translate-y-1"
              sizes="(max-w-1024px) 100vw, 450px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom Menu Items */}
      <div className="relative z-10 w-full bg-white/70 backdrop-blur-md border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 text-left font-sans">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className={`group p-6 flex flex-col justify-between ${cat.hoverBg} transition-all duration-300 min-h-[120px]`}
            >
              <div className="flex justify-between items-start gap-4">
                <span className={`text-[11px] font-bold text-slate-700 tracking-wider ${cat.accentColor} transition-colors`}>
                  {cat.name}
                </span>
                <ArrowUpRight className={`h-4 w-4 text-slate-400 ${cat.arrowColor} group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all`} />
              </div>
              <div className={`h-[2px] w-0 ${cat.color} group-hover:w-full transition-all duration-300 mt-4`} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}