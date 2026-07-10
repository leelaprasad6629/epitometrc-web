import Link from "next/link";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "navy" | "white";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600",
  secondary:
    "bg-[#0b172a] text-white shadow-sm hover:bg-slate-800",
  outline:
    "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-[#0b172a]",
  ghost:
    "border border-white/40 bg-transparent text-white hover:bg-white/10 hover:border-white",
  navy:
    "bg-[#0b172a] text-white hover:bg-slate-800",
  white:
    "bg-white text-orange-600 hover:bg-slate-50",
};

const sizeStyles = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm font-semibold",
  lg: "px-6 py-3.5 text-base font-bold",
};

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  icon: Icon,
  iconPosition = "right",
  type = "button",
  disabled,
  onClick,
  ariaLabel,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon className="mr-2 h-4 w-4" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="ml-2 h-4 w-4" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      {content}
    </button>
  );
}
