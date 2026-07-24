"use client";

import { motion } from "framer-motion";
import { Briefcase, CheckCircle2, UserCheck, ShieldCheck, ArrowRight } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default function RecruitmentPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50">
        <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "Recruitment" }]} />
        {/* Hero Section */}
        <section className="bg-[#0b172a] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
          <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="rounded bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Recruitment Services
              </span>
              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Bridging Talent with <br />
                <span className="text-orange-500">Opportunity.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We identify, vet, and place the world's best tech professionals into industry-leading roles. Precision talent matchmaking for fast-scaling teams.
              </p>
              <div className="flex gap-3 pt-2">
                <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md shadow-orange-500/10">
                  Partner with Us
                </Button>
                <Button href="/careers" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white">
                  View Openings
                </Button>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop"
                alt="Recruitment Services Team"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur-sm px-3.5 py-2 rounded-xl text-center text-white border border-orange-400">
                <div className="text-lg font-bold">98%</div>
                <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Retention Rate</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Expertise Section */}
        <section className="py-16 md:py-20 bg-white">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Strategic Recruitment Expertise
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Tailored talent acquisition strategies designed to scale your enterprise with precision.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "IT Recruitment", desc: "From Cloud Architects to Cybersecurity specialists, we secure the technical talent required for high-complexity operations." },
                { title: "Executive Search", desc: "Discreet high-level placements for VP, CTO, and C-Suite technology leadership parameters." },
                { title: "Bulk Hiring", desc: "Scalable recruitment campaigns to assemble whole engineering or consulting cohorts rapidly." },
              ].map((exp, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-100 p-6 space-y-4 hover:shadow-sm transition-shadow bg-slate-50/20">
                  <span className="p-2.5 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 inline-block">
                    <UserCheck className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-base font-bold text-[#0b172a]">{exp.title}</h3>
                  <p className="text-slate-500 text-xs font-sans leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Methodology */}
        <section className="py-16 md:py-20 border-t border-slate-100">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                A Proven Methodology
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Rigorous multi-stage vetting to ensure exceptional quality and organizational alignment.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {[
                { num: "01", name: "Sourcing", desc: "Deep hunting inside our exclusive global database." },
                { num: "02", name: "Screening", desc: "Rigorous behavioral and skill alignment review." },
                { num: "03", name: "Technical Evaluation", desc: "Hands-on engineering challenges evaluated by our consultants." },
                { num: "04", name: "Placement", desc: "Negotiation, onboarding support, and continuous touchpoints." },
              ].map((step) => (
                <div key={step.num} className="space-y-3 p-4 rounded-2xl border border-slate-50 bg-white">
                  <span className="text-2xl font-extrabold text-orange-500 leading-none">{step.num}</span>
                  <h4 className="text-xs font-bold text-[#0b172a]">{step.name}</h4>
                  <p className="text-slate-500 text-[11px] font-sans leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-16 md:py-20 text-center relative overflow-hidden">
          <Container className="space-y-6 max-w-2xl relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to Transform Your Workforce?
            </h2>
            <p className="text-slate-300 text-sm font-sans leading-relaxed">
              Connect with our recruitment advisors to discuss your hiring pipelines.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md">
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
