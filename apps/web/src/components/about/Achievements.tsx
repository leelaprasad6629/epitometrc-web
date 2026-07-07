"use client";

import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import Statistics from "@/components/common/Statistics";

const stats = [
  { label: "Global Clients", value: "500+" },
  { label: "Projects Delivered", value: "1,200+" },
  { label: "Industry Experts", value: "150+" },
  { label: "Countries Served", value: "35+" },
];

export default function Achievements() {
  return (
    <section className="bg-[#0b172a] py-16 md:py-24">
      <Container>
        <SectionTitle
          eyebrow="Impact"
          title="Achievements That Define Us"
          description="Measurable outcomes across consulting, recruitment, and technology engagements worldwide."
          align="center"
          light
          className="mx-auto mb-12"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Statistics stats={stats} variant="dark" />
        </motion.div>
      </Container>
    </section>
  );
}
