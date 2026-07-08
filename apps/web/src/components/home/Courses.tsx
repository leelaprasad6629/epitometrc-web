"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, Clock } from "lucide-react";

export default function Courses() {
  const steps = [
    {
      num: "01",
      title: "Discovery",
      description: "In-depth research and comprehensive analysis of your organization's unique challenges.",
      color: "border-blue-500 text-blue-500 bg-blue-50",
    },
    {
      num: "02",
      title: "Design",
      description: "Custom architectural blueprints, software models, and scalable operational workflows.",
      color: "border-[#0b172a] text-[#0b172a] bg-slate-100",
    },
    {
      num: "03",
      title: "Execution",
      description: "High-fidelity development, rigorous validation, and production ecosystem launch.",
      color: "border-orange-500 text-orange-500 bg-orange-50",
    },
    {
      num: "04",
      title: "Optimization",
      description: "Ongoing systems monitoring, real-time analytics, and iterative framework upgrades.",
      color: "border-slate-400 text-slate-500 bg-slate-50",
    },
  ];

  const insights = [
    {
      category: "INFRASTRUCTURE",
      title: "The Future of Connected Infrastructure",
      excerpt: "Exploring next-generation cloud-native development models, serverless paradigms, and secure edge-computing nodes designed to maximize developer speed and lower latency.",
      img: "/images/cloud_infra_insight.jpg",
      date: "Jul 05, 2026",
      readTime: "6 min read",
      color: "text-blue-500 bg-blue-50",
    },
    {
      category: "ENTERPRISE",
      title: "AI in Strategic Recruitment",
      excerpt: "How machine learning and intelligent semantic parsers are transforming leadership matching. Discover the exact frameworks utilized to map elite executive talent securely.",
      img: "/images/ai_recruitment_insight.jpg",
      date: "Jun 28, 2026",
      readTime: "8 min read",
      color: "text-orange-500 bg-orange-50",
    },
    {
      category: "OPERATIONS",
      title: "Scaling Operations Globally",
      excerpt: "Key organizational and system-design principles for multi-region, high-availability deployments. Learn how we scale complex engineering architectures without losing velocity.",
      img: "/images/scaling_operations_insight.jpg",
      date: "Jun 14, 2026",
      readTime: "5 min read",
      color: "text-indigo-500 bg-indigo-50",
    },
  ];

  return (
    <div id="courses-parent-wrapper">
      
      {/* 1. Our Strategic Roadmap Section */}
      <section id="solutions" className="py-20 md:py-28 bg-[#f8fafd] relative border-b border-slate-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider block mb-2 font-sans">
              EXECUTION PIPELINE
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0b172a] tracking-tight leading-tight">
              Our Strategic Roadmap
            </h2>
            <p className="text-slate-600 mt-3 font-sans text-base leading-relaxed">
              A transparent, structured, four-phase methodology guiding your project from initial conception to high-performance, live production.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Connecting line for desktop */}
            <div className="hidden lg:block absolute top-[50px] left-8 right-8 h-0.5 bg-slate-200 border-dashed border-b" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.15 }}
                  className="flex flex-col items-center text-center group"
                >
                  {/* Number Badge */}
                  <div
                    className={`h-16 w-16 rounded-full border-2 flex items-center justify-center font-display font-bold text-lg shadow-sm mb-6 transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-md ${step.color}`}
                  >
                    {step.num}
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-display font-bold text-xl text-[#0b172a] mb-2.5">
                    {step.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-sans leading-relaxed max-w-xs">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 2. Strategic Insights / Courses Section */}
      <section id="blog" className="py-20 md:py-28 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-4">
            <div>
              <span className="text-orange-500 font-semibold text-xs uppercase tracking-wider block mb-2 font-sans">
                KNOWLEDGE BASE
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#0b172a] tracking-tight">
                Strategic Insights
              </h2>
              <p className="text-slate-500 text-sm sm:text-base mt-2 font-sans max-w-md">
                Industry-leading analyses, guides, and engineering reflections authored by our top consulting architects.
              </p>
            </div>
            <Link
              href="#blog"
              className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group self-start md:self-auto"
            >
              Read all posts
              <ArrowUpRight className="ml-1.5 h-4 w-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {insights.map((insight, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden h-48 sm:h-52">
                  <Image
                    src={insight.img}
                    alt={insight.title}
                    width={400}
                    height={220}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-semibold tracking-wider uppercase shadow-sm ${insight.color}`}>
                      {insight.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Date / Reading Time */}
                    <div className="flex items-center space-x-4 text-xs font-medium text-slate-400 mb-3 font-sans">
                      <span className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {insight.date}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {insight.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display font-bold text-lg sm:text-xl text-[#0b172a] mb-3 leading-snug group-hover:text-orange-500 transition-colors duration-200">
                      <Link href="#blog">{insight.title}</Link>
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-500 text-sm font-sans leading-relaxed mb-6">
                      {insight.excerpt}
                    </p>
                  </div>

                  {/* Read More link */}
                  <div className="border-t border-slate-100 pt-4 mt-auto">
                    <Link
                      href="#blog"
                      className="inline-flex items-center text-xs font-bold text-[#0b172a] group-hover:text-orange-500 transition-colors uppercase tracking-wider font-sans"
                    >
                      Read full article
                      <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}