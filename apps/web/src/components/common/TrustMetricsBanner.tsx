"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Award, GraduationCap, Building2, Users, CheckCircle2 } from "lucide-react";
import Container from "@/components/common/Container";

interface TrustMetricsBannerProps {
  variant?: "light" | "dark" | "orange";
  className?: string;
}

export default function TrustMetricsBanner({
  variant = "light",
  className = ""
}: TrustMetricsBannerProps) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/company/info")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const internshipCount = stats?.trainingsInternships ? `${stats.trainingsInternships}+` : "7000+";
  const clientCount = stats?.clients ? `${stats.clients}+` : "340+";
  const collegeCount = stats?.collegeTieUps ? `${stats.collegeTieUps}+` : "200+";

  const isDark = variant === "dark";
  const isOrange = variant === "orange";

  let containerBg = "bg-white border-slate-100 shadow-sm";
  let textColor = "text-[#0b172a]";
  let labelColor = "text-slate-500";
  let badgeBg = "bg-orange-50 text-orange-600 border-orange-100";

  if (isDark) {
    containerBg = "bg-[#0b172a] border-slate-800 shadow-xl";
    textColor = "text-white";
    labelColor = "text-slate-400";
    badgeBg = "bg-orange-500/10 text-orange-400 border-orange-500/20";
  } else if (isOrange) {
    containerBg = "bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 border-transparent shadow-xl";
    textColor = "text-white";
    labelColor = "text-orange-100";
    badgeBg = "bg-white/20 text-white border-white/30";
  }

  return (
    <div className={`py-6 border-y ${containerBg} ${className}`}>
      <Container>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
          
          {/* Highlight 1: 7000+ Internships Facilitated */}
          <div className="flex items-center gap-3.5">
            <div className={`p-2.5 rounded-2xl shrink-0 border ${badgeBg}`}>
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className={`font-display text-xl font-extrabold ${textColor} tracking-tight leading-none`}>
                🚀 {internshipCount}
              </div>
              <div className={`text-[11px] font-bold ${labelColor} uppercase tracking-wider mt-1`}>
                Internships Facilitated
              </div>
            </div>
          </div>

          {/* Highlight 2: Corporate Clients */}
          <div className="flex items-center gap-3.5">
            <div className={`p-2.5 rounded-2xl shrink-0 border ${badgeBg}`}>
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className={`font-display text-xl font-extrabold ${textColor} tracking-tight leading-none`}>
                {clientCount}
              </div>
              <div className={`text-[11px] font-bold ${labelColor} uppercase tracking-wider mt-1`}>
                Corporate Clients
              </div>
            </div>
          </div>

          {/* Highlight 3: College Tie-ups */}
          <div className="flex items-center gap-3.5">
            <div className={`p-2.5 rounded-2xl shrink-0 border ${badgeBg}`}>
              <Award className="h-5 w-5" />
            </div>
            <div>
              <div className={`font-display text-xl font-extrabold ${textColor} tracking-tight leading-none`}>
                {collegeCount}
              </div>
              <div className={`text-[11px] font-bold ${labelColor} uppercase tracking-wider mt-1`}>
                Academic Tie-ups
              </div>
            </div>
          </div>

          {/* Highlight 4: ISO 9001:2015 Certification */}
          <div className="flex items-center gap-3.5">
            <div className={`p-2.5 rounded-2xl shrink-0 border ${badgeBg}`}>
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className={`font-display text-xs font-extrabold ${textColor} uppercase tracking-wider leading-snug`}>
                ISO 9001:2015
              </div>
              <div className={`text-[10px] font-semibold ${labelColor} mt-0.5`}>
                Certified Quality Partner
              </div>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
