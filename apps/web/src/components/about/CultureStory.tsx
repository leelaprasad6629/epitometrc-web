"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";

export default function CultureStory() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Image Column (5 cols) - placed first to alternate layouts */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative order-last lg:order-first"
          >
            <div className="relative mx-auto max-w-[380px] lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-100 bg-slate-50 group">
              <Image
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=600&fit=crop"
                alt="EpitomeTRC Company Culture"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            
            {/* Visual background details */}
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-3xl bg-orange-100/50 -z-10 rotate-12" />
            <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-blue-50/70 -z-10" />
          </motion.div>

          {/* Culture Text Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-2">
              <span className="rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-600 tracking-wider uppercase inline-block">
                Our Culture
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#0b172a] leading-tight">
                For entrepreneurs, by entrepreneurs.
              </h2>
            </div>
            
            <div className="font-sans text-slate-600 text-sm md:text-base leading-relaxed space-y-4">
              <p>
                At EpitomeTRC, we understand that genuine success is rooted in focused and intentional work. Our organization reflects this belief by prioritizing the satisfaction of both our team and our clients.
              </p>
              <p>
                We set realistic standards that align with the expectations of our Training, Recruitment, Development, and Consulting Services. With a steadfast commitment to excellence, we embark on a collaborative journey toward success.
              </p>
              <p className="font-semibold text-slate-800 border-l-2 border-orange-500 pl-4 py-1 italic bg-orange-50/20 rounded-r-xl">
                We are resilient, adaptable, and always here to support you—your one-stop solution for all your needs. Join us, and let us help you navigate your path to success!
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
