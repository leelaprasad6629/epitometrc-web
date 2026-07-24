"use client";

import { motion } from "framer-motion";
import { User, Mail, ShieldCheck, MapPin, Award, Phone, Globe, Briefcase, Sparkles, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Button from "@/components/common/Button";
import DashboardCard from "@/components/dashboard/DashboardCard";
import ProgressBar from "@/components/dashboard/ProgressBar";

export default function EmployeeProfilePage() {
  const profile = {
    name: "Marcus Thorne",
    role: "Talent Director & Strategy Coach",
    email: "m.thorne@epitometrc.com",
    phone: "+91-626-596-6705",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces",
    specialization: "IT Recruitment, Agile Systems & Business Transformation",
    office: "Indore HQ",
    availability: "95%",
    verifiedStatus: "Gold Certified Lead",
  };

  const clientPortfolio = [
    { name: "GlobalTech Solutions", allocation: 60, status: "Active Lead", variant: "blue" as const },
    { name: "Apex Strategy Group", allocation: 25, status: "On Track", variant: "purple" as const },
    { name: "Torus Systems", allocation: 15, status: "Pending Review", variant: "orange" as const }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans text-xs text-slate-700"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4">
        <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
          My Profile
        </h1>
        <p className="text-slate-500 text-sm">
          Manage your advisor bio, client portfolio, and team directory settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card & Details */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard glowColor="blue" title="Advisor Profile" subtitle="Public directory overview credentials">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-5 items-center">
                <div className="relative h-20 w-20 rounded-2xl border border-slate-200 overflow-hidden shadow-inner shrink-0">
                  <Image
                    src={profile.avatar}
                    alt={profile.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="text-center sm:text-left space-y-1">
                  <h3 className="font-display text-lg font-bold text-[#0b172a] leading-none">
                    {profile.name}
                  </h3>
                  <p className="text-xs font-bold text-orange-500 font-sans">{profile.role}</p>
                  
                  <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-1 text-slate-400 text-[10.5px] font-sans font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {profile.office}
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> {profile.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5 text-slate-400" /> {profile.phone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5 pt-4 border-t border-slate-50 text-left">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Specialization Focus
                </h4>
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
          </DashboardCard>

          {/* Active Client Portfolio Allocations */}
          <DashboardCard glowColor="purple" title="Active Client Allocations" subtitle="Current strategic lead task distribution">
            <div className="space-y-4">
              {clientPortfolio.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50/20 border border-slate-100 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center text-[10.5px]">
                    <span className="font-bold text-slate-800">{item.name}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-50 border border-slate-150 font-bold text-[8.5px] text-slate-500 uppercase tracking-wider">
                      {item.status}
                    </span>
                  </div>
                  <ProgressBar percent={item.allocation} variant={item.variant} showLabel={true} />
                </div>
              ))}
            </div>
          </DashboardCard>
        </div>

        {/* Sidebar Info Panels */}
        <div className="space-y-6">
          {/* Credentials Card */}
          <DashboardCard glowColor="orange" title="Verification Status">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{profile.verifiedStatus}</h4>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">EpitomeTRC Advisor Network</span>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 flex items-center justify-between text-left">
                <div className="space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Global Availability</span>
                  <span className="text-xs font-bold text-slate-700">95% (Fully Active)</span>
                </div>
                <Globe className="h-5 w-5 text-slate-400" />
              </div>
            </div>
          </DashboardCard>

          {/* AI Advisor Assistant Insight */}
          <DashboardCard glowColor="indigo" title="AI Advisor Companion">
            <div className="space-y-3 relative overflow-hidden bg-gradient-to-br from-white to-slate-50/50">
              <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-200/10 rounded-full blur-xl pointer-events-none" />
              <div className="flex items-center gap-1 text-[10px] font-bold text-indigo-600">
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                <span>INTELLIGENT INSIGHTS</span>
              </div>
              <p className="text-slate-500 leading-relaxed text-[11px] font-sans">
                "GlobalTech Solutions lead has a high probability of closing. Focus 15% more allocation this week to finalized project parameters."
              </p>
            </div>
          </DashboardCard>
        </div>
      </div>
    </motion.div>
  );
}
