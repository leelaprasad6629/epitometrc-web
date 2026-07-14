"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Award, BookOpen, Plus, Trash, Globe, FileText, Upload } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import Image from "next/image";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

import AIResumeMatchWidget from "@/components/ai/AIResumeMatchWidget";
import AIResumeBuilderWidget from "@/components/ai/AIResumeBuilderWidget";

export default function StudentProfilePage() {
  const [skills, setSkills] = useState(["React.js", "TypeScript", "Tailwind CSS", "Next.js", "Zustand", "Framer Motion"]);
  const [newSkill, setNewSkill] = useState("");
  const [bio, setBio] = useState("Dedicated junior frontend developer passionate about building clean, performant, and premium web interfaces. Ready to tackle next-generation strategy and technology challenges.");

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          My Profile
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your personal details, professional biography, and verified skillset.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row gap-5 items-center">
              <div className="relative h-20 w-20 rounded-full border-2 border-slate-100 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=120&h=120&fit=crop&crop=faces"
                  alt="Alex Thompson"
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h3 className="font-display text-lg font-bold text-[#0b172a]">Alex Thompson</h3>
                <p className="text-xs font-semibold text-orange-500 font-sans">Frontend Engineer Apprentice</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1 text-slate-400 text-xs font-sans">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> London, UK
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> alex.t@epitome.com
                  </span>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Professional Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3.5 text-xs text-slate-600 font-sans leading-relaxed focus:border-orange-500 outline-none h-28 resize-none bg-slate-50/20"
              />
            </div>
          </div>

          {/* Education & Certificates */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              Education & Background
            </h2>

            <div className="space-y-4">
              <div className="flex gap-3.5 items-start">
                <span className="p-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 shrink-0">
                  <BookOpen className="h-4.5 w-4.5" />
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-700">B.Sc. Computer Science</h4>
                  <p className="text-[10px] text-slate-400 font-semibold font-sans">University of London • Graduated 2025</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <span className="p-2 rounded-xl bg-orange-50 border border-orange-100 text-orange-500 shrink-0">
                  <Award className="h-4.5 w-4.5" />
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-slate-700">Full-Stack Bootcamp Certificate</h4>
                  <p className="text-[10px] text-slate-400 font-semibold font-sans">EpitomeTRC Academics • 2026</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Resume Match & Professional Builder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <AIResumeMatchWidget />
            <AIResumeBuilderWidget />
          </div>
        </div>

        {/* Right Column: Skills & Resume */}
        <div className="space-y-6">
          {/* Skills Management */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              Verified Skills
            </h2>

            {/* Skills grid */}
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 border border-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 font-sans"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <form onSubmit={handleAddSkill} className="flex gap-2 pt-2 border-t border-slate-50">
              <Input
                type="text"
                placeholder="Add custom skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="h-9 text-xs rounded-xl border-slate-200 focus:border-orange-500 flex-1"
              />
              <button
                type="submit"
                className="flex items-center justify-center h-9 w-9 rounded-xl bg-[#0b172a] text-white hover:bg-slate-800 transition-colors shrink-0"
              >
                <Plus className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Resume PDF upload */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              Curriculum Vitae / Resume
            </h2>

            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center space-y-3 bg-slate-50/20">
              <FileText className="mx-auto h-8 w-8 text-slate-400" />
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-700">Alex_Thompson_Resume.pdf</p>
                <p className="text-[10px] text-slate-400 font-medium font-sans">Uploaded on 30 Nov 2026 • 2.4 MB</p>
              </div>
              <button className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors mt-2">
                <Upload className="h-3.5 w-3.5" />
                Upload New
              </button>
            </div>
          </div>



          {/* Social Profiles */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              Professional Connections
            </h2>

            <div className="space-y-3 font-sans">
              <a href="#" className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                <FaLinkedin className="h-4.5 w-4.5 text-[#0A66C2] shrink-0" />
                <div className="text-xs font-semibold text-slate-600">LinkedIn Profile</div>
              </a>
              <a href="#" className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                <FaGithub className="h-4.5 w-4.5 text-slate-800 shrink-0" />
                <div className="text-xs font-semibold text-slate-600">GitHub Repository</div>
              </a>
              <a href="#" className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 hover:bg-slate-50 transition-colors">
                <Globe className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                <div className="text-xs font-semibold text-slate-600">Personal Website</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
