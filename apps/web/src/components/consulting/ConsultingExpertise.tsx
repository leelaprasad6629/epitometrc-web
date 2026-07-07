"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, Cog, TrendingUp, Merge } from "lucide-react";
import { motion } from "framer-motion";
import Container from "@/components/common/Container";
import SectionTitle from "@/components/common/SectionTitle";

const expertise = [
  {
    icon: Building2,
    title: "Strategy",
    items: ["Market Entry Strategy", "Competitive Positioning", "Growth Planning"],
    image: "/images/scaling_operations_insight.jpg",
    variant: "light" as const,
  },
  {
    icon: Cog,
    title: "Process Improvement",
    description: "Optimize workflows and operational efficiency with proven frameworks and continuous improvement methodologies.",
    variant: "dark" as const,
  },
  {
    icon: TrendingUp,
    title: "Scaling Foundation",
    description: "Build scalable infrastructure and processes that support rapid growth without compromising quality or culture.",
    variant: "light" as const,
  },
  {
    icon: Merge,
    title: "Mergers & Acquisitions",
    description: "Navigate complex M&A transactions with due diligence, integration planning, and post-merger optimization strategies.",
    image: "/images/executive_trust.jpg",
    variant: "wide" as const,
  },
];

export default function ConsultingExpertise() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionTitle
          eyebrow="Capabilities"
          title="Our Expertise"
          description="Comprehensive consulting services tailored to your industry, scale, and strategic objectives."
          align="center"
          className="mx-auto mb-12"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {expertise.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`rounded-2xl border p-6 ${
                item.variant === "dark"
                  ? "border-slate-800 bg-[#0b172a] text-white lg:col-span-1"
                  : item.variant === "wide"
                    ? "border-slate-100 bg-white md:col-span-2 lg:col-span-3"
                    : "border-slate-100 bg-white"
              }`}
            >
              {item.variant === "wide" ? (
                <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-2">
                  <div>
                    <item.icon className="mb-4 h-8 w-8 text-orange-500" />
                    <h3 className="font-display text-2xl font-bold text-[#0b172a]">{item.title}</h3>
                    <p className="mt-3 font-sans text-sm text-slate-600">{item.description}</p>
                  </div>
                  {item.image && (
                    <div className="relative h-48 overflow-hidden rounded-xl md:h-56">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                </div>
              ) : item.variant === "dark" ? (
                <>
                  <item.icon className="mb-4 h-8 w-8 text-orange-500" />
                  <h3 className="font-display text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 font-sans text-sm text-slate-300">{item.description}</p>
                  <Link href="/contact" className="mt-4 inline-flex items-center text-sm font-semibold text-orange-400 hover:text-orange-300">
                    Learn More <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </>
              ) : (
                <>
                  <h3 className="font-display text-xl font-bold text-[#0b172a]">{item.title}</h3>
                  {item.items && (
                    <ul className="mt-4 space-y-2">
                      {item.items.map((li) => (
                        <li key={li} className="flex items-center font-sans text-sm text-slate-600">
                          <span className="mr-2 h-1.5 w-1.5 rounded-full bg-orange-500" />
                          {li}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.description && (
                    <p className="mt-3 font-sans text-sm text-slate-600">{item.description}</p>
                  )}
                  {item.image && (
                    <div className="relative mt-4 h-32 overflow-hidden rounded-xl">
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    </div>
                  )}
                </>
              )}
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
