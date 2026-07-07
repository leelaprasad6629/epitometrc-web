"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";
import Button from "@/components/common/Button";

const tracks = [
  {
    badge: "Internships",
    title: "Tech Internships",
    description: "Hands-on internship programs with real-world project impact and direct mentorship from industry leaders.",
    features: ["12-week intensive curriculum", "Direct mentorship", "Priority consideration for full-time roles"],
    href: "/internships",
    variant: "light" as const,
  },
  {
    badge: "Corporate",
    title: "Corporate Training",
    description: "Enterprise training for Agile, Cloud, and leadership excellence delivered by certified practitioners.",
    image: "/images/boardroom_hero.jpg",
    href: "/courses",
    variant: "dark" as const,
  },
];

export default function LearningTracks() {
  return (
    <section className="bg-[#f8fafd] py-16 md:py-24">
      <Container>
        <SectionTitle
          title="Specialized Learning Tracks"
          description="Choose the path that aligns with your career goals — from intensive internships to corporate upskilling."
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {tracks.map((track, index) => (
            <motion.div
              key={track.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl p-8 ${
                track.variant === "dark"
                  ? "bg-[#0b172a] text-white"
                  : "border border-slate-100 bg-slate-100"
              }`}
            >
              <span className="mb-3 inline-block rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                {track.badge}
              </span>
              <h3 className="font-display text-2xl font-bold">{track.title}</h3>
              <p className={`mt-3 font-sans text-sm ${track.variant === "dark" ? "text-slate-300" : "text-slate-600"}`}>
                {track.description}
              </p>
              {track.features && (
                <ul className="mt-4 space-y-2">
                  {track.features.map((f) => (
                    <li key={f} className="flex items-center font-sans text-sm text-slate-600">
                      <BookOpen className="mr-2 h-4 w-4 text-orange-500" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {track.image && (
                <div className="relative mt-6 h-40 overflow-hidden rounded-xl">
                  <Image src={track.image} alt={track.title} fill className="object-cover opacity-80" />
                </div>
              )}
              <Link
                href={track.href}
                className={`mt-6 inline-flex items-center text-sm font-semibold ${
                  track.variant === "dark" ? "text-orange-400 hover:text-orange-300" : "text-orange-500 hover:text-orange-600"
                }`}
              >
                Explore tracks <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
