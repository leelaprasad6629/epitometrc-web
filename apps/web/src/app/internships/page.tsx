"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Clock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export default function InternshipsPage() {
  const internships = [
    { id: 1, title: "Frontend Developer Internship", loc: "HQ • Hybrid", duration: "12 Weeks", desc: "Gain hands-on experience building high-performance frontend interfaces with React and Tailwind CSS." },
    { id: 2, title: "IT Analyst Apprenticeship", loc: "Virtual Office", duration: "6 Months", desc: "Assist our strategy consulting teams in compiling market intelligence and designing operational flowcharts." },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50 min-h-screen">
        <section className="py-16">
          <Container className="space-y-8">
            <div className="text-center space-y-2">
              <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Apprenticeships
              </span>
              <h1 className="font-display text-3xl font-bold text-[#0b172a] sm:text-4xl">
                Internship Programs
              </h1>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                Launch your career with hands-on, mentored experience working on production-grade client deliverables.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto pt-6">
              {internships.map((intern) => (
                <div key={intern.id} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug group-hover:text-orange-500 transition-colors">
                      {intern.title}
                    </h3>
                    <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{intern.loc}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{intern.duration}</span>
                    </div>
                    <p className="text-slate-500 text-xs font-sans leading-relaxed pt-1">
                      {intern.desc}
                    </p>
                  </div>
                  <Button href="/register" variant="outline" size="sm" className="w-full h-9 rounded-xl text-xs font-bold">
                    Apply for Internship
                  </Button>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
