"use client";

import { motion } from "framer-motion";
import { Server, Cloud, Shield, Headphones, CheckCircle2, ChevronRight } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";
import Breadcrumbs from "@/components/common/Breadcrumbs";

export default function ITServicesPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50">
        <Breadcrumbs items={[{ label: "Services", href: "/services" }, { label: "IT Services" }]} />
        {/* Hero Section */}
        <section className="bg-[#0b172a] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
          <Container className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="rounded bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                IT Services
              </span>
              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Robust Infrastructure & <br />
                <span className="text-orange-500">Digital Solutions.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                Empowering global enterprise with scalable architectures, proactive security, and seamless managed services. Keep your IT core operating at peak efficiency.
              </p>
              <div className="flex gap-3 pt-2">
                <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md shadow-orange-500/10">
                  Get Support
                </Button>
                <Button href="/blog" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white">
                  View Case Studies
                </Button>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop"
                alt="IT Services Server Room"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </Container>
        </section>

        {/* Capabilities */}
        <section className="py-16 md:py-20 bg-white">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Specialized Tech Capabilities
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Enterprise-grade IT systems management configured for continuous optimization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Managed IT", desc: "End-to-end monitoring, proactive maintenance, and systems patch cycles.", icon: Server },
                { title: "Cloud Solutions", desc: "Architecting cloud migrations, multi-cloud management, and operational efficiency.", icon: Cloud },
                { title: "Cybersecurity", desc: "Continuous vulnerability assessments, identity governance, and threat detection.", icon: Shield },
                { title: "Enterprise Support", desc: "Dedicated advisor support teams with guaranteed SLA reaction parameters.", icon: Headphones },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="rounded-2xl border border-slate-100 p-6 space-y-4 hover:shadow-sm transition-shadow bg-slate-50/20">
                    <span className="p-2.5 rounded-xl bg-orange-50 text-orange-500 border border-orange-100 inline-block">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-display text-sm font-bold text-[#0b172a]">{item.title}</h3>
                    <p className="text-slate-500 text-xs font-sans leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Industries We Serve */}
        <section className="py-16 md:py-20 border-t border-slate-100 bg-[#f8fafd]">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Industries We Serve
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Tailored solutions for sectors that demand absolute reliability and compliance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { title: "Finance", desc: "FCA/SEC compliance, transaction security, and low-latency infrastructure design.", image: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=250&fit=crop" },
                { title: "Retail & Logistics", desc: "Cold chain telemetry, supply chain integrations, and omnichannel architecture.", image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop" },
                { title: "Healthcare", desc: "HIPAA compliant storage, records accessibility, and smart clinic telemetry.", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400&h=250&fit=crop" },
              ].map((ind, idx) => (
                <div key={idx} className="group rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={ind.image}
                      alt={ind.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-sm font-bold text-[#0b172a]">{ind.title}</h3>
                    <p className="text-slate-500 text-xs font-sans leading-relaxed">{ind.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-16 md:py-20 text-center relative overflow-hidden">
          <Container className="space-y-6 max-w-2xl relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to Fortify Your Digital Core?
            </h2>
            <p className="text-slate-300 text-sm font-sans leading-relaxed">
              Connect with our IT infrastructure architects to design a customized strategy.
            </p>
            <div className="flex justify-center pt-2">
              <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md">
                Get Support
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
