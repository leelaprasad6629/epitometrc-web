"use client";

import { Shield, Lightbulb, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import FeatureCard from "@/components/common/FeatureCard";

const values = [
  {
    icon: Shield,
    title: "Integrity",
    description: "We operate with transparency and accountability in every engagement, building trust that endures.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We continuously evolve our methodologies to deliver cutting-edge solutions for modern challenges.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "We partner deeply with clients, treating their goals as our own and fostering shared success.",
  },
  {
    icon: TrendingUp,
    title: "Excellence",
    description: "We hold ourselves to the highest standards of quality, precision, and measurable impact.",
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
