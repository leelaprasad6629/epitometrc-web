"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  TrendingUp, 
  Mic, 
  CheckCircle2, 
  Check 
} from "lucide-react";
import Button from "@/components/common/Button";
import Link from "next/link";

type DemoTab = "qualifier" | "crm" | "proposal" | "resume" | "interview";

export default function WalkthroughDemo() {
  const [activeTab, setActiveTab] = useState<DemoTab>("qualifier");

  const tabs = [
    { id: "qualifier", name: "AI Lead Qualifier", icon: UserCheck },
    { id: "crm", name: "AI CRM Timeline", icon: TrendingUp },
    { id: "proposal", name: "AI Proposal Writer", icon: FileText },
    { id: "resume", name: "AI Resume Matcher", icon: Sparkles },
    { id: "interview", name: "Mock Interviewer", icon: Mic },
  ];

  return (
    <section id="demo-walkthrough" className="py-20 md:py-28 bg-[#fafafb] border-t border-b border-slate-100 font-sans relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-orange-100/30 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 text-center space-y-12 relative z-10">
        <div className="space-y-3">
          <span className="rounded-full bg-blue-50 border border-blue-100 px-3.5 py-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest inline-flex items-center gap-1.5 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-500 animate-pulse" /> Interactive Showcase
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
            See How the Platform <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-orange-500 bg-clip-text text-transparent">Works.</span>
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto font-medium">
            Explore our real-time simulated AI capabilities built directly on top of client pipeline records.
          </p>
        </div>

        {/* Tab Switcher Grid */}
        <div className="flex flex-wrap justify-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/50 max-w-3xl mx-auto backdrop-blur-sm">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as DemoTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-[#0b172a] text-white shadow-lg shadow-slate-900/10"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-orange-500 animate-pulse" : "text-slate-400"}`} />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* Dynamic Display Board */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden max-w-4xl mx-auto min-h-[420px] flex flex-col md:flex-row relative">
          <div className="flex-1 p-6 md:p-10 text-left space-y-6 flex flex-col justify-between border-r border-slate-50">
            <AnimatePresence mode="wait">
              {activeTab === "qualifier" && (
                <motion.div
                  key="qualifier"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <span className="px-2.5 py-1 rounded-md text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest">
                    Sales Ops Automation
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#0b172a]">
                    AI Lead Qualification Assistant
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    Automatically parse unstructured project enquiries from clients, score conversion probabilities (0-100), assign priority tiers, and suggest standard contract actions.
                  </p>
                  <ul className="space-y-2 text-slate-600 text-xs font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Calculates matching score based on tech spec alignment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Flags hot/cold status categories instantly
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Supports custom overrides from BD Managers
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === "crm" && (
                <motion.div
                  key="crm"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <span className="px-2.5 py-1 rounded-md text-[9px] font-black bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-widest">
                    Timeline Analytics
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#0b172a]">
                    AI CRM Timeline Assistant
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    Summarize customer interactions dynamically, track communication history across emails and meetings, and auto-generate follow-up reminder logs.
                  </p>
                  <ul className="space-y-2 text-slate-600 text-xs font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Constructs account timeline lists from raw logs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Suggests next-best follow-up items
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Keeps histories synced on client profiles
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === "proposal" && (
                <motion.div
                  key="proposal"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <span className="px-2.5 py-1 rounded-md text-[9px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-widest">
                    Sales Enablement
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#0b172a]">
                    AI Proposal Writer & Exporter
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    Generate project statements, scope definitions, timeline outlines, and estimated pricing tables. Fully editable and exportable to Word or PDF formats.
                  </p>
                  <ul className="space-y-2 text-slate-600 text-xs font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Builds customized service proposal outlines
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Tracks edit audit history logs (v1.0, v1.1)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      One-click PDF downloads and exports
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === "resume" && (
                <motion.div
                  key="resume"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <span className="px-2.5 py-1 rounded-md text-[9px] font-black bg-cyan-50 text-cyan-600 border border-cyan-100 uppercase tracking-widest">
                    ATS Intelligence
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#0b172a]">
                    AI Resume Matcher & Optimizer
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    Match candidate resumes against target job descriptions in real-time, calculating alignment score gauges, flagging missing skills, and recommending upskilling courses.
                  </p>
                  <ul className="space-y-2 text-slate-600 text-xs font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Analyzes skill gaps against description parameters
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Scores matching probability using LLMs
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Recommends target certification course tracks
                    </li>
                  </ul>
                </motion.div>
              )}

              {activeTab === "interview" && (
                <motion.div
                  key="interview"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <span className="px-2.5 py-1 rounded-md text-[9px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                    Candidate Upskilling
                  </span>
                  <h3 className="text-xl md:text-2xl font-display font-extrabold text-[#0b172a]">
                    Speech AI Mock Interviewer
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-medium">
                    Simulate real recruiter-style mock interviews using speech-to-text recorders, scoring candidate answers and providing confidence feedback.
                  </p>
                  <ul className="space-y-2 text-slate-600 text-xs font-semibold">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Verbal speech response transcript analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Auto-evaluates tech stack completeness
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                      Scores answers and highlights suggested changes
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>

            <Link
              href="/login"
              className="w-max inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#0b172a] hover:bg-orange-500 transition-colors uppercase tracking-wider px-5 py-2.5 rounded-xl mt-4"
            >
              Get Started Now <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Right Panel - Mock Widget Preview */}
          <div className="flex-1 bg-slate-950 p-6 md:p-8 flex items-center justify-center relative overflow-hidden">
            {/* Background glowing gradients inside widget container */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-[80px]" />
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-50/10 rounded-full blur-[60px]" />

            <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-5 text-white space-y-4 shadow-2xl relative z-10 font-sans text-xs">
              <AnimatePresence mode="wait">
                {activeTab === "qualifier" && (
                  <motion.div
                    key="widget-qualifier"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3"
                  >
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-white text-sm">Leads Analytics</h4>
                        <p className="text-[9.5px] font-semibold text-slate-400">ID: LEAD-920</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-orange-500 text-[9px] font-bold text-white uppercase tracking-wider animate-pulse">
                        Hot Lead
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10.5px]">
                        <span className="text-slate-400 font-semibold">Client Name:</span>
                        <span className="font-bold text-white">Acme Corp</span>
                      </div>
                      <div className="flex justify-between text-[10.5px]">
                        <span className="text-slate-400 font-semibold">Conversion Probability:</span>
                        <span className="font-bold text-green-400 text-sm">94.8%</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-300 font-medium leading-relaxed mt-2.5">
                        <strong className="text-orange-500 font-bold block mb-0.5">AI Insights:</strong>
                        Acme is seeking React developers with AWS cloud specialization. Matching score is high due to current leadership academy rosters.
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "crm" && (
                  <motion.div
                    key="widget-crm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                      <h4 className="font-bold text-white text-sm">Interaction Timeline</h4>
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    </div>
                    <div className="relative pl-4 border-l border-white/10 space-y-4 py-1 text-[10px] font-medium text-slate-300">
                      <div className="space-y-0.5 relative">
                        <span className="absolute -left-[20px] top-1.5 h-2 w-2 rounded-full bg-blue-500" />
                        <p className="font-bold text-white text-[10.5px]">v1.0 Proposal Drafted</p>
                        <p className="text-slate-400 text-[9.5px] font-semibold">Today, 2:15 PM • Alex Rose</p>
                      </div>
                      <div className="space-y-0.5 relative">
                        <span className="absolute -left-[20px] top-1.5 h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                        <p className="font-bold text-orange-500 text-[10.5px]">Suggested Action Item</p>
                        <p className="text-slate-200">Email client regarding AWS security specs.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "proposal" && (
                  <motion.div
                    key="widget-proposal"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3.5"
                  >
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                      <h4 className="font-bold text-white text-sm">Interactive Draft</h4>
                      <span className="text-[9.5px] text-slate-400 font-bold uppercase tracking-wider">v1.2 active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                        <p className="font-bold text-slate-300 text-[10.5px]">Estimated Project Pricing</p>
                        <p className="text-orange-500 font-bold text-base">$14,500 <span className="text-[10px] text-slate-400 font-semibold font-sans">/ project</span></p>
                      </div>
                      <div className="flex gap-2 pt-1.5">
                        <div className="flex-1 py-1.5 rounded-lg text-center bg-white/10 hover:bg-white/20 transition-all font-bold cursor-pointer">
                          Edit Pricing
                        </div>
                        <div className="flex-1 py-1.5 rounded-lg text-center bg-orange-500 hover:bg-orange-600 transition-all font-bold cursor-pointer flex items-center justify-center gap-1">
                          <Check className="h-3.5 w-3.5" /> Approve
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "resume" && (
                  <motion.div
                    key="widget-resume"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3.5"
                  >
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                      <h4 className="font-bold text-white text-sm">ATS Alignment Score</h4>
                      <div className="h-8 w-8 rounded-full border-2 border-orange-500 flex items-center justify-center font-bold text-orange-500 text-[10.5px]">
                        87%
                      </div>
                    </div>
                    <div className="space-y-2 text-[10.5px]">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-slate-400 font-semibold">Matched:</span>
                        <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-bold text-[9px] border border-green-500/30">React</span>
                        <span className="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 font-bold text-[9px] border border-green-500/30">TypeScript</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-slate-400 font-semibold">Missing:</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-bold text-[9px] border border-red-500/30">Kubernetes</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "interview" && (
                  <motion.div
                    key="widget-interview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-3.5"
                  >
                    <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                      <h4 className="font-bold text-white text-sm">AI Audio Analysis</h4>
                      <div className="flex items-center gap-1 text-red-500 font-bold text-[9.5px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" /> REC
                      </div>
                    </div>
                    <div className="space-y-3 text-center">
                      {/* Simulated wave bars */}
                      <div className="flex justify-center items-end gap-1 h-8 mt-2">
                        {[0.3, 0.7, 0.4, 0.9, 0.2, 0.8, 0.5, 0.95, 0.4, 0.8, 0.3].map((val, idx) => (
                          <motion.span
                            key={idx}
                            animate={{ height: [`${val * 100}%`, `${(1 - val) * 100}%`, `${val * 100}%`] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: idx * 0.08 }}
                            className="w-1.5 bg-orange-500 rounded-full"
                            style={{ height: `${val * 100}%` }}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold">Confidence Rating: <span className="text-green-400 font-bold text-[10.5px]">Excellent (91%)</span></p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
