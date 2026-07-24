"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";

export default function FounderMessage() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-tr from-blue-50/20 via-violet-50/10 to-slate-50 border-y border-slate-100/50">
      <Container>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Text Message Column (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="space-y-2">
              <span className="rounded-full bg-orange-50 px-3.5 py-1 text-xs font-bold text-orange-600 tracking-wider uppercase inline-block">
                CEO Message
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-[#0b172a] leading-tight">
                Amazing Expertise in Training, Recruitment & Consulting
              </h2>
            </div>
            
            <div className="font-sans text-slate-600 text-sm md:text-base leading-relaxed space-y-4">
              <p className="font-bold text-slate-800">Dear Valued Clients and Partners,</p>
              <p>
                At Epitome Training and Recruitment Consultants (EpitomeTRC), based in Madhya Pradesh, India, we take immense pride in being a globally recognized leader in training, recruitment, and consulting services. Our multicultural and dynamic approach is rooted in our unwavering commitment to meticulous due diligence and exceptional service delivery.
              </p>
              <p>
                We specialize in providing customized solutions tailored to meet your unique needs across recruitment, training, development, and consulting.
              </p>
              <p>
                We firmly believe that our success is intricately connected to yours, creating a partnership that fosters mutual growth and innovation. With a relentless focus on continuous improvement, we are dedicated to bridging the gap between our current achievements and our future aspirations, ensuring that we continue to exceed your expectations.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100/80 flex flex-col space-y-1 font-sans">
              <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Warm Regards,</p>
              <p className="text-base font-display font-extrabold text-[#0b172a]">Y. Sree Lakshmi</p>
              <p className="text-xs text-orange-500 font-semibold">CEO & Founder, EpitomeTRC</p>
            </div>
          </motion.div>

          {/* Photo Column (5 cols) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-[380px] lg:max-w-none aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent z-10 pointer-events-none" />
              <Image
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=1000&fit=crop&crop=faces"
                alt="Y. Sree Lakshmi - CEO & Founder"
                fill
                priority
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            
            {/* Soft decorative visual background elements */}
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-violet-200/40 blur-3xl -z-10 animate-pulse" />
            <div className="absolute -top-6 -left-6 h-32 w-32 rounded-full bg-cyan-200/40 blur-3xl -z-10" />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
