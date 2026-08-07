"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  GraduationCap,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Code,
  LineChart,
  Database,
  UserCheck
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import CaseStudies from "@/components/common/CaseStudies";
import TrustMetricsBanner from "@/components/common/TrustMetricsBanner";

interface InternshipProgram {
  id: string;
  category: "tech" | "management" | "analytics";
  title: string;
  type: string;
  duration: string;
  stipend: string;
  location: string;
  skills: string[];
  description: string;
  highlights: string[];
}

const INTERNSHIP_PROGRAMS: InternshipProgram[] = [
  {
    id: "int-1",
    category: "tech",
    title: "Full Stack React & Next.js Fellowship",
    type: "Virtual / Hybrid Apprenticeship",
    duration: "12 Weeks (3 Months)",
    stipend: "Performance Performance Incentives + Certificate",
    location: "HQ • Hybrid / Remote",
    skills: ["React 19", "Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
    description: "Build production-grade web applications on live client specifications under the mentorship of senior staff engineers.",
    highlights: [
      "Mentored by Senior Full Stack Architects",
      "Direct code commits to production client repositories",
      "AI resume builder & mock interview preparation"
    ]
  },
  {
    id: "int-2",
    category: "analytics",
    title: "Enterprise IT & Business Analyst Internship",
    type: "Virtual Office Apprenticeship",
    duration: "16 Weeks (4 Months)",
    stipend: "Performance Incentives + Project Certificate",
    location: "Virtual Office • Pan-India",
    skills: ["SQL", "Process Modeling", "PowerBI", "Agile Jira", "RFP Design"],
    description: "Assist strategy consulting teams in compiling market intelligence, operational flowcharts, and enterprise client proposals.",
    highlights: [
      "Exposure to Fortune 500 strategic consulting models",
      "Client proposal audit & workflow mapping",
      "Direct placement pathway upon graduation"
    ]
  },
  {
    id: "int-3",
    category: "management",
    title: "Talent Acquisition & HR Virtual Internship",
    type: "Corporate Operations Track",
    duration: "8 Weeks (2 Months)",
    stipend: "Stipend + Certification",
    location: "Remote / HQ",
    skills: ["Technical Screening", "ATS Workflows", "LinkedIn Sourcing", "Interview Scheduling"],
    description: "Master modern corporate recruitment workflows, ATS candidate evaluation algorithms, and executive talent sourcing.",
    highlights: [
      "Hands-on ATS candidate evaluation & screening",
      "Manage real hiring campaigns for corporate clients",
      "ISO 9001:2015 compliant certification"
    ]
  },
  {
    id: "int-4",
    category: "tech",
    title: "Cloud DevOps & Infrastructure Apprenticeship",
    type: "Advanced Technical Track",
    duration: "16 Weeks (4 Months)",
    stipend: "Performance Incentives + Project Certificate",
    location: "Virtual / Remote",
    skills: ["Docker", "Kubernetes", "AWS Cloud", "CI/CD Pipelines", "Terraform"],
    description: "Configure high-availability container deployments, automated CI/CD build scripts, and server monitoring.",
    highlights: [
      "Real-world AWS container orchestration labs",
      "Production deployment troubleshooting",
      "Dedicated senior DevOps mentor"
    ]
  }
];

export default function InternshipsClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filteredPrograms = INTERNSHIP_PROGRAMS.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50 min-h-screen">
        
        {/* Hero Section featuring 7000+ Metric */}
        <section className="bg-[#0b172a] text-white py-20 md:py-28 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
          
          <Container className="relative z-10 space-y-8">
            <div className="max-w-3xl space-y-6">
              
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider shadow-sm">
                <GraduationCap className="h-4 w-4 text-orange-500 animate-pulse" />
                <span>Facilitating 🚀 7000+ Student &amp; Professional Career Trajectories</span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
                Launch Your Career with <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-indigo-400 bg-clip-text text-transparent">
                  Mentored Live Projects.
                </span>
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
                EpitomeTRC&apos;s internship &amp; apprenticeship portal bridges academia and enterprise. Work directly on production-grade client deliverables, receive 1-on-1 mentorship, and get fast-tracked into our recruitment client network.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Button href="#programs" variant="primary" className="h-11 px-6 rounded-xl font-bold bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20">
                  Explore Active Internships <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
                <Button href="/register" variant="outline" className="h-11 px-6 rounded-xl font-bold border-slate-700 text-white hover:bg-slate-800">
                  Submit Candidate Application
                </Button>
              </div>

            </div>
          </Container>
        </section>

        {/* Live Statistics Strip */}
        <TrustMetricsBanner variant="light" />

        {/* Programs Grid Section */}
        <section id="programs" className="py-16 md:py-24 bg-white">
          <Container className="space-y-12">
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="rounded bg-orange-50 border border-orange-100 px-3.5 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Industry-Aligned Tracks
              </span>
              <h2 className="font-display text-3xl font-bold text-[#0b172a] sm:text-4xl">
                Active Internship Openings
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                Select your specialized track below. Every program guarantees mentored hands-on experience, ISO-compliant certification, and career guidance.
              </p>

              {/* Category Switcher */}
              <div className="flex flex-wrap justify-center gap-2 pt-4">
                {[
                  { id: "all", label: "All Tracks" },
                  { id: "tech", label: "Software & Cloud Engineering" },
                  { id: "analytics", label: "Data & Business Analytics" },
                  { id: "management", label: "HR & Operational Staffing" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === cat.id
                        ? "bg-[#0b172a] text-white shadow-md"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Programs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {filteredPrograms.map((prog) => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-3xl border border-slate-100 bg-slate-50/40 p-6 sm:p-8 flex flex-col justify-between hover:shadow-xl hover:border-orange-200 transition-all duration-300 group"
                >
                  <div className="space-y-6">
                    
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 font-bold text-[10px] uppercase tracking-wider">
                        {prog.type}
                      </span>
                      <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {prog.duration}
                      </span>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                      <h3 className="font-display text-xl font-bold text-[#0b172a] group-hover:text-orange-600 transition-colors">
                        {prog.title}
                      </h3>
                      <p className="text-slate-500 text-xs font-sans leading-relaxed">
                        {prog.description}
                      </p>
                    </div>

                    {/* Skills Chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {prog.skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-[10.5px] font-bold">
                          {skill}
                        </span>
                      ))}
                    </div>

                    {/* Highlights List */}
                    <div className="space-y-2 border-t border-slate-200/60 pt-4 font-sans text-xs">
                      <p className="font-bold text-[#0b172a] uppercase tracking-wider text-[10px]">
                        Program Guarantees:
                      </p>
                      <ul className="space-y-1.5">
                        {prog.highlights.map((h, i) => (
                          <li key={i} className="flex items-center gap-2 text-slate-600">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Footer Action */}
                  <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between gap-4">
                    <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-orange-500" /> {prog.location}
                    </div>
                    <Button href="/register" variant="primary" size="sm" className="h-9 px-4 rounded-xl text-xs font-bold bg-[#0b172a] hover:bg-orange-500 shadow-sm">
                      Apply Now
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>

          </Container>
        </section>

        {/* Embedded Case Studies & Success Stories */}
        <CaseStudies
          title="Student Placement & Career Transformations"
          eyebrow="Proven Outcomes"
          description="Read how graduates used EpitomeTRC's mentored internship programs to build real-world project portfolios and launch tech careers."
          showFilters={false}
          limit={2}
        />

        {/* Value Proposition Grid */}
        <section className="py-16 md:py-20 bg-white border-t border-slate-100">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Why Intern with EpitomeTRC?
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Our internship ecosystem is engineered to eliminate the &quot;no experience, no job&quot; loop for software engineering and business graduates.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Code, title: "Production Code Commits", desc: "No dummy exercises. You push real features to active enterprise software repositories." },
                { icon: Users, title: "1-on-1 Mentor Access", desc: "Direct weekly review calls with senior full-stack consultants and technical architects." },
                { icon: Award, title: "ISO 9001 Certification", desc: "Receive globally recognized, verifiable certificates of apprenticeship completion." },
                { icon: UserCheck, title: "Direct Placement Network", desc: "Top performers are directly presented to our 340+ corporate recruitment partners." }
              ].map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div key={idx} className="bg-slate-50/50 rounded-2xl border border-slate-100 p-6 space-y-3 hover:shadow-md transition-shadow">
                    <div className="p-3 rounded-xl bg-orange-50 text-orange-500 w-fit">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-bold text-[#0b172a]">{val.title}</h3>
                    <p className="text-slate-500 text-xs font-sans leading-relaxed">{val.desc}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

      </main>
      <Footer />
    </>
  );
}
