"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatItem = {
  label: string;
  value: string;
  icon?: LucideIcon;
};

type StatisticsProps = {
  stats: StatItem[];
  variant?: "light" | "dark" | "bar";
  className?: string;
};

export default function Statistics({
  stats,
  variant = "light",
  className,
}: StatisticsProps) {
  return (
    <div
      className={cn(
        variant === "bar" && "rounded-2xl bg-slate-100 px-6 py-8",
        variant === "dark" && "rounded-2xl bg-[#0b172a] px-6 py-8",
        className,
      )}
    >
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="text-center md:text-left"
          >
            {stat.icon && (
              <stat.icon
                className={cn(
                  "mx-auto mb-2 h-6 w-6 md:mx-0",
                  variant === "dark" ? "text-orange-500" : "text-orange-500",
                )}
              />
            )}
            <p
              className={cn(
                "font-display text-2xl font-bold sm:text-3xl",
                variant === "dark" ? "text-white" : "text-[#0b172a]",
              )}
            >
              {stat.value}
            </p>
            <p
              className={cn(
                "mt-1 font-sans text-xs sm:text-sm",
                variant === "dark" ? "text-slate-400" : "text-slate-500",
              )}
            >
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
