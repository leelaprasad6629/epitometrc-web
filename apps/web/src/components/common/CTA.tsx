"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { cn } from "@/lib/utils";

type CTAButton = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "navy" | "white";
};

type CTAProps = {
  title: string;
  description?: string;
  buttons: CTAButton[];
  variant?: "navy" | "orange" | "light";
  className?: string;
  highlightWord?: string;
};

export default function CTA({
  title,
  description,
  buttons,
  variant = "navy",
  className,
  highlightWord,
}: CTAProps) {
  const bgStyles = {
    navy: "bg-[#0b172a]",
    orange: "bg-gradient-to-r from-orange-500 to-[#e04e1a]",
    light: "bg-[#f8fafd] border border-slate-100",
  };

  const titleParts = highlightWord
    ? title.split(highlightWord)
    : null;

  return (
    <section className={cn("py-16 md:py-20", className)}>
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className={cn(
            "rounded-2xl px-8 py-12 text-center md:px-16 md:py-14",
            bgStyles[variant],
          )}
        >
          <h2
            className={cn(
              "font-display text-2xl font-bold sm:text-3xl md:text-4xl",
              variant === "light" ? "text-[#0b172a]" : "text-white",
            )}
          >
            {titleParts ? (
              <>
                {titleParts[0]}
                <span className="text-orange-400">{highlightWord}</span>
                {titleParts[1]}
              </>
            ) : (
              title
            )}
          </h2>
          {description && (
            <p
              className={cn(
                "mx-auto mt-4 max-w-2xl font-sans text-sm sm:text-base",
                variant === "light" ? "text-slate-600" : "text-slate-300",
              )}
            >
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {buttons.map((btn) => (
              <Button
                key={btn.label}
                href={btn.href}
                variant={btn.variant ?? (variant === "orange" ? "white" : "primary")}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
