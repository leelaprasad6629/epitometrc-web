"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import Button from "@/components/common/Button";
import { GraduationCap } from "lucide-react";

export default function TrainingHero() {
  return (
    <section className="bg-white pt-28 pb-16 md:pt-32 md:pb-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-display text-4xl font-bold leading-tight text-[#0b172a] sm:text-5xl">
              Accelerate Your Career with Industry Experts
            </h1>
            <p className="mt-6 font-sans text-base leading-relaxed text-slate-600 sm:text-lg">
              Bridging the gap between academic learning and industry demands. Join our elite training ecosystem designed for the next generation of tech leaders.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/internships" variant="primary">Join our Internship</Button>
              <Button href="/courses" variant="outline">View Programs</Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <Image
                src="/images/ai_recruitment_insight.jpg"
                alt="Professional working at dual monitor setup"
                width={600}
                height={480}
                className="h-[360px] w-full object-cover"
                priority
              />
            </div>
            <div className="absolute bottom-4 left-4 flex max-w-xs items-start gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-lg">
              <GraduationCap className="h-6 w-6 shrink-0 text-orange-500" />
              <p className="font-sans text-xs text-slate-600">
                Industry Expert. Learn from the best CTOs and Senior Developers across the globe.
              </p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
