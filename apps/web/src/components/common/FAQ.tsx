"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types/common";

type FAQProps = {
  items: FAQItem[];
  title?: string;
  description?: string;
  className?: string;
};

export default function FAQ({ items, title, description, className }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className={cn("py-16 md:py-20", className)}>
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {(title || description) && (
          <div className="mb-10 text-center">
            {title && (
              <h2 className="font-display text-3xl font-bold text-[#0b172a]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 font-sans text-slate-600">{description}</p>
            )}
          </div>
        )}
        <div className="space-y-3">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left font-sans text-sm font-semibold text-[#0b172a] transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                  aria-expanded={isOpen}
                >
                  {item.question}
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-slate-400 transition-transform",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="border-t border-slate-100 px-5 py-4 font-sans text-sm leading-relaxed text-slate-600">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
