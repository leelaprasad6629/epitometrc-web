"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  percent: number;
  className?: string;
  variant?: "blue" | "indigo" | "purple" | "orange";
  showLabel?: boolean;
}

export default function ProgressBar({
  percent,
  className,
  variant = "blue",
  showLabel = false
}: ProgressBarProps) {
  const roundedPercent = Math.min(100, Math.max(0, Math.round(percent)));

  const gradientClasses = {
    blue: "from-blue-400 to-indigo-500",
    indigo: "from-indigo-400 to-purple-500",
    purple: "from-purple-400 to-pink-500",
    orange: "from-orange-400 to-amber-500"
  };

  const bgClasses = {
    blue: "bg-blue-50",
    indigo: "bg-indigo-50",
    purple: "bg-purple-50",
    orange: "bg-orange-50"
  };

  return (
    <div className={cn("space-y-1.5 w-full font-sans text-[10.5px]", className)}>
      {showLabel && (
        <div className="flex justify-between items-center text-slate-500 font-semibold">
          <span>Completion Progress</span>
          <span className="font-bold text-slate-700">{roundedPercent}%</span>
        </div>
      )}
      <div className={cn("h-2.5 w-full rounded-full overflow-hidden relative", bgClasses[variant])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${roundedPercent}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn("h-full rounded-full bg-gradient-to-r", gradientClasses[variant])}
        />
      </div>
    </div>
  );
}

// ----------------------------------------------------
// Radial Circular Progress Ring Component
// ----------------------------------------------------
interface ProgressRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  variant?: "blue" | "indigo" | "purple" | "orange";
  className?: string;
  label?: string;
}

export function ProgressRing({
  percent,
  size = 72,
  strokeWidth = 6,
  variant = "indigo",
  className,
  label
}: ProgressRingProps) {
  const roundedPercent = Math.min(100, Math.max(0, Math.round(percent)));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (roundedPercent / 100) * circumference;

  const strokeColors = {
    blue: "#3b82f6",
    indigo: "#6366f1",
    purple: "#a855f7",
    orange: "#f97316"
  };

  const bgColors = {
    blue: "#eff6ff",
    indigo: "#eef2ff",
    purple: "#f3e8ff",
    orange: "#fff7ed"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center font-sans", className)}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="rotate-[-90deg]" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={bgColors[variant]}
            strokeWidth={strokeWidth}
          />
          {/* Animated active progress circle */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColors[variant]}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        {/* Centered Percentage Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-[11px] font-black text-slate-800 leading-none">
            {roundedPercent}%
          </span>
          {label && (
            <span className="text-[8px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">
              {label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
