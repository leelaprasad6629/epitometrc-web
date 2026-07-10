"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { ArrowRight } from "lucide-react";

export default function ConsultingHero() {
  return (
    <section className="relative overflow-hidden bg-[#0b172a] pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0b172a] via-[#0f1f3d] to-[#0b172a]" />
      <Container className="relative z-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="outline" className="mb-4 border-white/20 bg-white/10 text-white">
              Dedicated to Professionalism
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Strategic Advisory for{" "}
              <span className="text-orange-500">Global Growth</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-slate-300 sm:text-lg">
              Navigate complex markets with confidence. Our consulting practice delivers data-driven insights, scalable solutions, and strategic alignment for enterprise leaders.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/contact" variant="primary" icon={ArrowRight}>
                Request Consultation
              </Button>
              <Button href="/blog" variant="ghost">
                View Case Studies
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative overflow-hidden rounded-2xl shadow-2xl"
          >
            <Image
              src="/images/boardroom_hero.jpg"
              alt="Business consulting strategy meeting"
              width={600}
              height={480}
              className="h-[360px] w-full object-cover sm:h-[420px]"
              priority
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
