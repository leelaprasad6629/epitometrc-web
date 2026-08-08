"use client";

import { useEffect, useState } from "react";
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

const iconMap: Record<string, any> = {
  Globe,
  Award,
  Users,
  Code2,
  UserCheck,
  TrendingUp,
  GraduationCap,
  Cloud
};

interface ServicesProps {
  persona: "student" | "corporate";
}

interface DynamicService {
  title: string;
  subtitle: string;
  slug: string;
  description: string;
  iconName: string;
  category: string;
  features: string[];
}

export default function Services({ persona }: ServicesProps) {
  const [statsData, setStatsData] = useState<Array<{ value: string; label: string; icon: any }>>([]);
  const [servicesList, setServicesList] = useState<DynamicService[]>([]);

  useEffect(() => {
    async function loadCompanyDetails() {
      try {
        const res = await fetch("/api/company/info");
        const json = await res.json();
        if (json.success && json.isDatabaseDriven) {
          const statsArray = json.collaborations.map((col: any) => {
            let matchedIcon = Globe;
            if (col.name.toLowerCase().includes("client") || col.name.toLowerCase().includes("partner")) matchedIcon = Users;
            if (col.name.toLowerCase().includes("project")) matchedIcon = Award;
            return {
              value: col.count,
              label: col.name,
              icon: matchedIcon
            };
          });
          setStatsData(statsArray);
          const personaServices = json.services.filter((s: any) => 
            s.persona === "all" || s.persona === persona
          );
          setServicesList(personaServices);
        } else {
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
          setStatsData(persona === "student" ? studentStats : corporateStats);
        }
      } catch (err) {
        console.warn("Failed to load dynamic stats/services:", err);
        setStatsData(persona === "student" ? [
          { value: "12k+", label: "Resumes Audited", icon: Globe },
          { value: "94.8%", label: "First-Attempt Pass Rate", icon: Award },
          { value: "450+", label: "Active Tech Partners", icon: Users },
        ] : [
          { value: "25+", label: "Global Client Countries", icon: Globe },
          { value: "1,200+", label: "Projects Completed", icon: Award },
          { value: "150+", label: "Lead Consultants", icon: Users },
        ]);
      }
    }
    loadCompanyDetails();
  }, [persona]);

  return (
    <div id="services-parent-container">
      {/* 1. Statistics Bar Section */}
      <section className="bg-[#050e1e] py-12 md:py-16 text-white relative z-20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-800">
            {statsData.map((stat, idx) => {
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
            {servicesList.length > 0 ? (
              servicesList.map((service, idx) => {
                const Icon = iconMap[service.iconName] || Code2;
                const isFeatured = idx === 0;
                return (
                  <motion.div
                    key={service.slug}
                    whileHover={{ y: -6 }}
                    className={`${
                      isFeatured ? "md:col-span-2 bg-white" : "bg-white"
                    } rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative`}
                  >
                    <div>
                      <div className="p-3 bg-orange-50 rounded-xl text-orange-500 inline-block mb-6 shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-[#0b172a] mb-3">
                        {service.title}
                      </h3>
                      <p className="text-slate-600 max-w-lg font-sans leading-relaxed text-sm">
                        {service.description}
                      </p>
                    </div>
                    <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-sans">
                        {service.category}
                      </span>
                      <Link href={`/${service.slug}`} className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <>
                {/* IT Development */}
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
                      Professional React, TypeScript, and Node.js cloud solutions designed to maximize scalability. We architect and implement high-performance web applications, robust APIs, and custom integrations.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest font-sans">
                      Cloud Native • Full Stack
                    </span>
                    <Link href="/it-development" className="p-1.5 bg-slate-50 rounded-lg text-slate-400 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </motion.div>

                {/* Strategic Recruitment */}
                <motion.div
                  whileHover={{ y: -6 }}
                  className="bg-[#fff9f4] rounded-2xl p-8 shadow-sm hover:shadow-xl border border-[#fbe5d0] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-orange-500/5 rounded-full blur-xl" />
                  <div>
                    <div className="p-3 bg-orange-100/60 rounded-xl text-orange-600 inline-block mb-6 shadow-sm">
                      <UserCheck className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-display font-bold text-[#0b172a] mb-3">
                      Strategic Recruitment
                    </h3>
                    <p className="text-slate-700 text-sm font-sans leading-relaxed">
                      Connecting visionary companies with world-class tech leaders, senior engineers, and elite consultants.
                    </p>
                  </div>
                  <div className="mt-8 pt-6 border-t border-[#fbe5d0] flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-sans">
                      Executive Search
                    </span>
                    <Link href="/recruitment" className="p-1.5 bg-orange-100/40 rounded-lg text-orange-650 group-hover:bg-orange-500 group-hover:text-white transition-colors duration-300">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
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
                      Operational streamlining and digital transformation planning to drive margin improvements.
                    </p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link href="/consulting" className="text-xs font-bold text-[#0b172a] hover:text-orange-500 flex items-center tracking-wider uppercase font-sans">
                      More
                      <ArrowRight className="ml-1 h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}