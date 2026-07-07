"use client";

import { motion } from "framer-motion";
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
    <section className={dark ? "bg-[#0b172a] py-16 md:py-20" : "py-16 md:py-20"}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || description) && (
          <div className="mb-12 text-center">
            {title && (
              <h2
                className={`font-display text-3xl font-bold ${dark ? "text-white" : "text-[#0b172a]"}`}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className={`mt-3 font-sans ${dark ? "text-slate-400" : "text-slate-600"}`}>
                {description}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.blockquote
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`rounded-2xl border p-6 ${
                dark
                  ? "border-slate-800 bg-slate-900/50"
                  : "border-slate-100 bg-white shadow-sm"
              }`}
            >
              <p
                className={`font-sans text-sm leading-relaxed ${
                  dark ? "text-slate-300" : "text-slate-600"
                }`}
              >
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-4 border-t border-slate-200/20 pt-4">
                <cite className="not-italic">
                  <span
                    className={`block font-display text-sm font-bold ${
                      dark ? "text-white" : "text-[#0b172a]"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="font-sans text-xs text-slate-500">{item.role}</span>
                </cite>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
