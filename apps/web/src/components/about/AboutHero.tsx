"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import Badge from "@/components/common/Badge";
import Button from "@/components/common/Button";
import { ArrowRight } from "lucide-react";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-[#f8fafd] pt-28 pb-16 md:pt-32 md:pb-24">
      <div className="pointer-events-none absolute right-0 top-0 h-96 w-96 translate-x-12 -translate-y-12 rounded-full bg-orange-200/30 blur-3xl" />
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="orange" className="mb-4">
              About EpitomeTRC
            </Badge>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-[#0b172a] sm:text-5xl">
              Driving Strategic Excellence Across{" "}
              <span className="text-orange-500">Global Enterprise</span>
            </h1>
            <p className="mt-6 max-w-xl font-sans text-base leading-relaxed text-slate-600 sm:text-lg">
              We are a multidisciplinary consultancy bridging the gap between visionary strategy and operational execution. From recruitment to IT development, we empower organizations to thrive in complex markets.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Button href="/contact" variant="primary" icon={ArrowRight}>
                Partner With Us
              </Button>
              <Button href="/services" variant="outline">
                Explore Services
              </Button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="/images/executive_trust.jpg"
                alt="EpitomeTRC leadership team in strategic discussion"
                width={600}
                height={480}
                className="h-[360px] w-full object-cover sm:h-[420px]"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -left-4 rounded-xl border border-slate-100 bg-white p-4 shadow-lg sm:-bottom-6 sm:-left-6">
              <p className="font-display text-3xl font-bold text-orange-500">15+</p>
              <p className="font-sans text-xs text-slate-500">Years of Excellence</p>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
