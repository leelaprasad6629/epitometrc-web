"use client";

import { Shield, Eye, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import FeatureCard from "@/components/common/FeatureCard";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We are dedicated to implementing best practices and continually enhancing our processes.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Our culture promotes open communication, ensuring that customer value remains our top priority.",
  },
  {
    icon: Target,
    title: "Results-Oriented",
    description: "We focus on training and development workshops that guarantee effective outcomes.",
  },
  {
    icon: Sparkles,
    title: "Affordability",
    description: "We believe that personal growth drives company growth, and our services are designed to be budget-friendly.",
  },
];

export default function CoreValues() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionTitle
          eyebrow="What We Stand For"
          title="Core Values"
          description="The principles that guide every decision, partnership, and deliverable at EpitomeTRC."
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <FeatureCard {...value} />
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
