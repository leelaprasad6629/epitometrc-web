"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldCheck, Zap, Users, Star, ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface AboutProps {
  persona: "student" | "corporate";
}

export default function About({ persona }: AboutProps) {
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

  return (
    <div id="about-parent-wrapper">
      
      {/* 1. Trust & Executive Section */}
      <section id="about" className="py-20 md:py-28 bg-[#edf4f0]/90 relative border-b border-[#d4eae0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1d4c35]/10 text-[#1d4c35] border border-[#1d4c35]/25">
                <ShieldCheck className="h-3.5 w-3.5" /> Established Corporate Vetting
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0b172a] tracking-tight leading-tight">
                Aligning Engineering Competence with Industry Standards
              </h2>
              <p className="text-slate-655 text-sm sm:text-base leading-relaxed font-sans font-normal">
                EpitomeTRC bridges the gap between academic foundations and enterprise engineering workloads. We build interactive training systems, support recruitment pipelines, and provide strategic advisory.
              </p>
              
              <div className="pt-2">
                <div className="flex items-center space-x-3 text-[#1d4c35] font-bold text-xs uppercase tracking-wider font-sans">
                  <span>ISO 9001:2015 CERTIFIED PARTNER</span>
                </div>
              </div>
            </div>

            {/* Right List Column */}
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/70 border border-[#d4eae0]/70 p-6 sm:p-8 rounded-3xl backdrop-blur-xs">
                {trustPoints.map((point, idx) => {
                  const Icon = point.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.1 }}
                      className="flex flex-col space-y-3"
                    >
                      <div className={`p-2.5 rounded-xl ${point.bgColor} ${point.color} w-fit shadow-sm`}>
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

    </div>
  );
}