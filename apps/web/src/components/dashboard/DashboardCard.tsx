"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "blue" | "indigo" | "purple" | "orange" | "none";
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

export default function DashboardCard({
  children,
  className,
  glowColor = "none",
  title,
  subtitle,
  headerAction
}: DashboardCardProps) {
  const glowClasses = {
    none: "",
    blue: "hover:shadow-blue-500/10 hover:border-blue-200/50",
    indigo: "hover:shadow-indigo-500/10 hover:border-indigo-200/50",
    purple: "hover:shadow-purple-500/10 hover:border-purple-200/50",
    orange: "hover:shadow-orange-500/10 hover:border-orange-200/50"
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 relative overflow-hidden",
        glowColor !== "none" && "hover:shadow-md",
        glowClasses[glowColor],
        className
      )}
    >
      {/* Accent Top Gradient Line */}
      {glowColor !== "none" && (
        <div className={cn(
          "absolute top-0 left-0 right-0 h-1",
          glowColor === "blue" && "bg-gradient-to-r from-blue-400 to-indigo-500",
          glowColor === "indigo" && "bg-gradient-to-r from-indigo-400 to-purple-500",
          glowColor === "purple" && "bg-gradient-to-r from-purple-400 to-pink-500",
          glowColor === "orange" && "bg-gradient-to-r from-orange-400 to-amber-500"
        )} />
      )}

      {/* Header section */}
      {(title || subtitle || headerAction) && (
        <div className="flex justify-between items-start gap-4 mb-4 pb-3 border-b border-slate-50">
          <div>
            {title && (
              <h3 className="font-display text-xs.5 font-bold text-slate-800 tracking-tight leading-none">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[10px] text-slate-400 font-semibold mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
