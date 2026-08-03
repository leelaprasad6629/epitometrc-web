"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, ShieldCheck, Briefcase, GraduationCap, Building2, Layers } from "lucide-react";
import Container from "@/components/common/Container";

function AnimatedCounter({ value, duration = 1200 }: { value: string | number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const numStr = String(value).replace(/[^0-9]/g, "");
    const target = parseInt(numStr, 10);
    if (isNaN(target)) return;

    let start = 0;
    const end = target;
    if (start === end) return;

    let startTime: number | null = null;
    let animId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = progress * (2 - progress); // easeOutQuad
      setCount(Math.floor(easedProgress * (end - start) + start));
      if (progress < 1) {
        animId = requestAnimationFrame(step);
      }
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [value, duration]);

  const suffix = String(value).replace(/[0-9]/g, "");
  return <>{count.toLocaleString()}{suffix}</>;
}

export default function TrustedBy() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/company/info")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statsItems = [
    {
      label: "Trainings & Internships",
      value: stats?.trainingsInternships ? `${stats.trainingsInternships}+` : null,
      icon: GraduationCap,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      desc: "Careers upskilled & certified"
    },
    {
      label: "Corporate Clients",
      value: stats?.clients ? `${stats.clients}+` : null,
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      desc: "Partners globally served"
    },
    {
      label: "Projects Completed",
      value: stats?.projects ? `${stats.projects}+` : null,
      icon: Layers,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      desc: "Enterprise tech deliverables"
    },
    {
      label: "College Partners",
      value: stats?.collegeTieUps ? `${stats.collegeTieUps}+` : null,
      icon: Award,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
      desc: "Institutional collaboration nodes"
    }
  ];

  return (
    <section className="bg-gradient-to-b from-white to-slate-50/50 py-16 md:py-24 border-y border-slate-100">
      <Container className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="rounded bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
            Our Global Footprint
          </span>
          <h2 className="font-display text-3xl font-bold text-[#0b172a] sm:text-4xl">
            Empowering Talent &amp; Organizations
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Consistently delivering strategy par excellence. Our live operational statistics are dynamically synchronized directly with the official EpitomeTRC hub.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {statsItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                <div className="space-y-4">
                  <div className={`p-3 rounded-xl ${item.bgColor} ${item.color} w-fit shadow-sm`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    {loading ? (
                      <div className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg mb-1" />
                    ) : (
                      <h3 className="font-display text-3xl font-extrabold text-[#0b172a] tracking-tight leading-none">
                        {item.value ? <AnimatedCounter value={item.value} /> : "—"}
                      </h3>
                    )}
                    <p className="text-sm font-bold text-slate-700 mt-2">
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium font-sans">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 h-24 w-24 bg-slate-50 rounded-full translate-x-12 -translate-y-12 -z-10 group-hover:scale-110 transition-transform duration-300" />
              </motion.div>
            );
          })}
        </div>

        {/* Credibility Indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 border-t border-slate-100/80 max-w-4xl mx-auto text-slate-400 font-semibold tracking-wider text-[10px]">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>ISO 9001:2015 CERTIFIED PARTNER</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>SECURE SSL 256-BIT ENCRYPTION</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>PAN INDIA RECRUITMENT NODES</span>
          </div>
        </div>
      </Container>
    </section>
  );
}
