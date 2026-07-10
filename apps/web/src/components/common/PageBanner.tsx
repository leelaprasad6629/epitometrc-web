"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

type PageBannerProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  variant?: "light" | "dark";
  buttons?: { label: string; href: string; variant?: "primary" | "secondary" | "outline" | "ghost" | "navy" | "white" }[];
  className?: string;
};

export default function PageBanner({
  title,
  description,
  eyebrow,
  variant = "light",
  buttons,
  className,
}: PageBannerProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={cn(
        "pt-28 pb-16 md:pt-32 md:pb-20",
        isDark ? "bg-[#0b172a]" : "bg-white",
        className,
      )}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          {eyebrow && (
            <Badge variant="orange" className="mb-4">
              {eyebrow}
            </Badge>
          )}
          <h1
            className={cn(
              "font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl",
              isDark ? "text-white" : "text-[#0b172a]",
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-4 max-w-2xl font-sans text-base leading-relaxed sm:text-lg",
                isDark ? "text-slate-300" : "text-slate-600",
              )}
            >
              {description}
            </p>
          )}
          {buttons && buttons.length > 0 && (
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              {buttons.map((btn) => (
                <Button key={btn.label} href={btn.href} variant={btn.variant ?? "primary"}>
                  {btn.label}
                </Button>
              ))}
            </div>
          )}
        </motion.div>
      </Container>
    </section>
  );
}
