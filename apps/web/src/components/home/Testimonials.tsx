"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";
import Container from "@/components/common/Container";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/company/info")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.testimonials) {
          setTestimonials(data.testimonials);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="bg-slate-50/70 py-20 md:py-28 border-t border-slate-100 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-10 w-96 h-96 rounded-full bg-orange-500/3 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-10 w-96 h-96 rounded-full bg-blue-500/3 blur-[120px] pointer-events-none" />
      
      <Container className="space-y-16 relative z-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="rounded bg-orange-50 border border-orange-100 px-3 py-1 text-xs font-bold text-orange-500 uppercase tracking-wider">
            Client &amp; Candidate Voices
          </span>
          <h2 className="font-display text-3xl font-bold sm:text-4xl text-[#0b172a] tracking-tight">
            Journey Par Excellence
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Real feedback from graduates placed into top companies and organizations that scale their IT development pipelines.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-8 space-y-6 animate-pulse shadow-sm">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-4 w-4 bg-slate-100 rounded-full" />
                  ))}
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-5/6" />
                  <div className="h-4 bg-slate-100 rounded w-4/5" />
                </div>
                <div className="h-8 bg-slate-100 rounded w-1/3 pt-4 border-t border-slate-100" />
              </div>
            ))
          ) : (
            testimonials.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-orange-500/20 transition-all hover:-translate-y-1 shadow-md shadow-slate-100/50"
              >
                <div>
                  <div className="flex space-x-1 mb-6 text-orange-400">
                    {Array.from({ length: item.stars }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-orange-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-sm font-sans leading-relaxed italic mb-8">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-[#0b172a] text-sm">
                      {item.author}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium font-sans mt-0.5">
                      {item.role}
                    </p>
                  </div>
                  <MessageSquare className="h-4 w-4 text-orange-500/20" />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
