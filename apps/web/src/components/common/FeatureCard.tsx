import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  variant?: "default" | "dark" | "orange";
  href?: string;
  className?: string;
};

export default function FeatureCard({
  title,
  description,
  icon: Icon,
  variant = "default",
  className,
}: FeatureCardProps) {
  const styles = {
    default: "border-slate-100 bg-white",
    dark: "border-slate-800 bg-[#0b172a] text-white",
    orange: "border-orange-400 bg-orange-500 text-white",
  };

  return (
    <div
      className={cn(
        "rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md",
        styles[variant],
        className,
      )}
    >
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
          variant === "dark" || variant === "orange"
            ? "bg-white/10 text-white"
            : "bg-orange-50 text-orange-500",
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3
        className={cn(
          "font-display text-lg font-bold",
          variant === "default" ? "text-[#0b172a]" : "text-white",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-2 font-sans text-sm leading-relaxed",
          variant === "default" ? "text-slate-600" : "text-slate-200",
        )}
      >
        {description}
      </p>
    </div>
  );
}
