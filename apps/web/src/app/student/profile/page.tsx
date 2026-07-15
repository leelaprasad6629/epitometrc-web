"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Award, BookOpen, Plus, Trash, Globe, FileText, Upload } from "lucide-react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import Image from "next/image";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import { useResumeStore } from "@/lib/ai/store/resumeStore";
import AIResumeMatchWidget from "@/components/ai/AIResumeMatchWidget";

export default function StudentProfilePage() {
  const { parsedResumeDetails, updateParsedDetails } = useResumeStore();

  const [newSkill, setNewSkill] = useState("");
  const [bio, setBio] = useState("Dedicated junior frontend developer passionate about building clean, performant, and premium web interfaces. Ready to tackle next-generation strategy and technology challenges.");

  // Sync state biography if parsed resume experience details exist
  useEffect(() => {
    if (parsedResumeDetails?.experience) {
      setBio(parsedResumeDetails.experience);
    }
  }, [parsedResumeDetails?.experience]);

  // Skill list helpers
  const skills = parsedResumeDetails?.technicalSkills || ["React.js", "TypeScript", "Tailwind CSS", "Next.js", "Zustand", "Framer Motion"];

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      const updated = [...skills, newSkill.trim()];
      updateParsedDetails({ technicalSkills: updated });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updated = skills.filter((s) => s !== skillToRemove);
    updateParsedDetails({ technicalSkills: updated });
  };

  const fullName = parsedResumeDetails?.fullName || "Alex Thompson";
  const email = parsedResumeDetails?.email || "alex.t@epitome.com";
  const phone = parsedResumeDetails?.phone || "+1 (555) 019-2834";
  const education = parsedResumeDetails?.education || "B.Sc. Computer Science (University of London)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans text-xs"
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
                  alt={fullName}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <h3 className="font-display text-lg font-bold text-[#0b172a]">{fullName}</h3>
                <p className="text-xs font-semibold text-orange-500 font-sans">Student Apprentice</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1 text-slate-400 text-xs font-sans">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> London, UK
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Professional Bio / Summary
              </label>
              <textarea
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value);
                  updateParsedDetails({ experience: e.target.value });
                }}
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
                  <h4 className="text-xs font-bold text-slate-700">{education}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold font-sans">Graduated • verified academic credentials</p>
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

          {/* AI Resume Match Widget */}
          <AIResumeMatchWidget />
        </div>

        {/* Right Column: Skills & Connections */}
        <div className="space-y-6">
          {/* Skills Management */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4 text-left">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              Verified Skills
            </h2>

            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 font-sans group hover:border-red-200"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-500 focus:outline-none transition-colors"
                  >
                    <Trash className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            <form onSubmit={handleAddSkill} className="flex gap-2 pt-2 border-t border-slate-50">
              <Input
                type="text"
                placeholder="Add custom skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="h-9 rounded-xl border border-slate-200 focus-visible:ring-orange-500 font-sans text-xs"
              />
              <Button type="submit" variant="primary" className="h-9 w-9 rounded-xl p-0 flex items-center justify-center bg-[#0b172a] hover:bg-slate-800 shrink-0">
                <Plus className="h-4 w-4 text-white" />
              </Button>
            </form>
          </div>

          {/* Social Profiles */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-display text-sm font-bold text-[#0b172a] uppercase tracking-wider">
              Professional Connections
            </h2>

            <div className="space-y-3">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FaLinkedin className="h-4.5 w-4.5 text-[#0a66c2]" />
                  <span className="text-xs font-bold text-slate-600 font-sans">LinkedIn Profile</span>
                </div>
                <Globe className="h-4 w-4 text-slate-400" />
              </a>

              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-2.5 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FaGithub className="h-4.5 w-4.5 text-slate-800" />
                  <span className="text-xs font-bold text-slate-600 font-sans">GitHub Portfolio</span>
                </div>
                <Globe className="h-4 w-4 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
