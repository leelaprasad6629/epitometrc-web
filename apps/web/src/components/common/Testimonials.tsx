"use client";

import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";
import type { Testimonial } from "@/types/common";

type TestimonialsProps = {
  testimonials: Testimonial[];
  title?: string;
  description?: string;
  dark?: boolean;
};

export default function Testimonials({
  testimonials,
  title,
  description,
  dark = false,
}: TestimonialsProps) {
  return (
    <section className={dark ? "bg-[#0b172a] py-16 md:py-24 text-white" : "py-16 md:py-24 bg-white"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="mb-12 text-center max-w-2xl mx-auto space-y-3">
            {title && (
              <h2
                className={`font-display text-3xl font-bold sm:text-4xl ${dark ? "text-white" : "text-[#0b172a]"}`}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className={`font-sans text-sm sm:text-base leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-3xl border p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                dark
                  ? "border-slate-800 bg-slate-900/80 hover:border-slate-700 shadow-xl"
                  : "border-slate-100 bg-white shadow-sm hover:shadow-md hover:border-orange-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-1 text-orange-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3" /> Verified
                  </span>
                </div>

                <p
                  className={`font-sans text-xs sm:text-sm leading-relaxed italic ${
                    dark ? "text-slate-300" : "text-slate-600"
                  }`}
                >
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              <footer className="mt-6 border-t border-slate-200/20 pt-4">
                <cite className="not-italic">
                  <span
                    className={`block font-display text-sm font-bold ${
                      dark ? "text-white" : "text-[#0b172a]"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="font-sans text-xs text-slate-400 block mt-0.5">{item.role}</span>
                  {item.company && (
                    <span className="font-sans text-[11px] font-bold text-orange-500 block mt-0.5">
                      {item.company}
                    </span>
                  )}
                </cite>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
