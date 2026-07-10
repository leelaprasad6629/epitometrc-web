"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Briefcase, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import Container from "@/components/common/Container";

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("All");
  const [location, setLocation] = useState("All");
  const [jobType, setJobType] = useState("All");

  const jobs = [
    {
      id: 1,
      category: "Engineering",
      title: "Senior Full Stack Developer",
      loc: "London, UK",
      type: "Full Time",
      desc: "Lead the development of high-performance enterprise applications using React, Node.js, and AWS.",
    },
    {
      id: 2,
      category: "Consulting",
      title: "Strategy Consultant",
      loc: "New York, USA",
      type: "Full Time",
      desc: "Advise Fortune 500 executives on digital transformation and market entry strategies. Requires strong analytical skills.",
    },
    {
      id: 3,
      category: "Staffing",
      title: "Technical Recruiter",
      loc: "London, UK",
      type: "Full Time",
      desc: "Shape our engineering teams by identifying, attracting, and onboarding top talent for our clients in the technology sector.",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="pt-20 font-sans bg-slate-50/50">
        {/* Hero Section */}
        <section className="bg-[#0b172a] text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
          <Container className="relative z-10 text-center space-y-6 max-w-3xl">
            <span className="rounded bg-slate-900 border border-slate-800 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
              Careers at EpitomeTRC
            </span>
            <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Build the Future of <br />
              <span className="text-orange-500">Strategic Execution.</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Join a team of visionaries, engineers, and strategists dedicated to delivering best-in-class recruitment, IT services, and corporate consulting.
            </p>
            <div className="pt-4">
              <Button href="#openings" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md shadow-orange-500/10">
                View Openings
              </Button>
            </div>
          </Container>
        </section>

        {/* Current Openings */}
        <section id="openings" className="py-16 md:py-20">
          <Container className="space-y-8">
            <div className="text-center space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Current Openings
              </h2>
              <p className="text-slate-500 text-sm font-sans">
                Find your next role at EpitomeTRC. Use the filters below to browse opportunities.
              </p>
            </div>

            {/* Filter controls */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search roles, skills, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-xs font-semibold outline-none focus:border-orange-500"
                />
              </div>
              <div className="flex gap-2 w-full md:w-auto shrink-0 font-semibold text-xs">
                <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-orange-500 flex-1 md:flex-none">
                  <option>Department</option>
                  <option>Engineering</option>
                  <option>Consulting</option>
                </select>
                <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-orange-500 flex-1 md:flex-none">
                  <option>Location</option>
                  <option>London, UK</option>
                  <option>New York, USA</option>
                </select>
                <select className="h-10 rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-orange-500 flex-1 md:flex-none">
                  <option>Job Type</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                </select>
              </div>
            </div>

            {/* Jobs list grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {jobs.map((job) => (
                <div key={job.id} className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold text-orange-600 bg-orange-50 border border-orange-100 uppercase tracking-wider">
                      {job.category}
                    </span>
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

        {/* Life at EpitomeTRC */}
        <section className="bg-white py-16 md:py-20 border-y border-slate-100">
          <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Our Culture
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Life at EpitomeTRC
              </h2>
              <p className="text-slate-500 text-sm font-sans leading-relaxed">
                We foster an environment where curiosity meets passion. Our culture is built on continuous learning, mutual respect, and a drive for excellence.
              </p>
              <div className="grid grid-cols-3 gap-4 pt-2 text-center">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-base font-bold text-[#0b172a]">Total Well-being</div>
                  <span className="text-[9px] font-semibold text-slate-400 block mt-1">Health & Wellness</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-base font-bold text-[#0b172a]">Career Pathing</div>
                  <span className="text-[9px] font-semibold text-slate-400 block mt-1">Mentorship & growth</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div className="text-base font-bold text-[#0b172a]">Global Flexibility</div>
                  <span className="text-[9px] font-semibold text-slate-400 block mt-1">Work from anywhere</span>
                </div>
              </div>
            </div>
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                alt="Collaborative Innovation"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </Container>
        </section>

        {/* Internship & College Programs */}
        <section className="py-16 md:py-20">
          <Container className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-md order-last lg:order-first">
              <Image
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&h=400&fit=crop"
                alt="Internship & College Programs"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
            <div className="space-y-6">
              <span className="rounded bg-orange-50 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
                Future Leaders
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0b172a]">
                Internship & College Programs
              </h2>
              <p className="text-slate-500 text-sm font-sans leading-relaxed">
                Kickstart your career with EpitomeTRC. We collaborate with top universities to provide hands-on experience in real-world consulting and development projects.
              </p>
              <div className="space-y-3 font-sans text-slate-600 text-xs font-semibold">
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4.5 w-4.5 text-orange-500 shrink-0" /> 12-week summer placements</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4.5 w-4.5 text-orange-500 shrink-0" /> Direct mentorship from senior partners</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="h-4.5 w-4.5 text-orange-500 shrink-0" /> Priority consideration for full-time graduate roles</span>
              </div>
              <div className="pt-2">
                <Button href="/training" variant="primary" className="h-10 rounded-xl px-5 font-bold">
                  Explore Internship Tracks
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Call to Action */}
        <section className="bg-slate-900 text-white py-16 md:py-20 text-center relative overflow-hidden">
          <Container className="space-y-6 max-w-2xl relative z-10">
            <h2 className="font-display text-2xl sm:text-3xl font-bold">
              Ready to lead with precision?
            </h2>
            <p className="text-slate-300 text-sm font-sans leading-relaxed">
              If you don't find a role that fits you, submit your resume anyway. We are always looking for passionate builders.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button href="/register" variant="primary" className="h-11 rounded-xl px-6 font-bold shadow-md">
                Apply Spontaneously
              </Button>
              <Button href="/contact" variant="outline" className="h-11 rounded-xl px-6 font-bold bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white">
                Join Talent Pool
              </Button>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
