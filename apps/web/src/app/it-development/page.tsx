"use client";

import { motion } from "framer-motion";
import { Code, Terminal, Server, Cpu, CheckCircle2, ChevronRight, Laptop } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export default function ITDevelopmentPage() {
  const stack = [
    "TypeScript", "Python", "Go", "Docker", "React", "Angular",
    "PostgreSQL", "AWS", "Kubernetes", "GraphQL", "Elasticsearch", "gRPC"
  ];

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
                IT Development
              </span>
              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Engineering the Future of <br />
                <span className="text-orange-500">Digital Enterprise.</span>
              </h1>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                We build high-performance, scalable, and secure software solutions tailored to the demands of modern business. End-to-end engineering from concept to scale.
              </p>
              <div className="flex gap-3 pt-2">
                <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md shadow-orange-500/10">
                  Start Your Project
                </Button>
                <Button href="/consulting" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white">
                  Our Capabilities
                </Button>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-800">
              <Image
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop"
                alt="IT Development Engineering"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute top-4 right-4 bg-orange-500/90 backdrop-blur-sm px-3.5 py-2 rounded-xl text-center text-white border border-orange-400">
                <div className="text-lg font-bold">99.8%</div>
                <div className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Production Uptime</div>
              </div>
            </div>
          </Container>
        </section>

        {/* Development Ecosystem */}
        <section className="py-16 md:py-20 bg-white">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                The Development Ecosystem
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Comprehensive technology architectures configured for rapid scale and security.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { title: "Web Applications", desc: "Responsive enterprise dashboards, portals, and e-commerce architectures.", icon: Laptop },
                { title: "Mobile Apps", desc: "Native iOS & Android apps built with React Native for consistent performance.", icon: Cpu },
                { title: "Cloud Systems", desc: "Microservices architectures designed for serverless, autoscaling, and resilient delivery.", icon: Server },
                { title: "AI & Machine Learning", desc: "Automated pipelines, cognitive services, and predictive model integration.", icon: Terminal },
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

        {/* Modern Technology Stack */}
        <section className="py-16 md:py-20 border-t border-slate-100 bg-[#f8fafd]">
          <Container className="space-y-12">
            <div className="text-center space-y-2 max-w-2xl mx-auto">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Modern Technology Stack
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                We select and build on frameworks configured for production durability.
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 max-w-4xl mx-auto text-center">
              {stack.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm text-xs font-bold text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* CTA */}
        <section className="bg-slate-900 text-white py-16 md:py-20 text-center relative overflow-hidden">
          <Container className="space-y-6 max-w-2xl relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Have a Project in Mind?
            </h2>
            <p className="text-slate-300 text-sm font-sans leading-relaxed">
              Let's build something amazing together. Connect with our engineering directors.
            </p>
            <div className="flex justify-center pt-2">
              <Button href="/contact" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md">
                Start Project
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
