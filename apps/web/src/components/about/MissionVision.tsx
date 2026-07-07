"use client";

import { Target, Eye } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

const items = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower organizations with strategic clarity and executable solutions that drive sustainable growth, operational efficiency, and competitive advantage in an evolving global landscape.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To be the definitive partner for enterprise transformation — where strategy, technology, and human capital converge to create lasting value for our clients and communities.",
  },
];

export default function MissionVision() {
  return (
    <section className="bg-[#f8fafd] py-16 md:py-24">
      <Container>
        <SectionTitle
          eyebrow="Purpose"
          title="Mission & Vision"
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {items.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold text-[#0b172a]">{item.title}</h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
