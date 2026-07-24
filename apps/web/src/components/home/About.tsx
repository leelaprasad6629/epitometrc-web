"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Zap, Users, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AboutProps {
  persona: "student" | "corporate";
}

export default function About({ persona }: AboutProps) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const studentTrustPoints = [
    {
      title: "AI Resume Optimization",
      description: "Build ATS-optimized resumes that highlight key capabilities and pass corporate screening algorithms.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Speech Mock Interviews",
      description: "Practice interactive verbal interview screens with realistic AI recruiters in real-time.",
      icon: Zap,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Targeted Employer Matches",
      description: "Direct alignment matching with leading software firms looking for certified developers.",
      icon: Users,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ];

  const corporateTrustPoints = [
    {
      title: "Uncompromising Quality",
      description: "Our solutions adhere to the absolute highest architectural and performance standards.",
      icon: ShieldCheck,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Agile Methodologies",
      description: "We deploy modern agile frameworks to keep iteration cycles short and execution swift.",
      icon: Zap,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      title: "Global Network",
      description: "We connect specialized expertise and cross-border insights to solve localized problems.",
      icon: Users,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
    },
  ];

  const trustPoints = persona === "student" ? studentTrustPoints : corporateTrustPoints;

  const studentTestimonials = [
    {
      quote: "The AI Mock Interview simulator was a game changer for me. It gave me real recruiter-style feedback that helped me identify weak concepts. I secured a senior Next.js role after practicing!",
      author: "Alex Mercer",
      role: "Graduate Frontend Engineer",
      stars: 5,
    },
    {
      quote: "Thanks to the resume parser and completeness scorer, I managed to restructure my engineering stack highlights, increasing my response rate by over 60%.",
      author: "Jessica Chen",
      role: "Full-Stack Software Fellow",
      stars: 5,
    },
  ];

  const corporateTestimonials = [
    {
      quote: "EpitomeTRC transformed our complete cloud ecosystem and automated our delivery pipelines. Their IT advisory team was cost-effective, extremely responsive, and highly professional. Our infrastructure is now faster, more resilient, and perfectly secure.",
      author: "Daniel Rose",
      role: "CTO, Nexa Industries",
      stars: 5,
    },
    {
      quote: "The strategic recruitment consultants placed key engineering managers who immediately accelerated our core platform timeline. They understood our technological requirements perfectly, reducing our time-to-hire by over 45%.",
      author: "Sarah Williams",
      role: "HR Director, Horizon Global",
      stars: 5,
    },
  ];

  const testimonials = persona === "student" ? studentTestimonials : corporateTestimonials;

  const handleNext = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div id="about-parent-wrapper">
      
      {/* 1. Trust & Executive Section */}
      <section id="about" className="py-20 md:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column - Executive Image */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-orange-100 rounded-2xl -z-10" />
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-50 rounded-2xl -z-10" />
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="rounded-2xl overflow-hidden shadow-xl max-w-sm lg:max-w-none w-full"
              >
                {/* Note: Store your executive portrait image at /public/images/executive_trust.jpg */}
                <Image
                  src="/images/executive_trust.jpg"
                  alt="EpitomeTRC Lead Consultant"
                  width={450}
                  height={520}
                  className="w-full h-[450px] lg:h-[520px] object-cover hover:scale-102 transition-transform duration-500"
                />
              </motion.div>
            </div>

            {/* Right Column - Trust Content */}
            <div className="lg:col-span-7 flex flex-col space-y-6 md:space-y-8">
              <div>
                <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider block mb-2 font-sans">
                  WHY CHOOSE US
                </span>
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0b172a] tracking-tight leading-tight">
                  {persona === "student" ? "Why Candidates Choose EpitomeTRC." : "Why Industry Leaders Trust EpitomeTRC."}
                </h2>
                <p className="text-slate-600 mt-4 font-sans leading-relaxed text-base md:text-lg">
                  {persona === "student"
                    ? "Our platform provides job seekers with elite AI interview prep and resume scanning tools to fast-track matching into leading software engineering roles."
                    : "With over a decade of hands-on expertise delivering strategic consultation and custom technology solutions, our team remains laser-focused on keeping you ahead of the digital curve."}
                </p>
              </div>

              {/* Trust Points List */}
              <div className="flex flex-col space-y-6">
                {trustPoints.map((point, idx) => {
                  const Icon = point.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="flex items-start space-x-4 p-4 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                    >
                      <div className={`p-2.5 rounded-xl ${point.bgColor} ${point.color} flex-shrink-0 shadow-sm`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-[#0b172a]">
                          {point.title}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 font-sans leading-relaxed">
                          {point.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Executive Voices Section */}
      <section className="bg-[#050e1e] py-20 md:py-24 text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header with Nav Arrows */}
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div>
              <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider block mb-2 font-sans">
                TESTIMONIALS
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Executive Voices
              </h2>
              <p className="text-slate-400 text-sm md:text-base mt-2 font-sans max-w-md">
                Hear what leading technology officers and operational directors say about collaborating with EpitomeTRC.
              </p>
            </div>
            
            {/* Custom Carousel Toggles */}
            <div className="flex space-x-3">
              <button
                onClick={handlePrev}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all focus:outline-none"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-700 transition-all focus:outline-none"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Testimonial Cards Slider Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className={`bg-[#0a1526] border rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg transition-all duration-300 ${
                  activeTestimonial === idx
                    ? "border-orange-500 bg-[#0e1d33]"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex space-x-1 mb-6 text-orange-400">
                    {Array.from({ length: test.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-orange-400" />
                    ))}
                  </div>
                  <p className="text-slate-200 text-base sm:text-lg font-sans leading-relaxed italic mb-8">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>

                <div className="border-t border-slate-800/80 pt-6 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-white text-base">
                      {test.author}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium font-sans mt-0.5">
                      {test.role}
                    </p>
                  </div>
                  <span className="text-3xl font-serif text-orange-500/20 leading-none">&rdquo;</span>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}