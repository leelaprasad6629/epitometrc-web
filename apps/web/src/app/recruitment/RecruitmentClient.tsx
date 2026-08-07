"use client";

import { UserCheck, ShieldCheck, Clock, Award, CheckCircle2, Building2 } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import CaseStudies from "@/components/common/CaseStudies";
import TrustMetricsBanner from "@/components/common/TrustMetricsBanner";

export default function RecruitmentClient() {
  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50">
        <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "Recruitment & Staffing" }]} />
        
        {/* Hero Section */}
        <section className="bg-[#0b172a] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
          <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="rounded bg-slate-900 border border-slate-800 px-3.5 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> Executive Tech Staffing &amp; Bulk Placement
              </span>
              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Precision Tech Matchmaking for <br />
                <span className="bg-gradient-to-r from-orange-400 to-amber-400 bg-clip-text text-transparent">Fast-Scaling Teams.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We identify, vet, and place senior software engineers, cloud architects, and tech leaders into industry-leading roles. Backed by custom skill challenges and rigorous behavioral audits.
              </p>
              
              {/* Micro Trust Stats */}
              <div className="grid grid-cols-3 gap-3 pt-2 font-sans text-xs border-t border-slate-800">
                <div>
                  <div className="font-extrabold text-orange-400 text-lg">18 Days</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Avg Time-to-Hire</div>
                </div>
                <div>
                  <div className="font-extrabold text-emerald-400 text-lg">98.4%</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">12-Mo Retention</div>
                </div>
                <div>
                  <div className="font-extrabold text-blue-400 text-lg">340+</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hiring Clients</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold bg-orange-500 hover:bg-orange-600 shadow-md shadow-orange-500/10">
                  Request Talent Consultation
                </Button>
                <Button href="/careers" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white">
                  View Open Positions
                </Button>
              </div>
            </div>

            <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop"
                alt="Recruitment Services Team"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              
              {/* Floating Badges */}
              <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl text-white border border-slate-700 shadow-xl space-y-0.5">
                <div className="text-base font-extrabold text-emerald-400">98.4% Retention</div>
                <div className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">Zero Placement Regret</div>
              </div>

              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl text-white border border-slate-700 shadow-xl space-y-0.5 max-w-[220px]">
                <div className="text-xs font-bold text-orange-400">🚀 7000+ Alum Pipeline</div>
                <div className="text-[9.5px] font-medium text-slate-300">Pre-vetted software engineering candidates ready for deployment</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Live Trust Metrics Banner */}
        <TrustMetricsBanner variant="light" />

        {/* Expertise Section */}
        <section className="py-16 md:py-20 bg-white">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <span className="rounded bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Tailored Staffing Models
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Strategic Recruitment Expertise
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Tailored talent acquisition strategies designed to scale your enterprise with precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "IT & Cloud Recruitment", desc: "From Cloud Architects to Cybersecurity specialists, we secure technical talent required for high-complexity operations." },
                { title: "Executive Search", desc: "Discreet high-level placement campaigns for VP of Engineering, CTO, and C-Suite technology leadership." },
                { title: "Bulk Hiring & Pod Placement", desc: "Scalable recruitment campaigns to assemble whole engineering or consulting cohorts rapidly within 30 days." },
              ].map((exp, idx) => (
                <div key={idx} className="rounded-3xl border border-slate-100 p-6 sm:p-8 space-y-4 hover:shadow-lg hover:border-orange-200 transition-all bg-white">
                  <span className="p-3 rounded-2xl bg-orange-50 text-orange-500 border border-orange-100 inline-block">
                    <UserCheck className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-[#0b172a]">{exp.title}</h3>
                  <p className="text-slate-500 text-xs font-sans leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Methodology */}
        <section className="py-16 md:py-20 border-t border-slate-100 bg-slate-50/50">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                A Proven Vetting Methodology
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Rigorous multi-stage vetting to ensure exceptional technical quality and organizational alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { num: "01", name: "Deep Sourcing", desc: "Hunting inside our exclusive global candidate database and 7000+ internship alum ecosystem." },
                { num: "02", name: "Behavioral Audit", desc: "Rigorous communication alignment, leadership potential, and culture fit verification." },
                { num: "03", name: "Technical Challenge", desc: "Hands-on engineering challenges evaluated directly by our senior software consultants." },
                { num: "04", name: "Placement SLA", desc: "Negotiation, onboarding support, 90-day retention warranty, and check-in touchpoints." },
              ].map((step) => (
                <div key={step.num} className="space-y-3 p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md transition-shadow">
                  <span className="text-2xl font-extrabold text-orange-500 leading-none">{step.num}</span>
                  <h4 className="text-xs font-bold text-[#0b172a]">{step.name}</h4>
                  <p className="text-slate-500 text-[11px] font-sans leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Case Studies Integration */}
        <CaseStudies
          title="Recruitment Impact Case Studies"
          eyebrow="Enterprise Staffing Results"
          description="Examine how global clients rely on EpitomeTRC to cut hiring cycles by up to 65% while maintaining candidate retention."
          limit={2}
          showFilters={false}
        />

        {/* CTA */}
        <section className="bg-slate-900 text-white py-16 md:py-20 text-center relative overflow-hidden">
          <Container className="space-y-6 max-w-2xl relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to Accelerate Your Tech Hiring?
            </h2>
            <p className="text-slate-300 text-sm font-sans leading-relaxed">
              Connect with our recruitment advisors to discuss your team specifications or request a custom talent pipeline RFP.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md bg-orange-500 hover:bg-orange-600">
                Partner with Us
              </Button>
              <Button href="/careers" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white">
                Explore Careers
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
