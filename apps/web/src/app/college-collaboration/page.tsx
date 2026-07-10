"use client";

import { motion } from "framer-motion";
import { GraduationCap, BookOpen, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export default function CollegeCollaborationPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50">
        {/* Hero Section */}
        <section className="bg-[#0b172a] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
          <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="rounded bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                University Partnerships
              </span>
              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Empowering the Next <br />
                <span className="text-orange-500">Generation of Talent.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                EpitomeTRC bridges the gap between academic excellence and industry demands. We join our partners to foster innovation, skill development, and elite placements.
              </p>
              <div className="flex gap-3 pt-2">
                <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md shadow-orange-500/10">
                  Start a Partnership
                </Button>
                <Button href="/training" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white">
                  View Programs
                </Button>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
                alt="College Collaboration Partnerships"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur-sm px-3.5 py-2 rounded-xl text-center text-white border border-orange-400">
                <div className="text-lg font-bold">500+</div>
                <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Placed Students</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Pillars of Engagement */}
        <section className="py-16 md:py-20 bg-white">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Strategic Pillars of Engagement
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                We offer structured programs to integrate seamlessly with institutional curricula.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Campus Recruitment Drives", desc: "Seamlessly organized onsite and virtual hiring cycles for engineering, IT, and business students.", icon: GraduationCap },
                { title: "Skill Development Workshops", desc: "Hands-on engineering workshops designed to bridge the 'Ready-for-Work' gap.", icon: BookOpen },
                { title: "Research Collaborations", desc: "Joint R&D ventures focused on emerging tech (AI, Blockchain) and sustainable solutions.", icon: Users },
              ].map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="rounded-2xl border border-slate-100 p-6 space-y-4 hover:shadow-sm transition-shadow bg-slate-50/20">
                    <span className="p-2.5 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 inline-block">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-base font-bold text-[#0b172a]">{pillar.title}</h3>
                    <p className="text-slate-500 text-xs font-sans leading-relaxed">{pillar.desc}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Benefits for Institutions */}
        <section className="py-16 md:py-20 border-t border-slate-100 bg-[#f8fafd]">
          <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Impact
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Benefits for Institutions
              </h2>
              <p className="text-slate-500 text-sm font-sans leading-relaxed">
                Elevating campus value through high-impact corporate integration and academic resource support.
              </p>
              <div className="space-y-3 font-sans text-slate-600 text-xs font-semibold">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4.5 w-4.5 text-orange-500 shrink-0" /> Global Career Pipelines</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4.5 w-4.5 text-orange-500 shrink-0" /> Curriculum Enrichment with modern technologies</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4.5 w-4.5 text-orange-500 shrink-0" /> 94% Placement Retention in the first year</span>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="University Collaboration Success"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-16 md:py-20 text-center relative overflow-hidden">
          <Container className="space-y-6 max-w-2xl relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to Shape the Future Together?
            </h2>
            <p className="text-slate-300 text-sm font-sans leading-relaxed">
              Connect with our institutional partnership team to design a customized engagement roadmap.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md">
                Start Partnership
              </Button>
              <Button href="/training" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white">
                Download Brochure
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
