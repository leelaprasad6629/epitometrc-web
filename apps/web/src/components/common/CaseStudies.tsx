"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Building2,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight
} from "lucide-react";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import Button from "@/components/common/Button";

export type CaseStudyCategory = "all" | "consulting" | "recruitment" | "training";

export interface CaseStudyItem {
  id: string;
  category: "consulting" | "recruitment" | "training";
  title: string;
  clientType: string;
  industry: string;
  challenge: string;
  solution: string;
  results: string[];
  primaryMetric: {
    value: string;
    label: string;
  };
  secondaryMetric: {
    value: string;
    label: string;
  };
  trustBadge: string;
}

const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: "cs-1",
    category: "consulting",
    title: "Enterprise Systems Re-engineering & Digital Transformation",
    clientType: "Healthcare Enterprise Client A",
    industry: "Healthcare Technology",
    challenge:
      "Legacy architecture hindered operational scalability and caused latency bottlenecks across multi-hospital diagnostic pipelines.",
    solution:
      "Deployed EpitomeTRC consulting team to audit workflows, implement cloud microservices architecture, and retrain internal DevOps engineers.",
    results: [
      "Zero downtime throughout 6-month migration phase",
      "4.2x increase in daily data processing throughput",
      "100% compliance with ISO & regulatory data privacy standards"
    ],
    primaryMetric: { value: "4.2x", label: "System Throughput" },
    secondaryMetric: { value: "0", label: "Outage Days" },
    trustBadge: "Verified Enterprise Project"
  },
  {
    id: "cs-2",
    category: "recruitment",
    title: "Automated Tech Recruiting & Senior Developer Staffing",
    clientType: "Global FinTech Enterprise B",
    industry: "Financial Services",
    challenge:
      "Struggled with 90-day time-to-hire delays for specialized React & Next.js engineers needed for core platform updates.",
    solution:
      "Leveraged EpitomeTRC recruitment pipeline and technical vetting challenges to deliver pre-qualified senior engineering candidates.",
    results: [
      "Reduced hiring cycle from 90 days down to 18 days",
      "18 senior developers successfully vetted and placed",
      "98.4% 12-month retention rate across placed candidates"
    ],
    primaryMetric: { value: "65%", label: "Faster Time-to-Hire" },
    secondaryMetric: { value: "98.4%", label: "Candidate Retention" },
    trustBadge: "Pan-India Recruitment Node"
  },
  {
    id: "cs-3",
    category: "training",
    title: "Corporate Upskilling & Agile Engineering Cohort",
    clientType: "Manufacturing Client C",
    industry: "Industrial Automation",
    challenge:
      "Inhouse IT staff lacked expertise in cloud native development and modern CI/CD practices required for Smart Factory initiatives.",
    solution:
      "Customized a 12-week intensive EpitomeTRC bootcamp with live project labs, mentored by senior domain consultants.",
    results: [
      "120+ internal software engineers upskilled & certified",
      "Accelerated Smart Factory feature deployment velocity by 45%",
      "Established continuous internal learning academy"
    ],
    primaryMetric: { value: "120+", label: "Engineers Certified" },
    secondaryMetric: { value: "+45%", label: "Deployment Velocity" },
    trustBadge: "Certified Academy Track"
  },
  {
    id: "cs-4",
    category: "training",
    title: "Virtual Internship to Tier-1 Software Placement",
    clientType: "Candidate X (Software Engineering Cohort)",
    industry: "Full Stack Development",
    challenge:
      "Recent graduate possessed theoretical computer science knowledge but lacked real-world production experience required by top employers.",
    solution:
      "Enrolled in EpitomeTRC's hands-on Virtual Internship Program, working on live client projects, AI resume optimization, and mock verbal interviews.",
    results: [
      "Built 3 production-ready web applications on live client specs",
      "Secured Full Stack Software Engineer role within 30 days of graduation",
      "Part of 7000+ Internships Facilitated national success milestone"
    ],
    primaryMetric: { value: "3.5x", label: "Salary Growth" },
    secondaryMetric: { value: "7000+", label: "Internship Network Alum" },
    trustBadge: "Facilitated Internship Alum"
  }
];

interface CaseStudiesProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  limit?: number;
  showFilters?: boolean;
  className?: string;
}

