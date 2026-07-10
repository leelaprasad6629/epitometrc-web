"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

const leaders = [
  {
    name: "Michael James",
    role: "Chief Executive Officer",
    image: "/images/boardroom_hero.jpg",
  },
  {
    name: "Sarah Jenkins",
    role: "Head of Strategy",
    image: "/images/executive_trust.jpg",
  },
  {
    name: "David Chen",
    role: "VP of Technology",
    image: "/images/cloud_infra_insight.jpg",
  },
  {
    name: "Emily Rodriguez",
    role: "Director of Talent",
    image: "/images/ai_recruitment_insight.jpg",
  },
];

export default function Leadership() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionTitle
          eyebrow="Leadership"
          title="Meet Our Executive Team"
          description="Seasoned professionals driving strategic vision and operational excellence across every practice area."
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {leaders.map((leader, index) => (
            <motion.article
              key={leader.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
            >
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={leader.image}
                  alt={leader.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-[#0b172a]">{leader.name}</h3>
                <p className="mt-1 font-sans text-sm text-orange-500">{leader.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </section>
  );
}
