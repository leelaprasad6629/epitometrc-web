import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "orange" | "navy" | "outline";
  className?: string;
};

const variants = {
  default: "bg-slate-100 text-slate-700",
  orange: "bg-orange-100 text-orange-600 border border-orange-200",
  navy: "bg-[#0b172a] text-white",
  outline: "border border-slate-200 bg-white text-slate-600",
};

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
