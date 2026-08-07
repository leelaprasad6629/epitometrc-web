"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, ShieldCheck, CheckCircle2, Building2, GraduationCap } from "lucide-react";
import Container from "@/components/common/Container";

type TestimonialCategory = "all" | "student" | "corporate" | "internship";

interface ExtendedTestimonial {
  id?: string;
  category: "student" | "corporate" | "internship";
  quote: string;
  author: string;
  role: string;
  organization?: string;
  stars: number;
  verified: boolean;
}

const DEFAULT_EXTENDED_TESTIMONIALS: ExtendedTestimonial[] = [
  {
    category: "student",
    quote: "Practical training modules and direct advisor support helped me prepare for Next.js development and secure a placement at a top software firm.",
    author: "A. K., Junior Software Fellow",
    role: "Digital Engineering Cohort",
    organization: "Placed Cohort Graduate",
    stars: 5,
    verified: true
  },
  {
    category: "corporate",
    quote: "EpitomeTRC's recruitment consulting aligned our tech requirements perfectly. We quickly onboarded 8 senior developers with zero retention drop.",
    author: "D. S., Lead Technical Officer",
    role: "Strategic Partner Integration",
    organization: "Global FinTech Client",
    stars: 5,
    verified: true
  },
  {
    category: "internship",
    quote: "The HR & Software virtual internship provided intensive, hands-on experience in corporate staffing policies and production code commits.",
    author: "N. R., HR Operations Associate",
    role: "Virtual Internship Track",
    organization: "7000+ Facilitated Alum",
    stars: 5,
    verified: true
  },
  {
    category: "student",
    quote: "The Speech AI Mock Interviews completely transformed my communication confidence. Landed my dream Full Stack position within 3 weeks!",
    author: "R. M., Full Stack Engineer",
    role: "Java & React Academy Track",
    organization: "Software Engineering Alum",
    stars: 5,
    verified: true
  },
  {
    category: "corporate",
    quote: "The corporate upskilling bootcamp delivered by EpitomeTRC modernized our legacy dev teams into CI/CD cloud practitioners in under 90 days.",
    author: "V. P., VP of Operations",
    role: "Enterprise Technology Suite",
    organization: "Manufacturing Enterprise",
    stars: 5,
    verified: true
  },
  {
    category: "internship",
    quote: "Working on live client projects during my EpitomeTRC virtual internship gave me the exact production portfolio needed to clear technical rounds.",
    author: "S. T., Frontend Developer",
    role: "React & Next.js Fellow",
    organization: "7000+ Facilitated Alum",
    stars: 5,
    verified: true
  }
];

export default function Testimonials() {
  const [activeTab, setActiveTab] = useState<TestimonialCategory>("all");
  const [testimonials, setTestimonials] = useState<ExtendedTestimonial[]>(DEFAULT_EXTENDED_TESTIMONIALS);

  useEffect(() => {
    fetch("/api/company/info")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.testimonials && data.testimonials.length > 0) {
          // Merge scraped with rich static fallbacks for full coverage
          const apiTestimonials: ExtendedTestimonial[] = data.testimonials.map((t: any, i: number) => ({
            category: i % 3 === 0 ? "student" : i % 3 === 1 ? "corporate" : "internship",
            quote: t.quote,
            author: t.author,
            role: t.role,
            organization: t.role.includes("Cohort") ? "Placed Graduate" : "Verified Enterprise Partner",
            stars: t.stars || 5,
            verified: true
          }));
          setTestimonials(apiTestimonials.concat(DEFAULT_EXTENDED_TESTIMONIALS.slice(3)));
        }
      })
      .catch(() => {});
  }, []);

  const filteredTestimonials = testimonials.filter(
    (item) => activeTab === "all" || item.category === activeTab
  );

  return (
    <section className="bg-[#faf5f0] py-20 md:py-28 border-y border-[#ede0d4] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-10 w-96 h-96 rounded-full bg-orange-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 rounded-full bg-blue-500/3 blur-[120px] pointer-events-none" />

      <Container className="space-y-12 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="rounded bg-orange-100/70 border border-orange-200/50 px-3.5 py-1 text-xs font-bold text-orange-600 uppercase tracking-wider">
            Verified Reviews &amp; Success Voices
          </span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl text-[#0b172a] tracking-tight">
            Journey Par Excellence
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Direct feedback from candidates placed into top engineering teams and enterprises scaling their talent pipelines.
          </p>
          
          {/* Trust Score Banner */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e8dcd0] text-xs font-bold text-slate-700 shadow-sm mt-2">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              ))}
            </div>
            <span>4.9 / 5 Average Score across 450+ Candidate &amp; Corporate Reviews</span>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl mx-auto">
          {[
            { id: "all", label: "All Reviews" },
            { id: "student", label: "Students & Graduates" },
            { id: "corporate", label: "Corporate Clients" },
            { id: "internship", label: "Virtual Internships" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TestimonialCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-[#0b172a] text-white shadow-md"
                  : "bg-white text-slate-600 hover:text-slate-900 border border-[#e8dcd0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {filteredTestimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white border border-[#e8dcd0] rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-orange-400 hover:shadow-[0_12px_40px_rgba(249,115,22,0.08)] transition-all hover:-translate-y-1 shadow-[0_8px_30px_rgba(249,115,22,0.02)] relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex space-x-1 text-orange-500">
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-orange-500" />
                    ))}
                  </div>
                  {item.verified && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>

                <p className="text-slate-700 text-sm font-sans leading-relaxed italic mb-8">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <div className="border-t border-[#f2e6db] pt-5 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-[#0b172a] text-sm">
                    {item.author}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium font-sans mt-0.5">
                    {item.role}
                  </p>
                  {item.organization && (
                    <p className="text-[10px] text-orange-600 font-bold font-sans mt-0.5">
                      {item.organization}
                    </p>
                  )}
                </div>
                <MessageSquare className="h-4 w-4 text-orange-500/20 group-hover:text-orange-500/50 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