export default function CaseStudies({
  title = "Proven Impact & Client Success Stories",
  eyebrow = "Case Studies",
  description = "Explore real-world outcomes achieved through our strategic consulting, specialized recruitment pipelines, and mentored internship programs.",
  limit,
  showFilters = true,
  className
}: CaseStudiesProps) {
  const [activeTab, setActiveTab] = useState<CaseStudyCategory>("all");
  const [selectedStudy, setSelectedStudy] = useState<CaseStudyItem | null>(null);
  const [studiesList, setStudiesList] = useState<CaseStudyItem[]>([]);

  useEffect(() => {
    async function loadStories() {
      try {
        const res = await fetch("/api/company/info");
        const json = await res.json();
        if (json.success && json.successStories && json.successStories.length > 0) {
          setStudiesList(json.successStories);
        } else {
          setStudiesList(CASE_STUDIES);
        }
      } catch (err) {
        console.warn("Failed to load dynamic case studies:", err);
        setStudiesList(CASE_STUDIES);
      }
    }
    loadStories();
  }, []);

  const filteredStudies = (studiesList.length > 0 ? studiesList : CASE_STUDIES).filter((study) => {
    if (activeTab === "all") return true;
    return study.category === activeTab;
  }).slice(0, limit);

  return (
    <section className={`py-16 md:py-24 bg-[#0b172a] text-white relative overflow-hidden ${className || ""}`}>
      {/* Background glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-blue-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-orange-500/10 blur-[130px] pointer-events-none" />

      <Container className="relative z-10 space-y-12">
        <SectionTitle
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
          light
          className="mx-auto"
        />

        {/* Tab Filters */}
        {showFilters && (
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
            {[
              { id: "all", label: "All Success Stories" },
              { id: "consulting", label: "Enterprise Consulting" },
              { id: "recruitment", label: "Recruitment & Staffing" },
              { id: "training", label: "Training & Internships" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as CaseStudyCategory)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                    : "bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredStudies.map((study, idx) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-slate-800/60 border border-slate-700/60 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-orange-500/50 hover:bg-slate-800/90 transition-all duration-300 shadow-xl group"
            >
              <div className="space-y-6">
                {/* Header Tag & Badges */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {study.trustBadge}
                  </span>
                  <span className="text-[11px] font-bold text-slate-400">
                    {study.industry}
                  </span>
                </div>

                {/* Title & Client Type */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400 block font-sans">
                    {study.clientType}
                  </span>
                  <h3 className="font-display text-xl font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                    {study.title}
                  </h3>
                </div>

                {/* Metrics Highlight Box */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-700/50">
                  <div>
                    <div className="font-display text-2xl font-extrabold text-orange-400">
                      {study.primaryMetric.value}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      {study.primaryMetric.label}
                    </div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-extrabold text-blue-400">
                      {study.secondaryMetric.value}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                      {study.secondaryMetric.label}
                    </div>
                  </div>
                </div>

                {/* Results Bullet List */}
                <div className="space-y-2 font-sans text-xs">
                  <p className="font-bold text-slate-300 uppercase tracking-wider text-[10px]">
                    Key Deliverables &amp; Impact:
                  </p>
                  <ul className="space-y-1.5">
                    {study.results.map((res, i) => (
                      <li key={i} className="flex items-start gap-2 text-slate-300">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Link */}
              <div className="pt-6 border-t border-slate-700/50 flex items-center justify-between mt-6">
                <button
                  onClick={() => setSelectedStudy(study)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  Read Full Story <ChevronRight className="h-4 w-4" />
                </button>
                <LinkToContact category={study.category} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal for full study details */}
        <AnimatePresence>
          {selectedStudy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full text-white space-y-6 relative shadow-2xl overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-orange-400 uppercase tracking-wider bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full">
                      {selectedStudy.clientType}
                    </span>
                    <h3 className="font-display text-xl font-bold text-white mt-3">
                      {selectedStudy.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedStudy(null)}
                    className="text-slate-400 hover:text-white font-bold text-xs bg-slate-800 p-2 rounded-xl border border-slate-700"
                  >
                    Close ✕
                  </button>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-slate-300 font-sans">
                  <div>
                    <h4 className="font-bold text-orange-400 text-xs uppercase tracking-wider mb-1">
                      The Operational Challenge
                    </h4>
                    <p className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                      {selectedStudy.challenge}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-400 text-xs uppercase tracking-wider mb-1">
                      EpitomeTRC Strategic Execution
                    </h4>
                    <p className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                      {selectedStudy.solution}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2">
                      Verified Outcome &amp; Value Realized
                    </h4>
                    <ul className="space-y-2">
                      {selectedStudy.results.map((r, i) => (
                        <li key={i} className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-emerald-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <Button
                    onClick={() => setSelectedStudy(null)}
                    variant="outline"
                    className="h-10 text-xs font-bold border-slate-700 text-slate-300 hover:bg-slate-800"
                  >
                    Close Overview
                  </Button>
                  <Button
                    href="/contact"
                    variant="primary"
                    className="h-10 text-xs font-bold bg-orange-500 hover:bg-orange-600 shadow-md"
                  >
                    Discuss Similar Project <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </Container>
    </section>
  );
}

function LinkToContact({ category }: { category: string }) {
  let label = "Consult Advisors";
  if (category === "recruitment") label = "Hire Talent";
  if (category === "training") label = "Explore Programs";

  return (
    <Button
      href="/contact"
      variant="outline"
      size="sm"
      className="h-8 rounded-xl text-[11px] font-bold border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
    >
      {label}
    </Button>
  );
}
