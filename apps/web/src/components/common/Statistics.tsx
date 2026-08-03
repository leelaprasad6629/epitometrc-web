import { useEffect, useState } from "react";
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
              <AnimatedCounter value={stat.value} />
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
