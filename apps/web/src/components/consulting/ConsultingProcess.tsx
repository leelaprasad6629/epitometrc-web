"use client";

import { Search, Network, Settings, LineChart } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Discovery",
    description: "We begin with deep discovery sessions to understand your business, challenges, and strategic objectives.",
  },
  {
    number: "02",
    icon: Network,
    title: "Analysis",
    description: "Our team conducts comprehensive analysis using data, market research, and industry benchmarks.",
  },
  {
    number: "03",
    icon: Settings,
    title: "Implementation",
    description: "We execute tailored strategies with clear milestones, dedicated resources, and continuous oversight.",
  },
  {
    number: "04",
    icon: LineChart,
    title: "Optimization",
    description: "Post-implementation, we monitor outcomes and refine approaches for sustained performance gains.",
  },
];

export default function ConsultingProcess() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionTitle
          eyebrow="Methodology"
          title="Our Consulting Process"
          description="A proven four-phase approach that transforms strategic vision into measurable business outcomes."
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative text-center"
            >
              <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-slate-200">
                <step.icon className="h-7 w-7 text-[#0b172a]" />
                <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-xs font-bold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display text-lg font-bold text-[#0b172a]">{step.title}</h3>
              <p className="mt-2 font-sans text-sm text-slate-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
