"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export default function JobsPage() {
  const jobs = [
    { id: 1, title: "Senior Full Stack Developer", loc: "Indore, India", type: "Full Time", desc: "Lead the development of high-performance enterprise applications using React, Node.js, and AWS." },
    { id: 2, title: "Strategy Consultant", loc: "Indore, India", type: "Full Time", desc: "Advise Fortune 500 executives on digital transformation and market entry strategies." },
    { id: 3, title: "Technical Recruiter", loc: "Indore, India", type: "Full Time", desc: "Shape our engineering teams by identifying, attracting, and onboarding top talent." },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50 min-h-screen">
        <section className="py-16">
          <Container className="space-y-8">
            <div className="text-center space-y-2">
              <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Opportunities
              </span>
              <h1 className="font-display text-3xl font-bold text-[#0b172a] sm:text-4xl">
                Open Job Positions
              </h1>
              <p className="text-slate-500 text-sm max-w-lg mx-auto">
                Explore open positions at EpitomeTRC and help shape the future of strategy and technology.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto pt-6">
              {jobs.map((job) => (
                <div key={job.id} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="font-display text-base font-bold text-[#0b172a] leading-snug group-hover:text-orange-500 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.loc}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{job.type}</span>
                    </div>
                    <p className="text-slate-500 text-xs font-sans leading-relaxed pt-1">
                      {job.desc}
                    </p>
                  </div>
                  <Button href="/register" variant="outline" size="sm" className="w-full h-9 rounded-xl text-xs font-bold">
                    Apply Now
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
