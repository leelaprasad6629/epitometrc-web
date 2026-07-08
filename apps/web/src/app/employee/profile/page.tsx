"use client";

import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, MapPin, Award, Phone } from "lucide-react";
import Image from "next/image";
import Button from "@/components/common/Button";

export default function EmployeeProfilePage() {
  const profile = {
    name: "Marcus Thorne",
    role: "Talent Director & Strategy Coach",
    email: "m.thorne@epitome.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces",
    specialization: "IT Recruitment, Agile Systems & Business Transformation",
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
          Manage your advisor bio, client portfolio, and team directory settings.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 max-w-2xl">
        <div className="flex flex-col sm:flex-row gap-5 items-center">
          <div className="relative h-20 w-20 rounded-full border-2 border-slate-100 overflow-hidden">
            <Image
              src={profile.avatar}
              alt={profile.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="text-center sm:text-left space-y-1">
            <h3 className="font-display text-lg font-bold text-[#0b172a]">{profile.name}</h3>
            <p className="text-xs font-semibold text-orange-500 font-sans">{profile.role}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-3 pt-1 text-slate-400 text-xs font-sans">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> London Office
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> {profile.email}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-2 border-t border-slate-50">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Specialization Focus
          </label>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            {profile.specialization}
          </p>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="primary" size="sm" className="h-9 rounded-xl text-xs font-bold px-4">
            Edit Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
